import { describe, expect, it } from 'bun:test'
import { allComponents, getComponent, resolveWithDependencies } from './registry'

// Property tests against the real registry.json (no DI) — resolver runs on consumer machines; a missing transitive dep silently corrupts their install.

describe('resolveWithDependencies — closure completeness (the centerpiece)', () => {
  it('every resolved entry has all of its internalDependencies in the closure', () => {
    for (const { name } of allComponents()) {
      const closure = resolveWithDependencies([name])
      for (const entry of closure.values()) {
        for (const dep of entry.internalDependencies) {
          expect(closure.has(dep)).toBe(true) // no dangling edge
        }
      }
    }
  })

  it('always includes the requested component itself', () => {
    for (const { name } of allComponents()) {
      expect(resolveWithDependencies([name]).has(name)).toBe(true)
    }
  })
})

describe('resolveWithDependencies — dedupe / diamond', () => {
  it('returns each component exactly once across the whole closure', () => {
    for (const { name } of allComponents()) {
      const names = [...resolveWithDependencies([name]).keys()]
      expect(new Set(names).size).toBe(names.length) // no duplicate names
    }
  })

  it('a shared transitive dep appears once (real diamond)', () => {
    // PrtAudioRecorder → [PrtBtn, PrtAudioPlayer]; PrtAudioPlayer → [PrtBtn, …]
    // so PrtBtn is reachable by two paths — it must resolve a single time.
    const closure = resolveWithDependencies(['PrtAudioRecorder'])
    const names = [...closure.keys()]
    expect(names.filter((n) => n === 'PrtBtn')).toHaveLength(1)
    expect(closure.has('PrtAudioPlayer')).toBe(true)
    expect(closure.has('PrtBtn')).toBe(true)
  })

  it('merges multiple requested roots into one deduped closure', () => {
    const closure = resolveWithDependencies(['PrtAudioPlayer', 'PrtBtn'])
    const names = [...closure.keys()]
    expect(new Set(names).size).toBe(names.length)
    expect(closure.has('PrtBtn')).toBe(true)
  })
})

describe('getComponent', () => {
  it('resolves a direct PascalCase name', () => {
    expect(getComponent('PrtBtn')?.name).toBe('PrtBtn')
  })

  it('resolves a lowercase folder name to the same entry', () => {
    expect(getComponent('btn')?.name).toBe('PrtBtn')
    expect(getComponent('btn')).toBe(getComponent('PrtBtn'))
  })

  it('returns null for an unknown name', () => {
    expect(getComponent('PrtDefinitelyNotAComponent')).toBeNull()
    expect(getComponent('not-a-folder')).toBeNull()
  })
})

describe('resolveWithDependencies — unknown name', () => {
  it('throws when a requested component is not in the registry', () => {
    expect(() => resolveWithDependencies(['PrtNope'])).toThrow(/not found in registry/)
  })
})

// resolveWithDependencies TOLERATES cycles — resolved.has() before recursing makes A→B→A terminate and dedupe, not throw.
// No cycle test: a real registry can't contain one (would only matter under DI).
