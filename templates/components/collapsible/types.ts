import type { PrtEdges, PrtSize } from '../_shared/types'

export type PrtCollapsibleVariant = 'quiet' | 'filled'

export interface PrtCollapsibleProps {
  // v-model — open state is the consumer's
  modelValue: boolean
  // default trigger text (the trigger slot overrides it)
  label?: string
  // filled: the bar carries its own surface — readable in stacked groups
  variant?: PrtCollapsibleVariant
  size?: PrtSize
  edges?: PrtEdges
  disabled?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
