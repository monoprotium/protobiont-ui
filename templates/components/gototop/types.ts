import type { PrtSeed } from '../_shared/types'

export type PrtGoToTopPosition = 'bottom-right' | 'bottom-left'

export interface PrtGoToTopProps {
  // px scrolled before the button reveals; default 400
  threshold?: number
  // fixed placement — the value IS the placement (drop-and-works)
  position?: PrtGoToTopPosition
  // aria-label
  label?: string
  // decoration
  seed?: PrtSeed
  // layout-only additions
  class?: string
}
