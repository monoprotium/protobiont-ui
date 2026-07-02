import { cva } from 'class-variance-authority'

// default loading row (the #loading slot replaces it)
export const infiniteScrollLoadingVariants = cva('flex justify-center py-6')

// default end message (the #end slot replaces it) — quiet, faint ink
export const infiniteScrollEndVariants = cva(
  'py-6 text-center text-sm text-ink-faint',
)
