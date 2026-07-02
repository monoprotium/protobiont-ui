import { cva } from 'class-variance-authority'

// the wrapper carries the reserved box (aspect-ratio rides a style binding —
// the truly-dynamic channel, not a class) and the seed-tinted letterbox /
// loading surface. `--seed-wash` falls back to `--surface-2`; an unseeded
// image is a quiet surface. Stance: never `bg-black` behind a `contain` image.
export const lazyImgVariants = cva(
  'relative block overflow-hidden bg-[var(--seed-wash,var(--surface-2))]',
  {
    variants: {
      rounded: {
        surface: 'rounded-surface',
        control: 'rounded-control',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      rounded: 'surface',
    },
  },
)

// the media layer (real image AND the blurred placeholder). `reserved` =
// an `aspect` was given, so the box is fixed and the image FILLS it; without
// it the image flows at its natural ratio and defines the box height itself.
export const lazyImgMediaVariants = cva('prt-motion', {
  variants: {
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
    },
    reserved: {
      true: 'absolute inset-0 h-full w-full',
      false: 'block h-auto w-full',
    },
  },
  defaultVariants: {
    fit: 'cover',
    reserved: false,
  },
})
