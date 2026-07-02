import { cva } from 'class-variance-authority'

// The bubble background rides `--prt-bubble` (set per side in the SFC scoped
// block) and the tail pseudo-element reads the SAME variable — so the tail
// can never drift from the bubble color, in either mode, with zero generated
// classes.
export const chatRowVariants = cva('flex', {
  variants: {
    side: {
      sent: 'justify-end',
      received: 'justify-start',
    },
    grouped: {
      true: 'mt-0.5',
      false: 'mt-2',
    },
  },
  defaultVariants: {
    side: 'received',
    grouped: false,
  },
})

export const chatBubbleVariants = cva(
  'prt-chat-bubble relative max-w-[80%] rounded-surface px-3 py-2 text-sm',
  {
    variants: {
      side: {
        sent: 'text-[var(--seed-ink,var(--accent-ink))]',
        received: 'text-ink',
      },
    },
    defaultVariants: {
      side: 'received',
    },
  },
)

export const chatMetaClass = 'mt-1 text-[0.625rem] font-mono opacity-70'
