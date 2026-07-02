import { cva } from 'class-variance-authority'

// The dot is a real button: square house mark by default (identity), circle
// only when the consumer flips `dotShape` (zero css needed).
// Active dot takes the seed (falling back to accent); inactive is a quiet edge.
export const carouselDotVariants = cva(
  'h-2 w-2 shrink-0 border-0 p-0 prt-motion-colors prt-ring',
  {
    variants: {
      shape: {
        square: 'rounded-mark',
        circle: 'rounded-full',
      },
      active: {
        true: 'bg-[var(--seed,var(--accent))]',
        false: 'bg-edge-strong hover:bg-ink-faint',
      },
    },
    defaultVariants: {
      shape: 'square',
      active: false,
    },
  },
)
