import { cva } from 'class-variance-authority'

// The wrapper IS the field (inputnumber's wrapper-owns-the-look recipe,
// wrap-enabled): focus rides :focus-within; hover is gated on the inner
// native input via :has since a div can't match :disabled. The recipe
// must keep matching input/variants.ts — eyeball them side by side.
export const tagsInputVariants = cva(
  'flex w-full flex-wrap items-center prt-motion-colors focus-within:ring-1 focus-within:ring-accent',
  {
    variants: {
      variant: {
        filled:
          'bg-surface-2 border border-transparent has-[input:enabled]:hover:bg-surface-3 focus-within:bg-surface-2 focus-within:border-accent',
        outline:
          'bg-surface-1 border border-edge-strong has-[input:enabled]:hover:border-ink-faint focus-within:border-accent',
        minimal:
          'bg-transparent border border-transparent has-[input:enabled]:hover:bg-wash focus-within:bg-surface-1 focus-within:border-edge',
      },
      size: {
        sm: 'min-h-8 px-1.5 py-1 gap-1 text-sm',
        base: 'min-h-9 px-1.5 py-1 gap-1.5 text-sm',
        lg: 'min-h-11 px-2 py-1.5 gap-2 text-base',
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
        // cursor-text lives here, not in the base — cx() does no conflict
        // resolution, so the not-allowed cursor must not have to fight it
        false: 'cursor-text',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'base',
      edges: 'rounded',
    },
  },
)

// The inner input is naked — the wrapper carries the whole field look.
// Heights match the chip rows so wrapped lines stay even; the px keeps
// the empty-field placeholder near PrtInput's inset (wrapper px + this).
export const tagsInputFieldVariants = cva(
  'flex-1 bg-transparent text-ink placeholder:text-ink-faint outline-none disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'h-5 min-w-20 px-1.5',
        base: 'h-6 min-w-24 px-2',
        lg: 'h-7 min-w-28 px-2',
      },
    },
    defaultVariants: { size: 'base' },
  },
)

// Inline chip, NOT PrtChip (see the SFC header). Sizing rows mirror
// chip/variants.ts; bg-surface-3 raises the token off the filled field.
// `marked` is the two-step-backspace / duplicate-flash state; the chip
// is keyboard-focusable only when roved into (tabindex=-1 + .focus()).
export const tagsInputChipVariants = cva(
  'inline-flex max-w-full items-center bg-surface-3 border border-edge text-ink select-none outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      size: {
        sm: 'h-5 px-2 text-xs gap-1',
        base: 'h-6 px-2.5 text-xs gap-1.5',
        lg: 'h-7 px-3 text-sm gap-1.5',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-control',
        pill: 'rounded-full',
      },
      marked: {
        true: 'border-danger ring-1 ring-danger',
      },
    },
    defaultVariants: { size: 'base', edges: 'rounded' },
  },
)
