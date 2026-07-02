import { cva } from 'class-variance-authority'

export const filterBarListVariants = cva('', {
  variants: {
    direction: {
      vertical: 'flex flex-col gap-2',
      horizontal: 'flex flex-wrap items-center gap-x-4 gap-y-2',
    },
  },
  defaultVariants: { direction: 'vertical' },
})

// the metadata register — facet counts next to labels
export const filterBarCountVariants = cva(
  'ml-1.5 font-mono text-xs text-ink-faint tabular-nums',
)

// Header clear affordance. `invisible` (not v-if) when the selection is
// empty so empty→non-empty never reflows the header (trap registry).
// bg-transparent: the tailwind-compat button background reset.
export const filterBarClearVariants = cva(
  'bg-transparent font-mono text-xs text-ink-faint hover:text-ink prt-motion-colors prt-ring rounded-control',
  {
    variants: {
      hidden: {
        true: 'invisible',
        false: '',
      },
    },
    defaultVariants: { hidden: false },
  },
)
