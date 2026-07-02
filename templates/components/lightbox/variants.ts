import { cva } from 'class-variance-authority'

// lightbox look. The dimmed page is the `::backdrop` scrim token; the dialog
// itself is transparent (contained) or `surface-0` (fullscreen immersive).
export const lightboxCloseClass = 'absolute right-4 top-4 z-10'

export const lightboxCaptionClass =
  'max-w-[90vw] px-4 py-1.5 text-center text-sm text-ink'

// thumbnail rail button — accent ring on the active frame
export const lightboxThumbVariants = cva(
  'h-14 w-20 shrink-0 overflow-hidden rounded-control border-2 prt-motion-colors prt-ring',
  {
    variants: {
      active: {
        true: 'border-[var(--accent)] opacity-100',
        false: 'border-transparent opacity-50 hover:opacity-100',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

// the shared View-Transition name paired with the gallery thumbnail for the
// thumb→fullscreen morph (assigned only while the morph runs).
export const LIGHTBOX_MORPH_NAME = 'prt-lb-morph'
