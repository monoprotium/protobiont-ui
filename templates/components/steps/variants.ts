import { cva } from 'class-variance-authority'

// The wizard indicator row — and ONLY the row: navigation buttons,
// owned state and step content belong to the consumer's wizard.
// Marks are SQUARE-ISH (rounded-mark) chips with tabular numerals /
// a check — the classic stepper circle is exactly the design bug the
// identity forbids. Current = the one accent moment.
export const stepsMarkVariants = cva(
  'inline-flex items-center justify-center shrink-0 rounded-mark font-mono tabular-nums select-none prt-motion-colors',
  {
    variants: {
      size: {
        sm: 'h-5 w-5 text-[10px]',
        base: 'h-6 w-6 text-xs',
        lg: 'h-7 w-7 text-sm',
      },
      state: {
        complete: 'bg-surface-2 border border-edge text-accent',
        current: 'bg-accent border border-transparent text-accent-ink',
        upcoming: 'bg-surface-2 border border-edge text-ink-faint',
      },
    },
    defaultVariants: { size: 'base', state: 'upcoming' },
  },
)

// the label block under each mark — LEFT-CENTER-RIGHT geometry:
// first anchors the container's left edge, MIDDLE labels center on
// their dot, the LAST right-aligns to the container's right edge.
// Mid and last are layout-inert overlays (w-max + transform — never
// contributing width, so they can't move a dot): mid shifts to the dot
// centerline (ml = markWidth/2, translate -50%), last hangs leftward
// off its mark-width cell (ml = markWidth, translate -100% puts the
// right text edge on the mark's right edge). All offsets are literal
// per-size constants — no measurement, no reflow, ever.
export const stepsLabelBlockVariants = cva('mt-1.5 block', {
  variants: {
    pos: {
      first: 'min-w-0 pr-3',
      mid: 'w-max max-w-40 text-center -translate-x-1/2',
      last: 'w-max max-w-40 text-right -translate-x-full',
    },
    size: {
      sm: '',
      base: '',
      lg: '',
    },
  },
  compoundVariants: [
    { pos: 'mid', size: 'sm', class: 'ml-2.5' },
    { pos: 'mid', size: 'base', class: 'ml-3' },
    { pos: 'mid', size: 'lg', class: 'ml-3.5' },
    { pos: 'last', size: 'sm', class: 'ml-5' },
    { pos: 'last', size: 'base', class: 'ml-6' },
    { pos: 'last', size: 'lg', class: 'ml-7' },
  ],
  defaultVariants: { pos: 'mid', size: 'base' },
})

// labels lean mono per the house metadata voice
export const stepsLabelVariants = cva('block truncate font-mono tracking-wide', {
  variants: {
    size: {
      sm: 'text-[10px]',
      base: 'text-xs',
      lg: 'text-sm',
    },
    state: {
      complete: 'text-ink-muted',
      current: 'text-ink',
      upcoming: 'text-ink-faint',
    },
  },
  defaultVariants: { size: 'base', state: 'upcoming' },
})

export const stepsDescriptionVariants = cva('block truncate', {
  variants: {
    size: {
      sm: 'text-[10px]',
      base: 'text-xs',
      lg: 'text-xs',
    },
    state: {
      complete: 'text-ink-faint',
      current: 'text-ink-muted',
      upcoming: 'text-ink-faint',
    },
  },
  defaultVariants: { size: 'base', state: 'upcoming' },
})

// connector hairline; completed segments take accent (eyeball call)
export const stepsConnectorVariants = cva('flex-1 h-px mx-2', {
  variants: {
    state: {
      complete: 'bg-accent',
      pending: 'bg-edge',
    },
  },
  defaultVariants: { state: 'pending' },
})

// the LAST cell is MARK-width — a per-size constant. That single fact
// makes dot positions text-independent: the flex-1 cells divide
// (container − markWidth) equally, so no label length anywhere can
// shift a dot (the previous label-wide last cell made every middle dot
// a function of the last label's text — a precision bug, not a nuance).
// Its label overflows leftward as a layout-inert overlay (see below).
export const stepsLastCellVariants = cva('', {
  variants: {
    size: {
      sm: 'w-5',
      base: 'w-6',
      lg: 'w-7',
    },
  },
  defaultVariants: { size: 'base' },
})

// the clickable wrapper: quiet, ring on focus; bg-transparent is the
// tailwind-compat button reset (trap registry)
export const stepsItemVariants = cva(
  'w-full bg-transparent p-0 text-left outline-none rounded-control focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: { interactive: false },
  },
)
