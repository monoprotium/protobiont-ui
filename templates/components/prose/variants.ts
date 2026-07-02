import type { PrtSize } from '../_shared/types'

// size → a COMPLETE literal class string (the no-runtime-construction rule).
// 'base' is the bare `.prt-prose` defaults; sm/lg only shift the base step +
// the rhythm unit. NEVER a constructed class name.
export const proseSizeClass: Record<PrtSize, string> = {
  sm: 'prt-prose--sm',
  base: '',
  lg: 'prt-prose--lg',
}
