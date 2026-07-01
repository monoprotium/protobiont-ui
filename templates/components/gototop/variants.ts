import { cva } from 'class-variance-authority'

// the seed rides a CSS variable here, never a built class. Placement is baked
// in (fixed corner): this is the drop-and-works value, not a layout the consumer wires.
export const goToTopVariants = cva(
  'fixed z-40 flex h-10 w-10 items-center justify-center rounded-control border border-edge bg-[var(--seed,var(--surface-2))] text-[var(--seed-ink,var(--ink))] shadow-float prt-motion-colors prt-ring hover:bg-[var(--seed-hover,var(--surface-3))]',
  {
    variants: {
      position: {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
      },
    },
    defaultVariants: {
      position: 'bottom-right',
    },
  },
)
