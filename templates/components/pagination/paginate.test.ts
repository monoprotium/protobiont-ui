import { describe, expect, it } from 'bun:test'
import { paginate, type PrtPaginationCell } from './paginate'

// Pins the windowing contract: the documented length-stability invariant
// (the layout never jitters while paging), the empty/degenerate guards, the
// two-distinct-gap-keys trap, and the gap-vs-single-page-fill branches on
// both sides. Invariants only — no hand-computed magic windows that a retune
// would churn (the few literal expectations are tiny saturated cases).

const numbers = (cells: PrtPaginationCell[]) => cells.filter((c): c is number => typeof c === 'number')

describe('paginate — guards', () => {
  it('returns [] for non-positive totalPages', () => {
    expect(paginate(1, 0)).toEqual([])
    expect(paginate(1, -5)).toEqual([])
  })

  it('lists every page (no gaps) while totalPages is small', () => {
    expect(paginate(1, 1)).toEqual([1])
    expect(paginate(1, 2)).toEqual([1, 2])
    expect(paginate(2, 3)).toEqual([1, 2, 3]) // boundary+1: fills, never a gap
  })
})

describe('paginate — length stability (the no-jitter invariant)', () => {
  it('holds a constant length across every page once totalPages is saturated', () => {
    // defaults sibling=1 boundary=1 → 2*boundary + 2*sibling + 3 = 7
    const lengths = new Set<number>()
    for (let page = 1; page <= 20; page++) lengths.add(paginate(page, 20).length)
    expect([...lengths]).toEqual([7])
  })

  it('holds for wider sibling/boundary windows too', () => {
    const lengths = new Set<number>()
    for (let page = 1; page <= 40; page++) lengths.add(paginate(page, 40, 2, 2).length)
    // 2*2 + 2*2 + 3 = 11
    expect([...lengths]).toEqual([11])
  })

  it('always keeps first and last page present', () => {
    for (let page = 1; page <= 20; page++) {
      const nums = numbers(paginate(page, 20))
      expect(nums[0]).toBe(1)
      expect(nums[nums.length - 1]).toBe(20)
    }
  })
})

describe('paginate — gap keys and branches', () => {
  it('carries two DISTINCT gap keys when both windows collapse (mid range)', () => {
    const cells = paginate(10, 20)
    expect(cells).toContain('gap-start')
    expect(cells).toContain('gap-end')
    // the trap: gap-start ≠ gap-end (stable v-for keys, no mid-interaction remount)
    expect(cells.indexOf('gap-start')).toBeLessThan(cells.indexOf('gap-end'))
  })

  it('fills the near side with a single page instead of a gap (start)', () => {
    const cells = paginate(1, 20)
    expect(cells).not.toContain('gap-start') // window touches the start boundary
    expect(cells).toContain('gap-end')
    expect(numbers(cells)).toContain(2) // the single-page fill, not an ellipsis
  })

  it('fills the near side with a single page instead of a gap (end)', () => {
    const cells = paginate(20, 20)
    expect(cells).toContain('gap-start')
    expect(cells).not.toContain('gap-end')
    expect(numbers(cells)).toContain(19) // the single-page fill on the end side
  })
})
