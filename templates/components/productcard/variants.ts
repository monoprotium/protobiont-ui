import { cva } from 'class-variance-authority'

// Favorite overlay — the ONE legit circle context (badge precedent).
// bg-surface-1 is also the tailwind-compat button background reset.
export const productCardFavoriteVariants = cva(
  'absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-edge bg-surface-1 prt-motion-colors prt-ring',
  {
    variants: {
      active: {
        true: 'text-accent',
        false: 'text-ink-muted hover:text-ink',
      },
    },
    defaultVariants: { active: false },
  },
)
