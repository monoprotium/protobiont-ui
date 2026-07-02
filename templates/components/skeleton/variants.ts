import { cva } from 'class-variance-authority'

export const skeletonVariants = cva('animate-pulse bg-surface-2', {
  variants: {
    shape: {
      line: 'h-4 w-full rounded-mark',
      // block and circle are sized by the consumer via `class`
      block: 'rounded-surface',
      // shrink-0: a circle must survive flex rows without squishing
      circle: 'rounded-full aspect-square shrink-0',
    },
  },
  defaultVariants: {
    shape: 'line',
  },
})
