import { describe, expect, it } from 'bun:test'
import type { ValueTaperPair } from './useValueEngine'
import {
  collide,
  keyboardStep,
  makeTaper,
  quantize,
  thumbBounds,
  valueFromRaw,
} from './useValueEngine'

// These pin INVARIANTS (endpoints, round-trips, monotonicity, clamp/push/swap
// shapes), never retuned magic numbers — so they survive a taper re-tune and
// guide it. They import the extracted pure math directly; the engine is never
// instantiated (no DOM, no onBeforeUnmount warning).

describe('makeTaper — linear', () => {
  const lin = makeTaper('linear', 0, 100)

  it('hits its endpoints exactly', () => {
    expect(lin.toPhase(0)).toBe(0)
    expect(lin.toPhase(100)).toBe(1)
    expect(lin.toValue(0)).toBe(0)
    expect(lin.toValue(1)).toBe(100)
  })

  it('round-trips value→phase→value across the range', () => {
    for (const v of [0, 12.5, 33, 50, 99, 100]) {
      expect(lin.toValue(lin.toPhase(v))).toBeCloseTo(v, 9)
    }
  })

  it('clamps inputs beyond the range', () => {
    expect(lin.toPhase(-20)).toBe(0)
    expect(lin.toPhase(140)).toBe(1)
    expect(lin.toValue(-0.5)).toBe(0)
    expect(lin.toValue(1.5)).toBe(100)
  })

  it('honours a non-zero min', () => {
    const t = makeTaper('linear', 20, 60)
    expect(t.toPhase(20)).toBe(0)
    expect(t.toPhase(60)).toBe(1)
    expect(t.toValue(0.5)).toBe(40)
  })

  it('passes a custom taper-pair object straight through', () => {
    const custom: ValueTaperPair = { toPhase: () => 0.42, toValue: () => 7 }
    expect(makeTaper(custom, 0, 100)).toBe(custom)
  })
})

describe('makeTaper — log (min > 0)', () => {
  const log = makeTaper('log', 20, 20000)

  it('hits its endpoints', () => {
    expect(log.toPhase(20)).toBeCloseTo(0, 9)
    expect(log.toPhase(20000)).toBeCloseTo(1, 9)
    expect(log.toValue(0)).toBeCloseTo(20, 9)
    expect(log.toValue(1)).toBeCloseTo(20000, 9)
  })

  it('puts the geometric mean at phase 0.5', () => {
    const ratio = 20000 / 20
    expect(log.toValue(0.5)).toBeCloseTo(20 * ratio ** 0.5, 6)
  })

  it('round-trips within tolerance', () => {
    for (const v of [50, 200, 1000, 5000]) {
      expect(log.toValue(log.toPhase(v))).toBeCloseTo(v, 6)
    }
  })

  it('falls back to linear when min <= 0 (the guarded branch)', () => {
    const fallback = makeTaper('log', 0, 100)
    const linRef = makeTaper('linear', 0, 100)
    for (const p of [0, 0.3, 0.7, 1]) {
      expect(fallback.toValue(p)).toBeCloseTo(linRef.toValue(p), 9)
    }
    expect(fallback.toValue(0.5)).toBe(50) // linear midpoint, not a geometric mean
  })
})

describe('makeTaper — db', () => {
  const db = makeTaper('db', -60, 6)

  it('hits its endpoints', () => {
    expect(db.toPhase(-60)).toBeCloseTo(0, 9)
    expect(db.toPhase(6)).toBeCloseTo(1, 9)
    expect(db.toValue(0)).toBeCloseTo(-60, 6)
    expect(db.toValue(1)).toBeCloseTo(6, 6)
  })

  it('is monotonic increasing (no magic-number unity-gain assert)', () => {
    let prev = Number.NEGATIVE_INFINITY
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const v = db.toValue(p)
      expect(v).toBeGreaterThan(prev)
      prev = v
    }
  })

  it('round-trips within tolerance', () => {
    for (const v of [-40, -12, 0, 3]) {
      expect(db.toValue(db.toPhase(v))).toBeCloseTo(v, 6)
    }
  })
})

