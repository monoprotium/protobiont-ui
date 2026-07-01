import { describe, expect, it } from 'bun:test'
import { toDotPath } from './form'

// toDotPath normalizes BOTH Standard-Schema path-segment shapes — a raw
// PropertyKey and the `{ key }` object form Valibot emits — into a dot path.
// Contract-shaped: the dot-path string is what keys the flat error map, so it
// survives any rewrite of the form layer. (form.ts:57)
describe('toDotPath', () => {
  it('joins string segments with dots', () => {
    expect(toDotPath(['user', 'email'])).toBe('user.email')
  })

  it('returns a single segment unchanged', () => {
    expect(toDotPath(['title'])).toBe('title')
  })

  it('coerces a numeric array index', () => {
    expect(toDotPath(['tags', 0])).toBe('tags.0')
  })

  it('reads the { key } object form (the Valibot path)', () => {
    expect(toDotPath([{ key: 'user' }, { key: 'email' }])).toBe('user.email')
  })

  it('mixes object form and a numeric index', () => {
    expect(toDotPath([{ key: 'tags' }, 0])).toBe('tags.0')
  })

  it('maps an empty path to the empty string (the form-root fallback)', () => {
    expect(toDotPath([])).toBe('')
  })

  it('coerces a numeric { key } object segment', () => {
    expect(toDotPath([{ key: 'tags' }, { key: 0 }])).toBe('tags.0')
  })
})
