import type { PrtEdges, PrtOption, PrtSize } from '../_shared/types'

export type PrtSelectVariant = 'filled' | 'outline' | 'minimal'

export interface PrtSelectProps {
  modelValue?: string | number | null
  options: PrtOption[]
  // shown as a disabled hidden first option while modelValue is null
  placeholder?: string
  id?: string
  variant?: PrtSelectVariant
  size?: PrtSize
  edges?: PrtEdges
  error?: boolean
  disabled?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
