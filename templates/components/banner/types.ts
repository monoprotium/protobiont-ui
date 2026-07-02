import type { PrtSeed } from '../_shared/types'

export type PrtBannerVariant = 'overlay' | 'split'
export type PrtBannerContentAlign = 'start' | 'center'
export type PrtBannerMediaAlign = 'start' | 'end'
export type PrtBannerOverlayStrength = 'none' | 'light' | 'medium' | 'strong'
export type PrtBannerScrimTone = 'dark' | 'light'

export interface PrtBannerProps {
  // 'overlay' = full-bleed text-over-media + scrim; 'split' = two-col grid
  variant?: PrtBannerVariant
  // text block alignment — default 'start'
  contentAlign?: PrtBannerContentAlign
  // split only: which side the media sits — default 'end'
  mediaAlign?: PrtBannerMediaAlign
  // CSS length — default '60svh' (svh, never vh)
  minHeight?: string
  // overlay only — scrim alpha for legibility over media; default 'medium'
  overlayStrength?: PrtBannerOverlayStrength
  // overlay only — scrim polarity: 'dark' veil + light text (default), or
  // 'light' veil + dark text for bright / high-key imagery; default 'dark'
  scrimTone?: PrtBannerScrimTone
  // optional decorative tint on chrome (eyebrow, actions area)
  seed?: PrtSeed
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
