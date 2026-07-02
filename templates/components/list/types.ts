import type { PrtSize } from '../_shared/types'

export type PrtListMarker =
  | 'square' // the signature: a two-tone schematic node (outline + accent micro-core)
  | 'dash' // a strict 1px hairline rule
  | 'spine' // schematic nodes joined by a faint connective rule (knowledge/steps)
  | 'disc' // conventional opt-out (browser ::marker, token-faint)
  | 'decimal' // editorial mono-index: leading-zero tabular numerals, right-set
  | 'none' // rhythm only

export interface PrtListProps {
  // Default 'square' — the house mark IS the visible signature.
  marker?: PrtListMarker
  dense?: boolean
  size?: PrtSize
  // convenience for the truly trivial case — the default slot (rich <li> children) wins if both are present
  items?: string[]
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
