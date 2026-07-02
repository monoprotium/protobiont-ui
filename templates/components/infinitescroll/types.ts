export interface PrtInfiniteScrollProps {
  // consumer-driven fetch flag — guards re-emits; flip false when items rendered
  loading?: boolean
  // consumer-driven "nothing more" flag — stops observing (reset to resume)
  endReached?: boolean
  // Observer expansion — how far BEFORE the sentinel enters view the
  // emit fires (rootMargin AND scrollMargin so sentinels clipped by
  // nested scroll containers work without an explicit-root workaround).
  margin?: string
  // Emit `load-more` on mount when the consumer signals empty. The
  // component is data-blind (slot, not items prop), so autoload needs
  // the consumer's one-bit `empty` signal.
  autoload?: boolean
  // "I have zero items" — pairs with `autoload`
  empty?: boolean
  // default end-of-list message (the #end slot overrides)
  endLabel?: string
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
