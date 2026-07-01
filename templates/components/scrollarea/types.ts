import type { PrtSize } from '../_shared/types'

export type PrtScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

// never = always-visible (the kit default); scroll = show while scrolling; hover = show on pointer-over.
export type PrtScrollAreaAutoHide = 'never' | 'scroll' | 'hover'

export interface PrtScrollAreaProps {
  // which axes get a bar; default 'vertical'
  orientation?: PrtScrollAreaOrientation
  // visibility policy; default 'never' (always shown when the content overflows)
  autoHide?: PrtScrollAreaAutoHide
  // ms before the bar hides again when autoHide='scroll'; default 600
  hideDelay?: number
  // bar thickness — maps to the --scrollbar-size token; default 'base'
  size?: PrtSize
  // polymorphic root element; default 'div'
  tag?: string
  // aria-label for the focusable scroll region
  label?: string
  // layout-only additions (the consumer sets the height/width here)
  class?: string
}
