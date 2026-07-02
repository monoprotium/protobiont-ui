import { cva } from 'class-variance-authority'

// the view model's two presentations share ONE gap rhythm (normal/dense)
// — consumers never write margin classes around items.
//
// Grid: `repeat(auto-fill, minmax(min(max(--prt-listing-min, cap), 100%), 1fr))`
// — the inner `min(…, 100%)` is what saves narrow containers (do NOT
// simplify it away); `--prt-listing-cap` (0px unless `maxCols` is set)
// floors the track width so the column count never exceeds the cap while
// auto-fill stays the brain. Both vars ride the per-instance style
// binding (the sanctioned dynamic channel).
export const listingRootVariants = cva('w-full m-0 p-0 list-none', {
  variants: {
    view: {
      grid: 'grid grid-cols-[repeat(auto-fill,minmax(min(max(var(--prt-listing-min),var(--prt-listing-cap,0px)),100%),1fr))]',
      // list mode: full-bleed hairline-separated rows — no per-item margins
      list: 'flex flex-col divide-y divide-edge',
    },
    dense: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { view: 'grid', dense: false, class: 'gap-5' },
    { view: 'grid', dense: true, class: 'gap-3' },
  ],
  defaultVariants: { view: 'grid', dense: false },
})

// Performance default: `content-visibility: auto`
// + `contain-intrinsic-size: auto <length>` — ALWAYS the `auto <length>`
// form (caches the real size after first render; kills reverse-scroll
// jumps, Firefox is harsher about bad estimates). One estimate per view
// (row vs card) — house constants, not props. Render-and-trust to a few
// thousand items; no virtualization, ever.
// `container-type: inline-size` lets the default card renderer compact
// itself in narrow tracks (container query, stable both engines).
export const listingItemVariants = cva('min-w-0', {
  variants: {
    view: {
      grid: '[content-visibility:auto] [contain-intrinsic-size:auto_18rem] [container-type:inline-size]',
      list: '[content-visibility:auto] [contain-intrinsic-size:auto_4.5rem]',
    },
    dense: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { view: 'list', dense: false, class: 'py-3' },
    { view: 'list', dense: true, class: 'py-2' },
  ],
  defaultVariants: { view: 'grid', dense: false },
})
