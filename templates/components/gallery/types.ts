import type { PrtSeed } from '../_shared/types'
import type { PrtLightboxItem } from '../lightbox/types'

export type PrtGalleryLayout = 'grid' | 'masonry'
export type PrtGalleryGap = 'normal' | 'dense'

export interface PrtGalleryProps {
  // shares the lightbox item shape (src / alt / thumb / caption)
  items: PrtLightboxItem[]
  // 'grid' = uniform aspect auto-fill; 'masonry' = varied-height CSS columns
  layout?: PrtGalleryLayout
  // auto-fill min cell width, e.g. '14rem' (default)
  itemMin?: string
  // grid layout only: uniform cell ratio, e.g. '1/1' (default)
  aspect?: string
  // cell spacing; default 'normal'
  gap?: PrtGalleryGap
  // selection mode: a checkable overlay per cell
  selectable?: boolean
  // click a cell → open the built-in lightbox at that index; default true
  lightbox?: boolean
  // decoration: tints selection + skeleton
  seed?: PrtSeed
  // select-toggle aria-label
  selectLabel?: string
  // layout-only additions
  class?: string
}
