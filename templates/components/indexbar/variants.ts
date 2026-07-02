import { cva } from 'class-variance-authority'

// section letter header — faint-uppercase-mono register, accent ink, hairline rule
export const indexBarLetterVariants = cva(
  'font-mono text-xs uppercase tracking-wider text-accent',
)

// rail letters: present = anchor button, absent = dimmed + non-interactive
export const indexBarRailLetterVariants = cva(
  'flex h-5 w-5 items-center justify-center rounded-control bg-transparent font-mono text-xs leading-none',
  {
    variants: {
      state: {
        active: 'text-accent',
        present: 'cursor-pointer text-ink-muted hover:text-ink prt-motion-colors prt-ring',
        absent: 'text-ink-faint',
      },
    },
    defaultVariants: { state: 'present' },
  },
)
