import type { PrtEdges, PrtSize } from '../_shared/types'

export type PrtTextareaVariant = 'filled' | 'outline' | 'minimal'

export interface PrtTextareaProps {
  modelValue?: string
  id?: string
  placeholder?: string
  rows?: number // default 4
  variant?: PrtTextareaVariant
  size?: PrtSize
  edges?: PrtEdges
  error?: boolean
  disabled?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