describe('quantize', () => {
  it('without a step: clamps and tidies', () => {
    expect(quantize(50, 0, 100)).toBe(50)
    expect(quantize(-5, 0, 100)).toBe(0)
    expect(quantize(150, 0, 100)).toBe(100)
  })

  it('kills float noise (0.1 + 0.2 → 0.3)', () => {
    expect(quantize(0.1 + 0.2, 0, 1)).toBe(0.3)
  })

  it('snaps to the step grid measured from min', () => {
    expect(quantize(7, 0, 100, 5)).toBe(5)
    expect(quantize(8, 0, 100, 5)).toBe(10)
    expect(quantize(13, 1, 100, 5)).toBe(11) // 1 + round((13-1)/5)*5
  })

  it('clamps AFTER snapping (clamp wins over the grid)', () => {
    expect(quantize(1000, 0, 10, 3)).toBe(10)
  })

  it('is idempotent', () => {
    const q = quantize(13.7, 0, 100, 5)
    expect(quantize(q, 0, 100, 5)).toBe(q)
    const noisy = quantize(0.1 + 0.2, 0, 1)
    expect(quantize(noisy, 0, 1)).toBe(noisy)
  })
})

describe('valueFromRaw', () => {
  it('with no detents equals quantize(toValue(raw))', () => {
    expect(valueFromRaw(0.6, 'linear', 0, 100)).toBe(60)
    expect(valueFromRaw(0.53, 'linear', 0, 100, 10)).toBe(50) // 53 → step 10 → 50
  })

  it('snaps to a detent when raw is within DETENT_EPSILON of its phase', () => {
    // detent 50 sits at phase 0.5 on a 0..100 linear taper; ε = 0.025
    expect(valueFromRaw(0.5, 'linear', 0, 100, undefined, [50])).toBe(50)
    expect(valueFromRaw(0.51, 'linear', 0, 100, undefined, [50])).toBe(50) // |0.01| ≤ ε
  })

  it('ignores a detent when raw is outside DETENT_EPSILON', () => {
    expect(valueFromRaw(0.53, 'linear', 0, 100, undefined, [50])).toBe(53) // |0.03| > ε
  })

  it('clamps a detent value into range', () => {
    // detent 999 is out of range; its phase clamps to 1, far from raw 0.53 → no hit
    expect(valueFromRaw(0.53, 'linear', 0, 100, 10, [999])).toBe(50)
  })
})

describe('collide', () => {
  it('with fewer than 2 values returns the single value', () => {
    expect(collide([5], 0, 9, 'clamp')).toEqual({ values: [9], index: 0 })
  })

  it('clamp: a thumb cannot cross its sibling', () => {
    expect(collide([20, 80], 0, 90, 'clamp')).toEqual({ values: [80, 80], index: 0 })
    expect(collide([20, 80], 1, 10, 'clamp')).toEqual({ values: [20, 20], index: 1 })
    expect(collide([20, 80], 0, 50, 'clamp')).toEqual({ values: [50, 80], index: 0 })
  })

  it('push: a crossing thumb drags its sibling along', () => {
    expect(collide([20, 80], 0, 90, 'push')).toEqual({ values: [90, 90], index: 0 })
    expect(collide([20, 80], 1, 10, 'push')).toEqual({ values: [10, 10], index: 1 })
    expect(collide([20, 80], 0, 50, 'push')).toEqual({ values: [50, 80], index: 0 })
  })

  it('swap: values reorder and the drag is handed to the other thumb', () => {
    expect(collide([20, 80], 0, 90, 'swap')).toEqual({ values: [80, 90], index: 1 })
    expect(collide([20, 80], 1, 10, 'swap')).toEqual({ values: [10, 20], index: 0 })
    expect(collide([20, 80], 0, 50, 'swap')).toEqual({ values: [50, 80], index: 0 })
  })

  it('never mutates its input array', () => {
    const input = [20, 80]
    collide(input, 0, 90, 'push')
    collide(input, 1, 10, 'swap')
    expect(input).toEqual([20, 80])
  })
})

