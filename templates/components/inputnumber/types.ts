import type { PrtEdges, PrtSize } from '../_shared/types'

export type PrtInputNumberVariant = 'filled' | 'outline' | 'minimal'

export interface PrtInputNumberProps {
  // THE contract: null on empty — never a silent 0.
  modelValue?: number | null
  min?: number
  max?: number
  step?: number // default 1
  id?: string
  placeholder?: string
  variant?: PrtInputNumberVariant
  size?: PrtSize
  edges?: PrtEdges
  hideControls?: boolean
  error?: boolean
  disabled?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
