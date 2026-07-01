import type { PrtSeed, PrtSize } from '../_shared/types'

// 'top' = fixed viewport top (the drop-and-it-works default); 'local' = absolute top of a relative container (embedding, demos)
export type PrtLoadingBarPlacement = 'top' | 'local'

export interface PrtLoadingBarProps {
  placement?: PrtLoadingBarPlacement
  seed?: PrtSeed
  size?: PrtSize
  // layout-only additions
  class?: string
}
