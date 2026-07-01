import { cva } from 'class-variance-authority'

// LOOK only — the phase-driven geometry (thumb/fill transforms riding
// --prt-slider-phase/-b) lives in the component's scoped style block,
// the sanctioned <style> use (same split as select's panel positioning).

// Root is the hit area: taller than the rail so track presses land
// comfortably. touch-none is MANDATORY (without it mobile Chrome turns
// the drag into a scroll and fires pointercancel mid-drag).
export const sliderRootVariants = cva('relative touch-none select-none', {
  variants: {
    orientation: {
      horizontal: 'flex items-center w-full',
      // height comes from the consumer's class; prt-slider-v carries a
      // zero-specificity 12rem default (unscoped :where block in the SFC)
      vertical: 'inline-flex justify-center prt-slider-v',
    },
    size: { sm: '', base: '', lg: '' },
    disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', size: 'sm', class: 'h-5' },
    { orientation: 'horizontal', size: 'base', class: 'h-6' },
    { orientation: 'horizontal', size: 'lg', class: 'h-7' },
    { orientation: 'vertical', size: 'sm', class: 'w-5' },
    { orientation: 'vertical', size: 'base', class: 'w-6' },
    { orientation: 'vertical', size: 'lg', class: 'w-7' },
  ],
  defaultVariants: { orientation: 'horizontal', size: 'base', disabled: false },
})

// The rail. overflow-hidden clips the scaled fill at the rounded ends.
export const sliderTrackVariants = cva('relative overflow-hidden bg-surface-2', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
    size: { sm: '', base: '', lg: '' },
    edges: {
      square: 'rounded-none',
      rounded: 'rounded-full',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', size: 'sm', class: 'h-1' },
    { orientation: 'horizontal', size: 'base', class: 'h-1.5' },
    { orientation: 'horizontal', size: 'lg', class: 'h-2' },
    { orientation: 'vertical', size: 'sm', class: 'w-1' },
    { orientation: 'vertical', size: 'base', class: 'w-1.5' },
    { orientation: 'vertical', size: 'lg', class: 'w-2' },
  ],
  defaultVariants: { orientation: 'horizontal', size: 'base', edges: 'rounded' },
})

// Selection fill — the selection-control house rule: seed with accent
// fallback, derived from a container's data-seed via the cascade.
export const sliderFillClass = 'absolute bg-[var(--seed,var(--accent))]'

// Tick marks sit ON the rail (and the fill) — hairline, technical.
export const sliderTickVariants = cva('absolute bg-ink-faint', {
  variants: {
    orientation: {
      horizontal: 'top-0 h-full w-px -translate-x-1/2',
      vertical: 'left-0 w-full h-px translate-y-1/2',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

// Thumb-position rails: zero-cross-axis lines the engine translates via
// the phase vars; children (cap + readout) anchor to their start.
export const sliderThumbPosVariants = cva('absolute pointer-events-none', {
  variants: {
    orientation: {
      horizontal: 'inset-x-0 top-1/2 h-0',
      vertical: 'inset-y-0 left-1/2 w-0',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

// The cap: a square-ish fader cap (taller than the rail), NOT the round
// web thumb. bg-ink reads as a crisp technical cap on the dark rail;
// ew/ns-resize cursors say "this drags" without a hand cursor.
export const sliderThumbVariants = cva(
  'absolute pointer-events-auto bg-ink outline-none prt-motion-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
  {
    variants: {
      orientation: {
        horizontal: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
        vertical: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
      },
      size: { sm: '', base: '', lg: '' },
      edges: {
        square: 'rounded-none',
        rounded: 'rounded-mark',
      },
      disabled: { true: 'cursor-not-allowed', false: '' },
    },
    compoundVariants: [
      { orientation: 'horizontal', size: 'sm', class: 'w-2 h-3.5' },
      { orientation: 'horizontal', size: 'base', class: 'w-2.5 h-4' },
      { orientation: 'horizontal', size: 'lg', class: 'w-3 h-5' },
      { orientation: 'vertical', size: 'sm', class: 'h-2 w-3.5' },
      { orientation: 'vertical', size: 'base', class: 'h-2.5 w-4' },
      { orientation: 'vertical', size: 'lg', class: 'h-3 w-5' },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'base',
      edges: 'rounded',
      disabled: false,
    },
  },
)

// Scrub readout while dragging — data numerals, faint mono.
export const sliderReadoutVariants = cva(
  'absolute whitespace-nowrap text-xs font-mono tabular-nums text-ink-muted',
  {
    variants: {
      orientation: {
        horizontal: 'left-0 -translate-x-1/2 bottom-3',
        vertical: 'bottom-0 translate-y-1/2 right-4',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
)
