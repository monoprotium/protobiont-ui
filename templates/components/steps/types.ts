import type { PrtSize } from '../_shared/types'

export interface PrtStepItem {
  label: string
  // optional second line, ink-muted
  description?: string
}

export interface PrtStepsProps {
  // v-model — 0-based current step; states derive from it, never stored
  modelValue: number
  // labels are the point — a count-only stepper is the consumer's own render
  steps: PrtStepItem[]
  // completed/adjacent steps become clickable and emit
  clickable?: boolean
  // false → dots-only rail (marks + connectors, edge to edge); step labels
  // move onto the marks as title + aria-label so the info survives
  showLabels?: boolean
  // 'edge' (default): first label anchors the container's left edge, last
  // its right edge, middles center on their dot. 'center': ALL labels
  // center on their dot — the outer labels overhang the component's box,
  // so use it where the rail has side room (e.g. a centered short rail).
  // Dot positions are identical in both modes.
  labelAlign?: 'edge' | 'center'
  size?: PrtSize
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
