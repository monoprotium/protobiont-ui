export interface PrtLightboxItem {
  src: string
  alt: string
  // thumbnail src — the rail thumb AND the View-Transition morph source
  thumb?: string
  caption?: string
}

export type PrtLightboxThumbsPosition = 'bottom' | 'side'

export interface PrtLightboxProps {
  items: PrtLightboxItem[]
  // edge-to-edge immersive fill (the photographer / art-gallery idiom).
  // default false = centered + contained on a dimmed scrim (the conventional,
  // mixed-ratio-friendly lightbox).
  fullscreen?: boolean
  // show a thumbnail rail
  thumbs?: boolean
  // rail placement; default 'bottom'
  thumbsPosition?: PrtLightboxThumbsPosition
  // show the "i / N" index counter; default true (auto-hidden for a single item)
  counter?: boolean
  // show the built-in caption bar from `item.caption`; default false.
  // (e-commerce wants no caption; a portfolio might — so it's opt-in. The
  // `#caption` slot always renders regardless, since providing it IS intent.)
  captions?: boolean
  // click-to-zoom the active frame (contained ⇄ full-viewport); default false
  zoom?: boolean
  // aria-labels
  closeLabel?: string
  prevLabel?: string
  nextLabel?: string
  zoomLabel?: string
  // layout-only additions
  class?: string
}
