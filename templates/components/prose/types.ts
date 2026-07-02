import type { PrtSize } from '../_shared/types'

export interface PrtProseProps {
  // polymorphic root element — default 'article'
  tag?: string
  // Reading size. A literal-class lookup (never a constructed class name) that
  // shifts the fluid base step + the rhythm unit. Default 'base'.
  size?: PrtSize
  // Max line length (the measure). Any CSS length — default '68ch'. Pass
  // 'none' to release the cap and defer width to a parent container.
  measure?: string
  // layout-only additions (margin, grid placement) — appearance via the scale
  class?: string
}
