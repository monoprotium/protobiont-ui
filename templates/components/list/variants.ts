import { cva } from 'class-variance-authority'

// root utility classes only — the typographic rhythm (markers, hanging
// indent, item spacing, link/code treatment, INK COLOR) lives in the
// component's `.prt-list`-namespaced style block, because it must reach
// SLOTTED <li> children, which utilities can't.
//
// Size sets FONT-SIZE ONLY (arbitrary value, no `em`): the style block
// owns line-height (1.5) so a consumer can scale the whole list up to a
// poster size by overriding font-size, and every cap/lh/ch-based mark and
// gap scales with it. `lg` is a confident medium — the list is a design
// element, not body copy.
export const listVariants = cva('prt-list', {
  variants: {
    size: {
      sm: 'text-[0.8125rem]',
      base: 'text-[0.9375rem]',
      lg: 'text-[1.1875rem]',
    },
  },
  defaultVariants: { size: 'base' },
})
