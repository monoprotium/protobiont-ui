import { cva } from 'class-variance-authority'

// Same vocabulary and tokens as input/variants.ts; sizes use explicit
// pl/pr (the right padding reserves room for the chevron overlay).
// The trigger is a BUTTON (the panel is ours, never the UA dropdown) —
// inline-flex + text-left keep it reading like an input.
export const selectVariants = cva(
  'w-full appearance-none inline-flex items-center gap-2 text-left text-ink outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      variant: {
        // hover gated on not-disabled — see input/variants.ts
        filled:
          'bg-surface-2 border border-transparent not-disabled:hover:bg-surface-3 focus-visible:bg-surface-2 focus-visible:border-accent',
        outline:
          'bg-surface-1 border border-edge-strong not-disabled:hover:border-ink-faint focus-visible:border-accent',
        minimal:
          'bg-transparent border border-transparent not-disabled:hover:bg-wash focus-visible:bg-surface-1 focus-visible:border-edge',
      },
      size: {
        sm: 'h-8 pl-3 pr-8 text-sm',
        base: 'h-9 pl-3.5 pr-9 text-sm',
        lg: 'h-11 pl-4 pr-10 text-base',
      },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-control',
        pill: 'rounded-full',
      },
      error: {
        true: 'border-danger not-disabled:hover:border-danger focus-visible:border-danger focus-visible:ring-danger',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
      // placeholder shown (modelValue null) — faint like input placeholders
      placeholding: {
        true: 'text-ink-faint',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'base',
      edges: 'rounded',
    },
  },
)

export const selectChevronVariants = cva(
  'i-lucide-chevron-down pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-faint prt-motion',
  {
    variants: {
      size: {
        sm: 'right-2 text-xs',
        base: 'right-2.5 text-sm',
        lg: 'right-3 text-base',
      },
    },
    defaultVariants: { size: 'base' },
  },
)

// The open panel — OUR panel, never the UA dropdown (the whole point:
// the native popup is unstylable and screams default browser; see the
// PrtSelect header). LOOK only; positioning (anchor, width, max-height,
// @starting-style) lives in the component's scoped style block, the
// sanctioned <style> use.
// FLAT + FULL-BLEED by decree: ONE clean surface — no border, no shadow,
// no inner padding. Elevation is the surface step alone; rows run edge to
// edge and the corner radius clips them (overflow-y-auto). The earlier
// border + p-1 inset + rounded inner row was three framing layers — the
// 2000s→2010s transition look this kit exists to avoid.
export const selectPanelVariants = cva('bg-surface-2 overflow-y-auto', {
  variants: {
    edges: {
      square: 'rounded-none',
      rounded: 'rounded-surface',
      pill: 'rounded-surface',
    },
  },
  defaultVariants: { edges: 'rounded' },
})

// Option rows: full-bleed, never rounded — the highlight touches the panel
// edges (the fresh look); rows carry all the spacing (px aligns with the
// trigger's pl so closed and open text line up). No hover: classes — the
// single `active` row tracks both pointer and keyboard
// (aria-activedescendant pattern), one highlight source of truth.
// bg/cursor ride the variants, not the base (one class per CSS property
// per render — CVA concatenates, cx doesn't merge).
export const selectOptionVariants = cva(
  'w-full appearance-none inline-flex items-center gap-2 text-left text-ink select-none prt-motion-colors',
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-sm',
        base: 'px-3.5 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
      // the surface ramp, not an alpha wash: surface-3 IS the active step
      active: {
        true: 'bg-surface-3',
        false: 'bg-transparent',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { size: 'base' },
  },
)
