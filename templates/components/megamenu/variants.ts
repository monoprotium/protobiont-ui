import { cva } from 'class-variance-authority'

// The bar is quiet chrome: a surface-1 strip. NO hairline and NO padding
// at all — by decree: triggers
// span the bar's full height and the FIRST one starts flush at the left
// edge, registered with the panel edge below; the open trigger merges
// SEAMLESSLY into the panel (the "tooth") — any hairline or padding strip
// would cut the junction or mis-register the tab against the panel.
export const megaMenuBarVariants = cva(
  'w-full flex items-center gap-1 bg-surface-1',
  {
    variants: {
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
    },
    defaultVariants: { align: 'start' },
  },
)

// One voice for panel triggers (buttons) and plain nav links (anchors):
// quiet by default, ink + wash on hover. The OPEN trigger is the TOOTH —
// it takes the panel's own surface (bg-surface-2, NOT wash/accent) and a
// square bottom, reading as one continuous shape with the flush panel
// underneath (the tooth — non-negotiable). bg rides the variants, not
// the base (tailwind-compat keeps a button background — trap registry);
// no-underline is inert on buttons.
export const megaMenuTriggerVariants = cva(
  'inline-flex items-center gap-1.5 h-11 px-3 text-sm no-underline select-none cursor-pointer outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      edges: {
        square: '',
        rounded: '',
        pill: '',
      },
      open: {
        true: 'bg-surface-2 text-ink',
        false: 'bg-transparent text-ink-muted hover:text-ink hover:bg-wash',
      },
    },
    // corners ride compounds: the open tooth NEVER rounds its bottom
    compoundVariants: [
      { edges: 'square', class: 'rounded-none' },
      { edges: 'rounded', open: false, class: 'rounded-control' },
      { edges: 'rounded', open: true, class: 'rounded-t-control rounded-b-none' },
      { edges: 'pill', open: false, class: 'rounded-full' },
      { edges: 'pill', open: true, class: 'rounded-t-control rounded-b-none' },
    ],
    defaultVariants: { edges: 'square', open: false },
  },
)

// FLAT + FULL-BLEED by decree (the select-panel doctrine at megamenu
// scale): ONE bg-surface-2 surface — no border, no shadow, no chrome
// inset. The panel sits flush under the bar and the open trigger's
// surface-2 tooth flows into it — SQUARE by default; `rounded` rounds only the bottom corners (top edge stays
// square against the bar so the tooth junction never breaks).
// Positioning (bar anchor, anchor-size width, max-height,
// @starting-style) lives in the component's scoped style block.
export const megaMenuPanelVariants = cva('bg-surface-2 overflow-y-auto', {
  variants: {
    edges: {
      square: 'rounded-none',
      rounded: 'rounded-b-surface',
      pill: 'rounded-b-surface',
    },
  },
  defaultVariants: { edges: 'square' },
})

// Default panel content: each group is one column of the full-width grid.
// This padding is CONTENT spacing, not chrome framing — what the flat
// doctrine bans is border+inset+rounded-row framing of the panel itself.
export const megaMenuGridClass = 'grid grid-flow-col auto-cols-fr gap-x-6 p-4'

// Faint uppercase mono — the metadata voice from the design stance.
// px aligns with the link rows below it.
export const megaMenuGroupLabelClass =
  'px-3 pb-1.5 text-xs font-mono uppercase tracking-wider text-ink-faint'

// Link rows: hover is TEXT-ONLY by default — muted ink
// brightening to full ink, no background bar (on the big flat panel the
// row highlight reads as chrome). The previous surface-3 row stays as the
// `bar` opt-in. Rows carry all the spacing; never rounded.
export const megaMenuLinkVariants = cva(
  'w-full flex items-start gap-2.5 px-3 py-2 text-sm no-underline rounded-none bg-transparent cursor-pointer select-none outline-none prt-motion-colors focus-visible:ring-1 focus-visible:ring-accent',
  {
    variants: {
      linkHover: {
        text: 'text-ink-muted hover:text-ink',
        bar: 'text-ink hover:bg-surface-3',
      },
    },
    defaultVariants: { linkHover: 'text' },
  },
)
