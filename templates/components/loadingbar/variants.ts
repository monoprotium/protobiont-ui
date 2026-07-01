import { cva } from 'class-variance-authority'

// Hairline bar; placement is built in (drop and it works), never a recipe
// the consumer must remember.
export const loadingBarVariants = cva('pointer-events-none', {
  variants: {
    placement: {
      top: 'fixed top-0 inset-x-0 z-50',
      local: 'absolute top-0 inset-x-0',
    },
    size: {
      sm: 'h-0.5',
      base: 'h-1',
      lg: 'h-1.5',
    },
  },
  defaultVariants: {
    placement: 'top',
    size: 'base',
  },
})

// width is the truly dynamic value — it rides a style binding in the
// component, never a generated class
export const loadingBarFillClass =
  'h-full bg-[var(--seed,var(--accent))] prt-motion'
export const loadingBarFillErrorClass = 'h-full bg-danger prt-motion'
