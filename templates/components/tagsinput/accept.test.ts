import { describe, expect, it } from 'bun:test'
import { accept, keyTags, splitPasted } from './accept'

// Pins the pure tag-field decisions: the 4-way accept verdict (incl. the cap
// applied per-piece against a running accumulator, which is what makes paste
// batches and internal duplicates behave), paste splitting's null-vs-empty
// distinction, and the occurrence-counter keying. The emit/flash/push are the
// component's shell and are not asserted here.

describe('accept — verdict', () => {
  it('empty is a silent no-op, never a reject', () => {
    expect(accept('', [])).toBe('empty')
  })

  it('admits a fresh tag', () => {
    expect(accept('vue', ['react'])).toBe('ok')
  })

  it('rejects an exact duplicate (case-sensitive) unless allowed', () => {
    expect(accept('vue', ['vue'])).toBe('duplicate')
    expect(accept('Vue', ['vue'])).toBe('ok') // exact compare — no lowercasing
    expect(accept('vue', ['vue'], { allowDuplicates: true })).toBe('ok')
  })

  it('rejects once the running list has reached max', () => {
    expect(accept('c', ['a', 'b'], { max: 2 })).toBe('max')
    expect(accept('c', ['a'], { max: 2 })).toBe('ok')
  })

  it('checks max before duplicate (a full list rejects with max, not duplicate)', () => {
    expect(accept('a', ['a', 'b'], { max: 2 })).toBe('max')
  })

  it('does not mutate the list it inspects', () => {
    const into = ['a']
    accept('b', into)
    expect(into).toEqual(['a'])
  })

  it('the cap applies per-piece against a growing accumulator (batch semantics)', () => {
    // simulate the component loop: push only on 'ok'
    const into: string[] = []
    const verdicts = ['a', 'a', 'b', 'c'].map((tag) => {
      const v = accept(tag, into, { max: 2 })
      if (v === 'ok') into.push(tag)
      return v
    })
    expect(verdicts).toEqual(['ok', 'duplicate', 'ok', 'max'])
    expect(into).toEqual(['a', 'b']) // first 'a' admitted, dup dropped, filled to cap
  })
})

describe('splitPasted', () => {
  it('returns null when there is no separator (plain paste, let it type)', () => {
    expect(splitPasted('hello', true)).toBeNull()
    expect(splitPasted('a,b', false)).toBeNull() // comma not a separator here
  })

  it('splits, trims, and drops empties on the active separators', () => {
    expect(splitPasted('a, b ,c', true)).toEqual(['a', 'b', 'c'])
    expect(splitPasted('a\n b\n\nc', false)).toEqual(['a', 'b', 'c'])
  })

  it('distinguishes "no separator" (null) from "separators but all empty" ([])', () => {
    // "\n\n" HAS a separator → preventDefault path, but yields no tags
    expect(splitPasted('\n\n', false)).toEqual([])
    expect(splitPasted('plain', false)).toBeNull()
  })

  it('treats comma as a separator only when commaCommits', () => {
    expect(splitPasted('a,b,c', true)).toEqual(['a', 'b', 'c'])
    expect(splitPasted('a,b\nc', false)).toEqual(['a,b', 'c']) // only the newline splits
  })
})

describe('keyTags', () => {
  it('keys by tag + occurrence counter (duplicates get distinct stable keys)', () => {
    expect(keyTags(['a', 'a', 'b'])).toEqual([
      { tag: 'a', key: 'a#0' },
      { tag: 'a', key: 'a#1' },
      { tag: 'b', key: 'b#0' },
    ])
  })

  it('produces unique keys whenever a tag repeats', () => {
    const keys = keyTags(['x', 'x', 'x', 'y', 'x']).map((k) => k.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
