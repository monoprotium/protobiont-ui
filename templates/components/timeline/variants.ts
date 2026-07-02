// Literal lookup tables (doc 02): every branch below is a COMPLETE
// static class set selected by key — never constructed. This replaces
// the 2025 four-prop PascalCase config map and its ten template forks.
import { cva } from 'class-variance-authority'

// The mark: square house mark. The page-color border punches a gap
// that makes marks sit ON the line. Default accent; per-item `seed` plucks the rack.
export const timelineMarkVariants = cva(
  'block h-3 w-3 rounded-mark border-2 border-surface-0 bg-[var(--seed,var(--accent))]',
)

// flat item card — hairline, square edges, NO shadow
export const timelineCardVariants = cva(
  'rounded-none border border-edge bg-surface-2 px-4 py-3',
)

// the line — 1px --edge hairline
export const timelineLineVertical: Record<string, string> = {
  start: 'absolute bottom-0 top-0 left-[5.5px] w-px bg-edge',
  end: 'absolute bottom-0 top-0 right-[5.5px] w-px bg-edge',
  alternate: 'absolute bottom-0 top-0 left-1/2 w-px -translate-x-1/2 bg-edge',
  'alternate-reverse':
    'absolute bottom-0 top-0 left-1/2 w-px -translate-x-1/2 bg-edge',
}

// vertical start/end: padded row + absolutely-positioned mark in the gutter
export const timelineRowVertical: Record<string, string> = {
  start: 'relative pl-9',
  end: 'relative pr-9',
}

// markAlign keys the vertical mark's cross-position: `center` (default) sits
// it at the card's vertical middle (matches horizontal); `title` pins it to
// the heading line via the legacy top-4 offset. Both are complete literals.
export const timelineMarkPosVertical: Record<'center' | 'title', Record<string, string>> = {
  center: {
    start: 'absolute left-0 top-1/2 -translate-y-1/2',
    end: 'absolute right-0 top-1/2 -translate-y-1/2',
  },
  title: {
    start: 'absolute left-0 top-4',
    end: 'absolute right-0 top-4',
  },
}

/** vertical alternate: per-row 3-track grid, center gutter carries the mark */
export const timelineAltRow =
  'grid grid-cols-[1fr_2.25rem_1fr] items-start [reading-flow:grid-order]'

export const timelineAltSide: Record<'left' | 'right', string> = {
  left: 'col-start-1 row-start-1 min-w-0',
  right: 'col-start-3 row-start-1 min-w-0',
}

// markAlign for the alternate gutter mark. center (default): self-center sits
// the mark at the card's vertical middle (row height is the card's, since the
// other side is empty) — matches horizontal. title: legacy mt-4 pins it to the
// heading line. items-start on the row keeps the side cards top-aligned either way.
export const timelineAltMark: Record<'center' | 'title', string> = {
  center: 'col-start-2 row-start-1 self-center justify-self-center',
  title: 'col-start-2 row-start-1 mt-4 justify-self-center',
}

// horizontal: three grid rows — content above (row 1, bottom-aligned),
// the line's own track (row 2), content below (row 3, top-aligned).
// Row 2 is the line's track, never content-height-derived.
export const timelineHContent: Record<'above' | 'below', string> = {
  above: 'row-start-1 min-w-0 self-end pb-3',
  below: 'row-start-3 min-w-0 self-start pt-3',
}

export const timelineHMark = 'row-start-2 self-center justify-self-center'
