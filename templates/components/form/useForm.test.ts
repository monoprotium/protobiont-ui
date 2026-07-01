import { describe, expect, it } from 'bun:test'
import { reactive } from 'vue'
import type { StandardSchemaV1 } from '../_shared/form'
import { useForm } from './useForm'

// Helpers (in-file, never shipped). A ~5-line fake schema exercises the
// Standard-Schema wiring directly; a deferred drives async by RESOLUTION
// ORDER (the actual contract) — deterministic, no fake timers.
type Validate = StandardSchemaV1.Props['validate']

function makeSchema(validate: Validate): StandardSchemaV1 {
  return { '~standard': { version: 1, vendor: 'test', validate } }
}

function defer<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

type Result = StandardSchemaV1.Result<unknown>
const fail = (...issues: { message: string; path?: PropertyKey[] }[]): Result => ({ issues })
const ok = (value: unknown): Result => ({ value })

// A few microtask turns — enough to drain the run() promise chain after a
// deferred resolves. NOT a sleep: nothing time-based is under test here.
const flush = async () => {
  for (let i = 0; i < 4; i++) await Promise.resolve()
}

describe('useForm — epoch guard (the clear/debounce race)', () => {
  it('rejects a stale write when clearErrors() supersedes an in-flight run', async () => {
    const d = defer<Result>()
    const form = useForm({ state: reactive({ x: '' }), schema: makeSchema(() => d.promise) })

    form.reportBlur('x') // starts run() — epoch 1, now awaiting the deferred
    form.clearErrors() // bumps epoch → 2 while run 1 is still in flight
    d.resolve(fail({ message: 'stale', path: ['x'] }))
    await flush()

    // The in-flight result belonged to epoch 1; the guard drops it.
    expect(Object.keys(form.errors)).toHaveLength(0)
  })

  it('lands the write when NOT superseded (proves the test above can fail)', async () => {
    const d = defer<Result>()
    const form = useForm({ state: reactive({ x: '' }), schema: makeSchema(() => d.promise) })

    form.reportBlur('x')
    d.resolve(fail({ message: 'bad', path: ['x'] }))
    await flush()

    expect(form.errors.x).toBe('bad')
  })

  it('a newer run supersedes an older one regardless of resolution order', async () => {
    const dA = defer<Result>()
    const dB = defer<Result>()
    let n = 0
    const schema = makeSchema(() => (n++ === 0 ? dA.promise : dB.promise))
    const form = useForm({ state: reactive({ x: '' }), schema })

    form.reportBlur('x') // run A — epoch 1
    form.reportBlur('x') // run B — epoch 2 (the truth-owner)
    dA.resolve(fail({ message: 'A', path: ['x'] })) // older run resolves first…
    await flush()
    dB.resolve(fail({ message: 'B', path: ['x'] })) // …newer run wins
    await flush()

    expect(form.errors.x).toBe('B')
  })
})

describe('useForm — display gating (reward early, punish late)', () => {
  const schema = makeSchema((v) =>
    (v as { x: string }).x ? ok(v) : fail({ message: 'required', path: ['x'] }),
  )

  it('hides a real error until the field is blurred, shows it after', async () => {
    const state = reactive({ x: '' })
    const form = useForm({ state, schema })

    await form.validate() // populates errors WITHOUT blurring or submitting
    expect(form.errors.x).toBe('required')
    expect(form.displayError('x')).toBeUndefined() // gate closed

    form.reportBlur('x')
    await flush()
    expect(form.displayError('x')).toBe('required') // gate open

    state.x = 'ok' // fix it
    await form.validate()
    expect(form.errors.x).toBeUndefined()
    expect(form.displayError('x')).toBeUndefined()
  })

  it('a submit attempt opens gating for every field at once', async () => {
    const form = useForm({ state: reactive({ x: '' }), schema })
    await form.submit() // submitCount → 1 before run; issues → onError, no submit

    // 'x' was never blurred, yet the post-submit gate shows it.
    expect(form.submitCount).toBe(1)
    expect(form.displayError('x')).toBe('required')
  })

  it('matches by pattern when given one', async () => {
    const arrSchema = makeSchema(() => fail({ message: 'bad item', path: ['tags', 0] }))
    const form = useForm({ state: reactive({ tags: [] as string[] }), schema: arrSchema })
    await form.submit()
    expect(form.displayError('tags', /^tags\./)).toBe('bad item')
  })
})

