import { cva } from 'class-variance-authority'

// Quiet nav chrome: muted links, ink only where "current" lives. The
// separator is a mono `/` glyph — more technical than chevron icons;
// the slot swaps it per use.
export const breadcrumbListVariants = cva('flex flex-wrap items-center gap-x-2 gap-y-1', {
  variants: {
    size: {
      sm: 'text-xs',
      base: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'base' },
})

export const breadcrumbSeparatorClass = 'font-mono text-ink-faint select-none'

export const breadcrumbLinkClass =
  'text-ink-muted no-underline hover:text-ink hover:underline underline-offset-4 outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent rounded-mark'

// current page — href-less middle segments stay muted (breadcrumbTextClass)
export const breadcrumbCurrentClass = 'text-ink'

export const breadcrumbTextClass = 'text-ink-muted'
