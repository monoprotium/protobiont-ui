import { cva } from 'class-variance-authority'

// Wrapper carries the input-vocabulary frame (bg/border/edges/error);
// focus rides :focus-within since the real input sits inside.
export const inputNumberVariants = cva(
  'inline-flex w-full items-stretch overflow-hidden prt-motion-colors focus-within:ring-1 focus-within:ring-accent',
  {
    variants: {
      variant: {
        // hover gated like input/variants.ts — but the frame is a DIV, so
        // :disabled can't match it; the gate looks at the inner native input
        filled:
          'bg-surface-2 border border-transparent has-[input:enabled]:hover:bg-surface-3 focus-within:bg-surface-2 focus-within:border-accent',
        outline:
          'bg-surface-1 border border-edge-strong has-[input:enabled]:hover:border-ink-faint focus-within:border-accent',
        minimal:
          'bg-transparent border border-transparent has-[input:enabled]:hover:bg-wash focus-within:bg-surface-1 focus-within:border-edge',
      },
      size: {
        sm: 'h-8 text-sm',
        base: 'h-9 text-sm',
        lg: 'h-11 text-base',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-control',
        pill: 'rounded-full',
      },
      error: {
        true: 'border-danger has-[input:enabled]:hover:border-danger focus-within:border-danger focus-within:ring-danger',
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

// [appearance:textfield] kills the native spinner (Firefox); the webkit
// pseudo-elements need the <style> block in the SFC (utilities can't reach them).
export const inputNumberFieldVariants = cva(
  'w-full min-w-0 flex-1 bg-transparent text-ink placeholder:text-ink-faint outline-none [appearance:textfield]',
  {
    variants: {
      controls: {
        true: 'text-center',
        false: '',
      },
      size: {
        sm: '',
        base: '',
        lg: '',
      },
    },
    // padding is fully compound-driven — exactly one px-* class per render
    compoundVariants: [
      { controls: true, size: 'sm', class: 'px-1' },
      { controls: true, size: 'base', class: 'px-1' },
      { controls: true, size: 'lg', class: 'px-1.5' },
      { controls: false, size: 'sm', class: 'px-3' },
      { controls: false, size: 'base', class: 'px-3.5' },
      { controls: false, size: 'lg', class: 'px-4' },
    ],
    defaultVariants: { controls: true, size: 'base' },
  },
)

// bg-transparent is load-bearing: the tailwind-compat reset deliberately
// does NOT clear native button backgrounds, so without it the steppers
// render the UA's ButtonFace gray.
export const inputNumberButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center bg-transparent text-ink-muted not-disabled:hover:text-ink not-disabled:hover:bg-wash prt-motion-colors disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'w-8 text-xs',
        base: 'w-9 text-sm',
        lg: 'w-11 text-base',
      },
    },
    defaultVariants: { size: 'base' },
  },
)
