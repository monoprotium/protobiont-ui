import type { PrtSize } from '../_shared/types'

export interface PrtFilterItem {
  value: string
  label: string
  disabled?: boolean
  // optional facet count — the kit RENDERS counts, the app COMPUTES them
  count?: number
}

export interface PrtFilterBarProps {
  // toggle semantics over the array v-model — new arrays emitted, never mutation
  modelValue?: string[]
  items: PrtFilterItem[]
  direction?: 'vertical' | 'horizontal'
  disabled?: boolean
  // optional built-in header row (D13: prop, English default lives on clearLabel)
  label?: string
  // D13
  clearLabel?: string
  // header clear affordance — visible when `label` is set and selection is non-empty
  showClear?: boolean
  size?: PrtSize
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
