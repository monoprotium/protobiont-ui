import { cva } from 'class-variance-authority'

// Stance: borders before shadows — every surface gets a hairline edge;
// `raised` adds the tokenized shadow + the top-edge inner highlight
// (--inset-highlight, 09-elevation) for the premium "catch the light" stroke.
// No hover-translate gimmicks.
export const cardVariants = cva(
  'relative flex flex-col overflow-hidden bg-surface-1 border border-edge prt-motion-colors',
  {
    variants: {
      variant: {
        default: '',
        raised: 'shadow-[var(--shadow-raise),var(--inset-highlight)]',
        outline: 'bg-transparent border-edge-strong',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-surface',
      },
    },
    defaultVariants: {
      variant: 'default',
      edges: 'rounded',
    },
  },
)
