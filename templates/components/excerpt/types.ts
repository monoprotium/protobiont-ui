import type { PrtSeed } from '../_shared/types'

export interface PrtExcerptProps {
  // visual line count before clamping; default 3
  lines?: number
  // show a more/less toggle; false = permanent truncation; default true
  expandable?: boolean
  // soft gradient fade at the clamp edge while collapsed
  fade?: boolean
  // show-more label (D13 default)
  moreLabel?: string
  // show-less label (D13 default)
  lessLabel?: string
  // decoration: tints the toggle link
  seed?: PrtSeed
  // layout-only additions
  class?: string
}
