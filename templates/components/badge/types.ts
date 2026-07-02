import type { PrtEdges, PrtIntent, PrtSeed, PrtSize } from '../_shared/types'

export type PrtBadgePosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

export interface PrtBadgeProps {
  // numeric content; default slot overrides
  count?: number
  // clamp display to "max+" overflow text (default 99)
  max?: number
  // absolute corner overlay (the consumer's wrapper must be `relative`); unset = inline
  position?: PrtBadgePosition
  // tiny status dot — ignores count/slot content
  dot?: boolean
  // decoration — pad 1–10 from the rack
  seed?: PrtSeed
  // true state — semantic tokens; beats seed when both are set
  intent?: PrtIntent
  size?: PrtSize
  // default 'rounded' (mark radius — technical); 'pill' is the deliberate exception (e-commerce counter look), never the default
  edges?: PrtEdges
  // layout-only additions
  class?: string
}
