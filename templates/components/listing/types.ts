export type PrtListingView = 'grid' | 'list'

// Loose fields the DEFAULT renderer reads off an item. All optional —
// items not matching the shape simply render what they have; the `#item`
// slot overrides everything.
export interface PrtListingItemFields {
  title?: string
  description?: string
  image?: string
  tags?: string[]
  // one faint mono line under the title (list view favors it over description)
  meta?: string
}

export interface PrtListingProps {
  // data-agnostic — rendering via #item or the default renderer's loose fields
  items: unknown[]
  // Key resolver — a field name or a function. Default 'id'; falls back to
  // the index ONLY when the field is absent (never key by title).
  itemKey?: string | ((item: unknown) => string | number)
  // Grid mode: the minimum item width that drives
  // `repeat(auto-fill, minmax(min(itemMin, 100%), 1fr))` — the ONE RWD
  // knob; the browser derives the column count. No breakpoint ladder.
  itemMin?: string
  // optional column cap — auto-fill stays the brain below the cap
  maxCols?: number
  // tighter gap rhythm (both views)
  dense?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
