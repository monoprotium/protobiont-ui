import type { PrtEdges, PrtSeed } from '../_shared/types'

export interface PrtFabAction {
  id: string
  // i-lucide-* class string
  icon: string
  // tooltip + aria-label (D13)
  label: string
  // render as a link instead of a button
  href?: string
}

export type PrtFabDirection = 'up' | 'down' | 'left' | 'right'
export type PrtFabPosition = 'bottom-right' | 'bottom-left'

export interface PrtFabProps {
  actions: PrtFabAction[]
  // main-button icon; default i-lucide-plus (rotates on open)
  icon?: string
  // fan-out direction; default 'up'
  direction?: PrtFabDirection
  // fixed placement (drop-and-works); default 'bottom-right'
  position?: PrtFabPosition
  // main button shape — default square identity; 'pill' for the round FAB
  edges?: PrtEdges
  // main-button aria-label (D13 default)
  label?: string
  // decoration
  seed?: PrtSeed
  // layout-only additions
  class?: string
}
