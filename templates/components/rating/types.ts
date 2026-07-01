import type { PrtSeed, PrtSize } from '../_shared/types'

export interface PrtRatingProps {
  // 0 = none
  modelValue: number
  // mark count
  max?: number
  // icon class (e.g. 'i-lucide-star') replaces the default abstract
  // square mark — the kit default stays the abstract mark
  // (square/technical identity); star is the opt-in
  icon?: string
  size?: PrtSize
  // filled-mark color rides the seed system; default accent
  seed?: PrtSeed
  // display-only — renders plain spans, no buttons, no focus, full ink
  readonly?: boolean
  disabled?: boolean
  // re-click the current value to clear to 0
  clearable?: boolean
  // layout-only additions (margin/placement) — appearance goes through variants
  class?: string
  // radiogroup aria-label
  label?: string
}
