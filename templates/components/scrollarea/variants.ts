import { cva } from 'class-variance-authority'

// The bar is an absolutely-positioned overlay sibling of the native scroll
// viewport; the thumb fills the bar's full thickness (--scrollbar-size), and
// the bar width/height + the 'both'-corner offset ride inline CSS-var styles
// (dynamic → :style, never a built class). Colours/radius ride tokens; the
// square --radius-mark thumb is the technical identity (NOT a pill).
export const scrollBarVariants = cva(
  'prt-scroll-area__bar absolute z-10 select-none touch-none transition-opacity duration-[var(--motion-duration)] ease-[var(--motion-ease)]',
  {
    variants: {
      orientation: {
        vertical: 'top-0 right-0 bottom-0',
        horizontal: 'left-0 right-0 bottom-0',
      },
    },
  },
)

export const scrollThumbVariants = cva(
  'prt-scroll-area__thumb rounded-mark bg-[var(--scrollbar-thumb)] prt-motion-colors hover:bg-[var(--scrollbar-thumb-hover)] active:bg-[var(--scrollbar-thumb-hover)]',
  {
    variants: {
      orientation: {
        vertical: 'w-full',
        horizontal: 'h-full',
      },
    },
  },
)
