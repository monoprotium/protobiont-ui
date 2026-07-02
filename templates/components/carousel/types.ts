import type { PrtSeed } from '../_shared/types'

export type PrtCarouselAlign = 'start' | 'center' | 'end'
export type PrtCarouselDotShape = 'square' | 'circle'

export interface PrtCarouselProps {
  // true infinite loop (embla node cloning)
  loop?: boolean
  // slide alignment within the viewport; default 'start'
  align?: PrtCarouselAlign
  // slides advanced per scroll; default 1 (let embla own the semantics)
  slidesToScroll?: number | 'auto'
  // free-scroll (no snap); default false
  dragFree?: boolean
  // embla Autoplay plugin; suppressed under prefers-reduced-motion
  autoplay?: boolean
  // autoplay interval in ms; default 4000
  autoplayDelay?: number
  // show prev/next arrows; default true
  arrows?: boolean
  // show the dot pager; default true
  dots?: boolean
  // dot mark shape — square house mark (default) or circle (mindless prop)
  dotShape?: PrtCarouselDotShape
  // decoration: tints arrows + active dot
  seed?: PrtSeed
  // prev-arrow aria-label (D13 default)
  prevLabel?: string
  // next-arrow aria-label (D13 default)
  nextLabel?: string
  // dot aria-label prefix; the 1-based index is appended (D13 default)
  dotLabel?: string
  // layout-only additions
  class?: string
}