describe('useForm — error map shaping', () => {
  it('keeps the first message when a path repeats', async () => {
    const schema = makeSchema(() =>
      fail({ message: 'first', path: ['x'] }, { message: 'second', path: ['x'] }),
    )
    const form = useForm({ state: reactive({ x: '' }), schema })
    await form.validate()
    expect(form.errors.x).toBe('first')
  })

  it('keys errors by the dot-path of the object-form (Valibot) issue path', async () => {
    const schema = makeSchema(() =>
      fail({ message: 'bad', path: [{ key: 'user' } as unknown as PropertyKey, { key: 'email' } as unknown as PropertyKey] }),
    )
    const form = useForm({ state: reactive({ user: { email: '' } }), schema })
    await form.validate()
    expect(form.errors['user.email']).toBe('bad')
  })
})

describe('useForm — schema-less form', () => {
  it('passes through: validate() is true, reportInput a no-op, submit gets raw state', async () => {
    const state = reactive({ a: 1, b: 'two' })
    let received: unknown
    const form = useForm({ state, onSubmit: (o) => { received = o } })

    expect(await form.validate()).toBe(true)
    form.reportInput('a') // no schema → no-op, no throw
    await form.submit()

    expect(received).toEqual({ a: 1, b: 'two' })
  })
})

describe('useForm — double-submit guard', () => {
  it('ignores a second submit while the first is in flight', async () => {
    const d = defer<void>()
    let calls = 0
    const form = useForm({
      state: reactive({ a: 1 }),
      onSubmit: () => {
        calls++
        return d.promise
      },
    })

    const first = form.submit() // enters onSubmit, awaits d
    await form.submit() // meta.submitting is true → returns immediately
    expect(calls).toBe(1)

    d.resolve()
    await first
    expect(calls).toBe(1)
    expect(form.submitting).toBe(false)
  })
})

describe('useForm — setErrors / clearErrors / reset', () => {
  it('merges by default and replaces on demand', () => {
    const form = useForm({ state: reactive({}) })
    form.setErrors({ a: 'ea', b: 'eb' })
    form.setErrors({ b: 'eb2', c: 'ec' }) // merge (default)
    expect(form.errors.a).toBe('ea')
    expect(form.errors.b).toBe('eb2')
    expect(form.errors.c).toBe('ec')

    form.setErrors({ z: 'ez' }, 'replace')
    expect(form.errors.a).toBeUndefined()
    expect(form.errors.z).toBe('ez')
  })

  it('accepts the array form', () => {
    const form = useForm({ state: reactive({}) })
    form.setErrors([{ name: 'q', message: 'eq' }], 'replace')
    expect(form.errors.q).toBe('eq')
  })

  it('clears one field or all', () => {
    const form = useForm({ state: reactive({}) })
    form.setErrors({ m: 'em', n: 'en' }, 'replace')
    form.clearErrors('m')
    expect(form.errors.m).toBeUndefined()
    expect(form.errors.n).toBe('en')
    form.clearErrors()
    expect(Object.keys(form.errors)).toHaveLength(0)
  })

  it('reset clears errors, the blurred set, and submitCount', async () => {
    const state = reactive({ a: 1 })
    const form = useForm({ state })
    form.setErrors({ a: 'x' }, 'replace')
    form.reportBlur('a')
    await form.submit() // submitCount → 1
    expect(form.submitCount).toBe(1)

    form.reset()
    expect(Object.keys(form.errors)).toHaveLength(0)
    expect(form.submitCount).toBe(0)

    // blurred was cleared too: a fresh error stays gated again.
    form.setErrors({ a: 'x' }, 'replace')
    expect(form.displayError('a')).toBeUndefined()
  })
})
