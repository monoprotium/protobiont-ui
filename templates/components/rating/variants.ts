import { cva } from 'class-variance-authority'

// readonly keeps full ink; only disabled mutes (kit-wide convention)
export const ratingVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-1',
      base: 'gap-1.5',
      lg: 'gap-2',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: { size: 'base' },
})

export const ratingButtonVariants = cva(
  'inline-flex items-center justify-center bg-transparent p-0.5 rounded-mark disabled:cursor-not-allowed prt-ring',
)

// shape=mark is the kit default (abstract square, rounded-mark — never a
// circle); shape=icon sizes/tints the consumer's icon class instead.
// Fill color rides the seed system with the accent fallback.
export const ratingMarkVariants = cva('shrink-0 prt-motion-colors', {
  variants: {
    shape: { mark: 'rounded-mark', icon: '' },
    size: { sm: '', base: '', lg: '' },
    filled: { true: '', false: '' },
  },
  compoundVariants: [
    { shape: 'mark', size: 'sm', class: 'w-2.5 h-2.5' },
    { shape: 'mark', size: 'base', class: 'w-3 h-3' },
    { shape: 'mark', size: 'lg', class: 'w-4 h-4' },
    { shape: 'icon', size: 'sm', class: 'w-3.5 h-3.5' },
    { shape: 'icon', size: 'base', class: 'w-4 h-4' },
    { shape: 'icon', size: 'lg', class: 'w-5 h-5' },
    { shape: 'mark', filled: true, class: 'bg-[var(--seed,var(--accent))]' },
    { shape: 'mark', filled: false, class: 'bg-surface-3' },
    { shape: 'icon', filled: true, class: 'text-[var(--seed,var(--accent))]' },
    { shape: 'icon', filled: false, class: 'text-ink-faint' },
  ],
  defaultVariants: { shape: 'mark', size: 'base', filled: false },
})
