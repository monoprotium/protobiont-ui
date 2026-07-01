import type { PrtEdges, PrtSize } from '../_shared/types'

export type PrtTagsInputVariant = 'filled' | 'outline' | 'minimal'

// reason CODES — the consumer renders any message.
// 'empty' deliberately doesn't exist: empty commits are silent no-ops
// (double-Enter is not an error).
export type PrtTagsInputRejectReason = 'duplicate' | 'max'

export interface PrtTagsInputProps {
  // the committed tags — new arrays are emitted, the prop is never mutated
  modelValue: string[]
  placeholder?: string
  id?: string
  variant?: PrtTagsInputVariant
  size?: PrtSize
  // field edges; the chips inside follow the same setting
  edges?: PrtEdges
  error?: boolean
  disabled?: boolean
  // exact (case-sensitive) compare — surprising lowercasing is worse
  allowDuplicates?: boolean
  // max tag count; commits past it reject with 'max'
  max?: number
  // Enter always commits; comma commits too unless false
  commaCommits?: boolean
  // pasting "a, b, c" splits into chips on the commit separators
  splitPaste?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
  // aria-label of each chip's × button
  removeLabel?: string
}
