import { cva } from 'class-variance-authority'

// Same vocabulary and tokens as input/variants.ts; sizes pad vertically
// (a textarea has no fixed height) and the user drags height via resize-y.
export const textareaVariants = cva(
  'w-full resize-y text-ink placeholder:text-ink-faint outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      variant: {
        // hover gated on not-disabled — see input/variants.ts
        filled:
          'bg-surface-2 border border-transparent not-disabled:hover:bg-surface-3 focus-visible:bg-surface-2 focus-visible:border-accent',
        outline:
          'bg-surface-1 border border-edge-strong not-disabled:hover:border-ink-faint focus-visible:border-accent',
        minimal:
          'bg-transparent border border-transparent not-disabled:hover:bg-wash focus-visible:bg-surface-1 focus-visible:border-edge',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        base: 'px-3.5 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-control',
        pill: 'rounded-surface',
      },
      error: {
        true: 'border-danger not-disabled:hover:border-danger focus-visible:border-danger focus-visible:ring-danger',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'base',
      edges: 'rounded',
    },
  },
)
