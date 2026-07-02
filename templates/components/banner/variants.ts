import { cva } from 'class-variance-authority'

// variant/align/strength/tone axes map to literal class lookups; the scrim
// gradient + container-query grid live in the SFC's scoped block (what
// utilities can't express). Text over media uses the mode-stable
// --ink-on-scrim (dark tone) / --ink-on-scrim-inverse (light tone) tokens.
export const bannerVariants = cva('prt-banner__layout relative isolate overflow-hidden rounded-surface border border-edge', {
  variants: {
    variant: {
      overlay: 'prt-banner--overlay',
      split: 'prt-banner--split',
    },
    contentAlign: {
      start: 'prt-banner--align-start',
      center: 'prt-banner--align-center',
    },
    mediaAlign: {
      start: 'prt-banner--media-start',
      end: 'prt-banner--media-end',
    },
    overlayStrength: {
      none: '',
      light: 'prt-banner--scrim-light',
      medium: 'prt-banner--scrim-medium',
      strong: 'prt-banner--scrim-strong',
    },
    scrimTone: {
      dark: '',
      light: 'prt-banner--scrim-tone-light',
    },
  },
  defaultVariants: {
    variant: 'overlay',
    contentAlign: 'start',
    mediaAlign: 'end',
    overlayStrength: 'medium',
    scrimTone: 'dark',
  },
})
