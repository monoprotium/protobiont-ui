export interface PrtStickyProps {
  // sticky offset from the top — number (px) or any CSS length; default '0px'
  top?: string | number
  // stack order while pinned; default 30
  z?: number
  // layout-only additions
  class?: string
}
