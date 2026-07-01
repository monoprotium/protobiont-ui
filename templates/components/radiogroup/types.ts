import type { PrtOption, PrtSeed, PrtSize } from '../_shared/types'

export interface PrtRadioGroupProps {
  modelValue?: string | number
  options: PrtOption[]
  // 'list' (default) = the classic dot + label rows; 'card' = each option is a
  // bordered selectable card with a `#meta` slot (delivery date + price for
  // shipping methods, method name + logo for payment). Serves both — it is NOT
  // a checkout-specific component.
  variant?: 'list' | 'card'
  // rendered as the <legend> — prop, never hardcoded
  label?: string
  // shared name for the native radios; defaults to a generated id
  name?: string
  seed?: PrtSeed
  size?: PrtSize
  // lay the options out in a row instead of a column
  inline?: boolean
  error?: boolean
  disabled?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
