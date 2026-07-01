// Sticky look — plain class constants (literal strings only).
// Stuck-state styling is BAKED IN. The pinned look rides a data-attr in the
// scoped block; this constant is the resting (unpinned) chrome.

// NB: deliberately NOT `prt-motion` (transition-all). On a position:sticky
// element transition-all animates scroll/pin-driven property changes too, which
// flashes the stuck chrome in/out on scroll. The scoped block transitions ONLY
// the stuck-state properties (bg/border-color/box-shadow) on the house curve.
export const stickyClass = 'prt-sticky'
