import type { PrtSeed } from '../_shared/types'

export type PrtTimelineOrientation = 'vertical' | 'horizontal'

// Two props × eight layouts (the full alignment matrix):
//   vertical   start → line left, items right · end → mirrored
//   vertical   alternate → center line, first item LEFT · -reverse → RIGHT
//   horizontal start → line top, items below · end → mirrored
//   horizontal alternate → center line, first item TOP · -reverse → BOTTOM
export type PrtTimelineAlign = 'start' | 'end' | 'alternate' | 'alternate-reverse'

// mark's cross-position on its card (vertical layouts only — horizontal is
// always centered on the line track): centered on the card, or pinned to the
// heading line (the `top-4` offset).
export type PrtTimelineMarkAlign = 'center' | 'title'

export interface PrtTimelineItem {
  title: string
  description?: string
  // per-item mark accent via the rack
  seed?: PrtSeed
}

export interface PrtTimelineProps {
  items: PrtTimelineItem[]
  orientation?: PrtTimelineOrientation
  align?: PrtTimelineAlign
  // vertical only: center the mark on the card (default) or pin it to the title line
  markAlign?: PrtTimelineMarkAlign
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
