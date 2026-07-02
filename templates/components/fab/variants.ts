import { cva } from 'class-variance-authority'

export const fabRootVariants = cva('fixed z-40 inline-flex', {
  variants: {
    position: {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
})

export const fabMainVariants = cva(
  'flex h-12 w-12 items-center justify-center border border-edge bg-[var(--seed,var(--accent))] text-[var(--seed-ink,var(--accent-ink))] shadow-float prt-motion hover:bg-[var(--seed-hover,var(--accent))] prt-ring',
  {
    variants: {
      edges: {
        square: 'rounded-control',
        rounded: 'rounded-surface',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      edges: 'square',
    },
  },
)

export const fabPanelClass = 'prt-fab-panel flex gap-2'

export const fabActionClass =
  'flex h-10 w-10 items-center justify-center rounded-control border border-edge bg-surface-2 text-ink shadow-raise prt-motion-colors prt-ring hover:bg-surface-3'
