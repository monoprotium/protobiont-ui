import { cva } from 'class-variance-authority'

// sm–lg are dashboard scale (table rows); xl/2xl are profile scale —
// the kit serves both, the small DEFAULT is the only dashboard bias.
export const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden select-none font-medium uppercase shrink-0 bg-[var(--seed,var(--surface-2))] text-[var(--seed-ink,var(--ink-muted))]',
  {
    variants: {
      size: {
        sm: 'w-6 h-6 text-[10px]',
        base: 'w-8 h-8 text-xs',
        lg: 'w-10 h-10 text-sm',
        xl: 'w-16 h-16 text-lg',
        '2xl': 'w-24 h-24 text-2xl',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-control',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      size: 'base',
      edges: 'rounded',
    },
  },
)
