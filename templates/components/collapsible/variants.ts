import { cva } from 'class-variance-authority'

// A single-disclosure primitive: one full-width quiet row over a hairline,
// chevron speaks the state. Accordion = the consumer v-fors collapsibles
// and owns exclusivity; this stays dumb. The open/close animation (grid
// 0fr→1fr) lives in the SFC's scoped block.
export const collapsibleTriggerVariants = cva(
  'w-full inline-flex items-center justify-between gap-2 text-left border-b border-edge text-ink select-none outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      size: {
        sm: 'h-8 px-1.5 text-xs',
        base: 'h-9 px-2 text-sm',
        lg: 'h-11 px-2.5 text-base',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-control',
        pill: 'rounded-control',
      },
      // filled: the bar gets its own surface so it separates from the
      // content region — the stacked-group (accordion) readability case
      variant: {
        quiet: 'bg-transparent',
        filled: 'bg-surface-2',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    // hover bg rides compounds: one bg-utility per property per render.
    // quiet stays ALWAYS transparent (no hover fill) — in an accordion the
    // hover highlight is noise; the chevron + cursor speak interactivity.
    // Only the filled (own-surface) variant gets a hover step.
    compoundVariants: [
      { variant: 'filled', disabled: false, class: 'hover:bg-surface-3' },
    ],
    // square by default: the full-width row over a hairline IS a square shape
    // — radius is the opt-in here, not the norm
    defaultVariants: {
      size: 'base',
      edges: 'square',
      variant: 'quiet',
      disabled: false,
    },
  },
)

// content aligns with the trigger LABEL (same horizontal inset per size)
// and reserves bottom room before the next hairline row — flush-left
// content under an inset label reads broken, not minimal
export const collapsibleContentVariants = cva('text-ink-muted', {
  variants: {
    size: {
      sm: 'px-1.5 pt-2.5 pb-3.5 text-xs',
      base: 'px-2 pt-3 pb-4 text-sm',
      lg: 'px-2.5 pt-3.5 pb-5 text-base',
    },
  },
  defaultVariants: { size: 'base' },
})
