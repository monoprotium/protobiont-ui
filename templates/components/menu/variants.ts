import { cva } from 'class-variance-authority'

// The select panel re-aimed at actions: FLAT + FULL-BLEED by decree —
// one bg-surface-2 surface, no border, no shadow, no inner padding;
// rows and group chrome all run edge to edge and the outer radius clips
// them. Width is max-content (menus size to their labels — never
// anchor-size; that's the select's trigger-width contract, not ours).
// Positioning lives in the SFC's scoped block.
export const menuPanelVariants = cva('bg-surface-2 overflow-y-auto min-w-40 max-w-72', {
  variants: {
    edges: {
      square: 'rounded-none',
      rounded: 'rounded-surface',
      pill: 'rounded-surface',
    },
  },
  defaultVariants: { edges: 'rounded' },
})

// Rows: the select-option voice — full-bleed, never rounded, one active
// highlight source (aria-activedescendant tracks pointer AND keyboard).
// bg/cursor ride the variants, not the base (one class per property).
export const menuItemVariants = cva(
  'w-full appearance-none inline-flex items-center gap-2 text-left select-none prt-motion-colors',
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-sm',
        base: 'px-3.5 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
      active: {
        true: 'bg-surface-3',
        false: 'bg-transparent',
      },
      danger: {
        true: 'text-danger',
        false: 'text-ink',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { size: 'base', active: false, danger: false, disabled: false },
  },
)

// group heading — the faint uppercase mono metadata voice, full-bleed
export const menuGroupLabelVariants = cva(
  'block font-mono uppercase tracking-wider text-ink-faint',
  {
    variants: {
      size: {
        sm: 'px-3 pt-2 pb-1 text-xs',
        base: 'px-3.5 pt-2.5 pb-1 text-xs',
        lg: 'px-4 pt-3 pb-1.5 text-sm',
      },
    },
    defaultVariants: { size: 'base' },
  },
)

// hairline between groups — full-bleed, on the group container
export const menuGroupSepClass = 'border-t border-edge'
