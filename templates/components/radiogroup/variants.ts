import { cva } from 'class-variance-authority'

export const radioGroupVariants = cva('border-0 p-0 m-0', {
  variants: {
    disabled: { true: 'opacity-60' },
  },
})

export const radioGroupLegendVariants = cva(
  'text-sm font-medium text-ink-muted mb-2 p-0',
  {
    variants: {
      error: { true: 'text-danger' },
    },
  },
)

export const radioGroupOptionsVariants = cva('flex', {
  variants: {
    inline: {
      true: 'flex-row flex-wrap gap-x-5 gap-y-2',
      false: 'flex-col gap-2',
    },
  },
  defaultVariants: { inline: false },
})

// 'list' = the bare dot+label row; 'card' = a bordered selectable card whose
// checked state rides the seed (accent fallback) edge + wash. Card stretches
// to fill the column (the options container is a flex-col).
export const radioOptionVariants = cva('select-none', {
  variants: {
    variant: {
      list: 'inline-flex items-center gap-2',
      card: 'flex items-center gap-3 border rounded-control px-3.5 py-3 prt-motion-colors',
    },
    checked: { true: '', false: '' },
    disabled: {
      true: 'opacity-60 cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  compoundVariants: [
    {
      variant: 'card',
      checked: true,
      class: 'border-[var(--seed,var(--accent))] bg-[var(--seed-wash,var(--accent-wash))]',
    },
    { variant: 'card', checked: false, class: 'border-edge hover:border-ink-faint' },
  ],
  defaultVariants: { variant: 'list', checked: false, disabled: false },
})

// Selection-control house rule: the CHECKED dot is identity-colored —
// var(--seed, var(--accent)) fill, var(--seed-ink, var(--accent-ink)) mark.
// Unchecked is quiet surface + edge.
export const radioDotVariants = cva(
  'inline-flex items-center justify-center shrink-0 rounded-full border prt-motion-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-0',
  {
    variants: {
      size: {
        sm: 'h-3.5 w-3.5',
        base: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      checked: {
        true: 'bg-[var(--seed,var(--accent))] border-transparent',
        false: 'bg-surface-2 border-edge hover:border-ink-faint',
      },
      error: {
        true: '',
      },
    },
    compoundVariants: [
      { checked: false, error: true, class: 'border-danger hover:border-danger' },
      { checked: true, error: true, class: 'ring-1 ring-danger' },
    ],
    defaultVariants: { size: 'base', checked: false },
  },
)

export const radioMarkVariants = cva(
  'rounded-full bg-[var(--seed-ink,var(--accent-ink))]',
  {
    variants: {
      size: {
        sm: 'h-1.5 w-1.5',
        base: 'h-2 w-2',
        lg: 'h-2.5 w-2.5',
      },
    },
    defaultVariants: { size: 'base' },
  },
)

export const radioLabelVariants = cva('text-ink', {
  variants: {
    size: {
      sm: 'text-xs',
      base: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'base' },
})