describe('keyboardStep — explicit step (value-domain)', () => {
  const opts = { taper: 'linear' as const, min: 0, max: 100, step: 10, fineScale: 0.1 }

  it('moves exactly one step per arrow, ×10 per page', () => {
    expect(keyboardStep([50], 0, 1, false, false, opts)).toBe(60)
    expect(keyboardStep([50], 0, -1, false, false, opts)).toBe(40)
    expect(keyboardStep([50], 0, 1, true, false, opts)).toBe(100) // 50 + 100 → clamped
    expect(keyboardStep([50], 0, -1, true, false, opts)).toBe(0) // 50 − 100 → clamped
  })

  it('always clamps to [min,max]', () => {
    expect(keyboardStep([100], 0, 1, false, false, opts)).toBe(100)
    expect(keyboardStep([0], 0, -1, false, false, opts)).toBe(0)
  })

  it('ignores fine in the explicit-step domain (step is a hard contract)', () => {
    expect(keyboardStep([50], 0, 1, false, true, opts)).toBe(60)
  })

  it('addresses the dual-thumb index it is handed', () => {
    expect(keyboardStep([20, 80], 1, 1, false, false, opts)).toBe(90)
  })
})

describe('keyboardStep — no step (phase-domain)', () => {
  it('on a linear taper an arrow is 1% of the range, a page 10%', () => {
    const lin = { taper: 'linear' as const, min: 0, max: 100, step: undefined, fineScale: 0.1 }
    expect(keyboardStep([50], 0, 1, false, false, lin)).toBeCloseTo(51, 9)
    expect(keyboardStep([50], 0, 1, true, false, lin)).toBeCloseTo(60, 9)
    expect(keyboardStep([50], 0, -1, false, false, lin)).toBeCloseTo(49, 9)
  })

  it('scales the phase delta by fine (Shift)', () => {
    const lin = { taper: 'linear' as const, min: 0, max: 100, step: undefined, fineScale: 0.1 }
    // 1% × 0.1 fine = 0.1% of range = 0.1
    expect(keyboardStep([50], 0, 1, false, true, lin)).toBeCloseTo(50.1, 9)
  })

  it('gives uniform PHASE deltas (non-uniform value deltas) on a log taper', () => {
    const log = { taper: 'log' as const, min: 20, max: 20000, step: undefined, fineScale: 0.1 }
    const pair = makeTaper('log', 20, 20000)
    // an up-arrow advances phase by ~0.01 regardless of where you start
    const fromLow = keyboardStep([50], 0, 1, false, false, log)
    const fromHigh = keyboardStep([5000], 0, 1, false, false, log)
    expect(pair.toPhase(fromLow) - pair.toPhase(50)).toBeCloseTo(0.01, 6)
    expect(pair.toPhase(fromHigh) - pair.toPhase(5000)).toBeCloseTo(0.01, 6)
    // …so the value delta is much larger up high than down low
    expect(fromHigh - 5000).toBeGreaterThan(fromLow - 50)
  })

  it('clamps phase stepping at the endpoints', () => {
    const lin = { taper: 'linear' as const, min: 0, max: 100, step: undefined, fineScale: 0.1 }
    expect(keyboardStep([100], 0, 1, false, false, lin)).toBe(100)
    expect(keyboardStep([0], 0, -1, false, false, lin)).toBe(0)
  })
})

describe('thumbBounds — dual-thumb aria clamp', () => {
  it('clamp/push pin each thumb to its sibling', () => {
    for (const mode of ['clamp', 'push'] as const) {
      // lower thumb (index 0): max is the upper thumb's value, min stays full
      expect(thumbBounds([20, 80], 0, mode, 0, 100)).toEqual({ valuemin: 0, valuemax: 80 })
      // upper thumb (index 1): min is the lower thumb's value, max stays full
      expect(thumbBounds([20, 80], 1, mode, 0, 100)).toEqual({ valuemin: 20, valuemax: 100 })
    }
  })

  it('swap keeps both thumbs at the full range (they may cross)', () => {
    expect(thumbBounds([20, 80], 0, 'swap', 0, 100)).toEqual({ valuemin: 0, valuemax: 100 })
    expect(thumbBounds([20, 80], 1, 'swap', 0, 100)).toEqual({ valuemin: 0, valuemax: 100 })
  })

  it('a single thumb always gets the full range', () => {
    expect(thumbBounds([42], 0, 'clamp', 0, 100)).toEqual({ valuemin: 0, valuemax: 100 })
  })
})
