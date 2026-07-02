import type { PrtSeed } from '../_shared/types'

export type PrtLazyImgFit = 'cover' | 'contain'
export type PrtLazyImgRounded = 'surface' | 'control' | 'none'

export interface PrtLazyImgProps {
  // image source
  src: string
  // required — a real alt, never a decorative default (a11y + the load contract)
  alt: string
  // reserves the box BEFORE the image arrives, e.g. '4/3' | '1/1' | '16/9'; omit = natural ratio (CLS caveat)
  aspect?: string
  // object-fit; default 'cover'
  fit?: PrtLazyImgFit
  // tiny inline LQIP / `data:` URI rendered blurred under the image (blur-up). NEVER a network placeholder.
  placeholder?: string
  // opt OUT of native lazy loading (above-the-fold hero)
  eager?: boolean
  // fill a consumer-sized wrapper (object-fit within the given box) instead of
  // reserving a ratio via `aspect` — for lightbox frames / fixed-height cells
  fill?: boolean
  // corner radius; default 'surface' (identity)
  rounded?: PrtLazyImgRounded
  // tints the skeleton + letterbox surface (decoration only)
  seed?: PrtSeed
  // default error-state copy (English default, override or use the #error slot)
  errorText?: string
  // default retry-affordance copy
  retryText?: string
  // layout-only additions (margin/width/grid placement)
  class?: string
}
