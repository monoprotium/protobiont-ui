import { describe, expect, it } from 'bun:test'
import type { PrtOption } from '../_shared/types'
import { firstFocusable, isActive, moveFocus, toggle } from './navigation'

// Pins the segmented selection + roving-focus contract: single vs multiple
// activeness, the no-mutation/fresh-array toggle, initial-focus precedence,
// and skip-disabled WITH WRAP (the T6 trap — distinct from the listbox no-wrap
// move). The items[i].focus() side-effect is the component's shell.

const opts = (...flags: boolean[]): PrtOption[] =>
  flags.map((disabled, i) => ({ value: i, label: String(i), disabled }))

describe('isActive', () => {
  it('single: strict identity', () => {
    expect(isActive('a', 'single', 'a')).toBe(true)
    expect(isActive('a', 'single', 'b')).toBe(false)
  })

  it('multiple: array membership (and a non-array model is never active)', () => {
    expect(isActive(['a', 'c'], 'multiple', 'c')).toBe(true)
    expect(isActive(['a', 'c'], 'multiple', 'b')).toBe(false)
    expect(isActive('a', 'multiple', 'a')).toBe(false) // model isn't an array
    expect(isActive(undefined, 'multiple', 'a')).toBe(false)
  })
})

describe('toggle (multiple mode)', () => {
  it('adds a missing value and removes a present one', () => {
    expect(toggle(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggle(['a', 'b'], 'a')).toEqual(['b'])
  })

  it('treats a non-array model as empty', () => {
    expect(toggle(undefined, 'a')).toEqual(['a'])
    expect(toggle('a', 'b')).toEqual(['b'])
  })

  it('never mutates the model (returns a fresh array)', () => {
    const model = ['a', 'b']
    const next = toggle(model, 'a')
    expect(model).toEqual(['a', 'b'])
    expect(next).not.toBe(model)
  })
})

describe('firstFocusable', () => {
  it('prefers the active-and-enabled option', () => {
    expect(firstFocusable(opts(false, false, false), 1, 'single')).toBe(1)
  })

  it('skips an active-but-disabled option, falling to first-enabled', () => {
    // index 1 is active but disabled → first enabled is index 0
    expect(firstFocusable(opts(false, true, false), 1, 'single')).toBe(0)
  })

  it('falls to first-enabled when nothing is active', () => {
    expect(firstFocusable(opts(true, false, false), 'zzz', 'single')).toBe(1)
  })

  it('falls back to 0 when every option is disabled', () => {
    expect(firstFocusable(opts(true, true, true), 'zzz', 'single')).toBe(0)
  })
})

describe('moveFocus — skip-disabled WITH wrap (T6)', () => {
  it('advances to the next enabled index', () => {
    expect(moveFocus(opts(false, false, false), 0, 1, false)).toBe(1)
    expect(moveFocus(opts(false, false, false), 2, -1, false)).toBe(1)
  })

  it('skips disabled options in the travel direction', () => {
    // from 0, forward, index 1 disabled → lands on 2
    expect(moveFocus(opts(false, true, false), 0, 1, false)).toBe(2)
  })

  it('WRAPS past the ends', () => {
    expect(moveFocus(opts(false, false, false), 2, 1, false)).toBe(0) // forward off the end
    expect(moveFocus(opts(false, false, false), 0, -1, false)).toBe(2) // backward off the start
  })

  it('wraps over a disabled end to the first enabled', () => {
    // from 1 forward: 2 disabled → wrap → 0 enabled
    expect(moveFocus(opts(false, false, true), 1, 1, false)).toBe(0)
  })

  it('returns -1 when every option is disabled (loop exhausts, no move)', () => {
    expect(moveFocus(opts(true, true, true), 0, 1, false)).toBe(-1)
  })

  it('returns -1 when the whole group is disabled', () => {
    expect(moveFocus(opts(false, false, false), 0, 1, true)).toBe(-1)
  })
})
