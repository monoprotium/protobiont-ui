import { cva } from 'class-variance-authority'

// `tone` resolves in the component: intent (true state, semantic tokens
// with their *-ink pairs) beats seed (decoration); unseeded = quiet surface.
export const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium tabular-nums',
  {
    variants: {
      tone: {
        seed: 'bg-[var(--seed,var(--surface-3))] text-[var(--seed-ink,var(--ink))]',
        info: 'bg-info text-info-ink',
        success: 'bg-accent text-accent-ink',
        warning: 'bg-warning text-warning-ink',
        danger: 'bg-danger text-danger-ink',
      },
      size: {
        sm: 'h-4 min-w-4 px-1 text-[10px]',
        base: 'h-5 min-w-5 px-1.5 text-xs',
        lg: 'h-6 min-w-6 px-2 text-sm',
      },
      // mark radius, not control: a badge is small-mark scale (the 16px-blobby
      // rule). Pill/circle is the deliberate exception, never the default.
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-mark',
        pill: 'rounded-full',
      },
      position: {
        'top-right': 'absolute -top-1.5 -right-1.5 z-10',
        'top-left': 'absolute -top-1.5 -left-1.5 z-10',
        'bottom-right': 'absolute -bottom-1.5 -right-1.5 z-10',
        'bottom-left': 'absolute -bottom-1.5 -left-1.5 z-10',
      },
      dot: {
        true: 'p-0',
      },
    },
    // dot = the ONE legit circle (a dot is a circle by definition; the
    // component forces edges='pill' when dot) — and small: presence, not a mark
    compoundVariants: [
      { dot: true, size: 'sm', class: 'h-1.5 w-1.5 min-w-0' },
      { dot: true, size: 'base', class: 'h-2 w-2 min-w-0' },
      { dot: true, size: 'lg', class: 'h-2.5 w-2.5 min-w-0' },
    ],
    defaultVariants: {
      tone: 'seed',
      size: 'base',
      edges: 'rounded',
    },
  },
)
