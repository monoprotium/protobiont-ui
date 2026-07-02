import { cva } from 'class-variance-authority'

// content-visibility:auto + contain-intrinsic-size keep large galleries cheap.
// Masonry cells break-inside-avoid and carry their own bottom gutter (CSS
// columns ignore `gap` for inter-item spacing).
export const galleryCellVariants = cva(
  'group relative overflow-hidden rounded-surface [content-visibility:auto] [contain-intrinsic-size:auto_16rem]',
  {
    variants: {
      layout: {
        grid: '',
        masonry: 'break-inside-avoid',
      },
      gap: {
        normal: '',
        dense: '',
      },
      selected: {
        true: 'outline outline-2 -outline-offset-2 outline-[var(--seed,var(--accent))]',
        false: '',
      },
    },
    compoundVariants: [
      { layout: 'masonry', gap: 'normal', class: 'mb-3' },
      { layout: 'masonry', gap: 'dense', class: 'mb-1.5' },
    ],
    defaultVariants: {
      layout: 'grid',
      gap: 'normal',
      selected: false,
    },
  },
)

// the per-cell selection toggle — seed when checked, quiet surface otherwise
export const gallerySelectVariants = cva(
  'absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-mark border border-edge prt-motion-colors prt-ring',
  {
    variants: {
      selected: {
        true: 'bg-[var(--seed,var(--accent))] text-[var(--seed-ink,var(--accent-ink))]',
        false: 'bg-surface-2 text-ink-muted hover:bg-surface-3',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)
