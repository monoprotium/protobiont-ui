import { cva } from 'class-variance-authority'

// Header label rides the faint-uppercase-mono metadata register.
// bg-transparent: the tailwind-compat button background reset (the
// header is a <button> when collapsible, a <div> otherwise).
export const facetHeaderVariants = cva(
  'flex min-w-0 flex-1 items-center gap-2 bg-transparent text-left rounded-control',
  {
    variants: {
      collapsible: {
        true: 'cursor-pointer prt-ring',
        false: '',
      },
    },
    defaultVariants: { collapsible: true },
  },
)

// Clear affordance: `invisible` (not v-if) when count is 0 so
// appearing/disappearing never reflows the header (trap registry).
export const facetClearVariants = cva(
  'bg-transparent font-mono text-xs text-ink-faint hover:text-ink prt-motion-colors prt-ring rounded-control shrink-0',
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
