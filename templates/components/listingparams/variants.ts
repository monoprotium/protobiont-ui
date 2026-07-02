import { cva } from 'class-variance-authority'

// a real <dl>. UA margins zeroed IN the component (the <dl>/<dd> default
// margins resurface in consumers without the kit's reset — trap note).
// Full-bleed instinct: rows touch the component's edges; the root only
// rounds/clips.
export const listingParamsRootVariants = cva('w-full m-0 overflow-hidden rounded-surface', {
  variants: {
    variant: {
      // zebra rides the wash token (alpha overlay) — surface-agnostic striping
      zebra: '',
      hairline: 'divide-y divide-edge',
    },
  },
  defaultVariants: { variant: 'zebra' },
})

export const listingParamsRowVariants = cva(
  'grid grid-cols-[1fr_2fr] items-baseline gap-x-4 m-0',
  {
    variants: {
      variant: {
        zebra: 'odd:bg-wash',
        hairline: '',
      },
      size: {
        sm: 'px-3 py-1.5',
        base: 'px-4 py-2',
        lg: 'px-5 py-3',
      },
    },
    defaultVariants: { variant: 'zebra', size: 'base' },
  },
)

// name column — the faint metadata register
export const listingParamsNameVariants = cva('m-0 text-ink-muted', {
  variants: {
    size: {
      sm: 'text-xs',
      base: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'base' },
})

// value column — primary ink; numbers get the mono/tabular technical register
export const listingParamsValueVariants = cva('m-0 ml-0 text-ink', {
  variants: {
    size: {
      sm: 'text-xs',
      base: 'text-sm',
      lg: 'text-base',
    },
    mono: {
      true: 'font-mono tabular-nums',
      false: '',
    },
  },
  defaultVariants: { size: 'base', mono: false },
})
