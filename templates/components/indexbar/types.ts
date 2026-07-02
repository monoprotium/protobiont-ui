export type PrtIndexBarItem = string | { [key: string]: unknown; url?: string }

export interface PrtIndexBarProps {
  // strings, or objects carrying a name field (+ optional `url` → rendered as a link)
  items: PrtIndexBarItem[]
  // the object field holding the display name
  itemKey?: string
  // render A–Z sections that have no items (dimmed in the rail either way)
  displayEmptyLetters?: boolean
  // the sticky A–Z jump rail (anchors + IntersectionObserver scrollspy)
  rail?: boolean
  // localeCompare locale for grouping/sorting. Unset = the runtime
  // default (environment-dependent — fine; set it for determinism).
  locale?: string
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
