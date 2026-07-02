<!--
  PrtBanner
  A hero / promo block (not an alert). Two layouts: `overlay` (full-bleed text
  over media + oklab scrim) and `split` (two-col grid). A recipe — a copyable
  wired block the consumer owns and adjusts.

  Renders no <img> and no spinner: the consumer drops a PrtLazyImg into the
  `media` slot (blur-up / decode / aspect / error all handled there). Responsive
  via container queries, not the viewport — a hero may sit in a narrow column or
  full-width, where viewport breakpoints flip at the wrong place.

  Slot contract (caller controls heading level):
    eyebrow — small kicker above the heading
    heading — the headline (drop your own <h1>/<h2>)
    text    — supporting copy
    actions — PrtBtn(s)
    media   — drop <PrtLazyImg fill .../> (the banner box owns sizing)
  emits: none
-->
<template>
  <!-- root is the query container only (a bare wrapper). The layout grid and the
       rounded/border frame live on the inner child: an element can't respond to
       its own container query (the split two-col switch has to target a
       descendant), and the frame must clip the media on the same element that
       contains it (rounded corners on the image). -->
  <div
    :data-seed="seed ?? undefined"
    :style="{ '--prt-banner-minh': minHeight }"
    :class="cx('prt-banner', props.class)"
  >
    <div :class="bannerVariants({ variant, contentAlign, mediaAlign, overlayStrength, scrimTone })">
      <div v-if="$slots.media" class="prt-banner__media">
        <slot name="media" />
      </div>
      <div class="prt-banner__content">
        <div v-if="$slots.eyebrow" class="prt-banner__eyebrow">
          <slot name="eyebrow" />
        </div>
        <div v-if="$slots.heading" class="prt-banner__heading">
          <slot name="heading" />
        </div>
        <div v-if="$slots.text" class="prt-banner__text">
          <slot name="text" />
        </div>
        <div v-if="$slots.actions" class="prt-banner__actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtBannerProps } from './types'
import { bannerVariants } from './variants'

const props = withDefaults(defineProps<PrtBannerProps>(), {
  variant: 'overlay',
  contentAlign: 'start',
  mediaAlign: 'end',
  minHeight: '60svh',
  overlayStrength: 'medium',
  scrimTone: 'dark',
  class: '',
})
</script>

<style scoped>
/* container-query responsive (the whole point — works in a narrow column);
   cqi drives the fluid heading regardless of viewport. */
.prt-banner {
  container-type: inline-size;
}

/* The scrim is two independent axes — STRENGTH (alpha) and TONE (veil colour).
   Strength sets the two alpha stops; tone sets the veil lightness (--prt-scrim-l)
   and the text ink. Both are MODE-STABLE: a dark veil is dark and a light veil is
   light in BOTH app modes, so the inks must NOT flip with --ink. */
.prt-banner--scrim-light {
  --prt-scrim-a1: 0.3;
  --prt-scrim-a2: 0.1;
}
.prt-banner--scrim-medium {
  --prt-scrim-a1: 0.55;
  --prt-scrim-a2: 0.2;
}
.prt-banner--scrim-strong {
  --prt-scrim-a1: 0.78;
  --prt-scrim-a2: 0.42;
}

/* tone: dark veil + light text (default) vs light veil + dark text (bright
   imagery). Tone only swaps the veil lightness + ink; strength is unchanged. */
.prt-banner--scrim-tone-light {
  --prt-scrim-l: 100%; /* light veil (default is 0% — set on .prt-banner--overlay) */
}

/* ── overlay: media + content share one grid cell; scrim between them ── */
.prt-banner--overlay {
  display: grid;
  min-block-size: var(--prt-banner-minh, 60svh);
  --prt-scrim-l: 0%; /* dark veil — overridden by .prt-banner--scrim-tone-light */
}
.prt-banner--overlay > * {
  grid-area: 1 / 1;
}
.prt-banner--overlay .prt-banner__media {
  z-index: 0;
}
.prt-banner--overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    in oklab,
    oklch(var(--prt-scrim-l, 0%) 0 0 / var(--prt-scrim-a1, 0)) 0%,
    oklch(var(--prt-scrim-l, 0%) 0 0 / var(--prt-scrim-a2, 0)) 55%,
    transparent 100%
  );
}
.prt-banner--overlay .prt-banner__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.5rem, 4cqi, 3.5rem);
  max-inline-size: 42rem;
  color: var(--ink-on-scrim);
}
/* light veil → dark ink (both mode-stable). Set on content so eyebrow/text
   inherit it. */
.prt-banner--overlay.prt-banner--scrim-tone-light .prt-banner__content {
  color: var(--ink-on-scrim-inverse);
}
.prt-banner--overlay.prt-banner--align-start .prt-banner__content {
  justify-content: center;
  align-items: flex-start;
  text-align: start;
}
.prt-banner--overlay.prt-banner--align-center .prt-banner__content {
  justify-content: center;
  align-items: center;
  text-align: center;
  max-inline-size: 48rem;
  margin-inline: auto;
}

/* ── split = the SOLID-BG SIDE CAPTION (the reliable, image-independent option):
   text sits on its own surface panel BESIDE the media, never over it — so it's
   legible regardless of the photo, no scrim/luminance guessing. Stacked by
   default, two-col past the container threshold. Ink is the normal mode-aware
   --ink (it's on a real surface, not a veil). ── */
.prt-banner--split {
  display: grid;
  grid-template-columns: 1fr;
}
.prt-banner--split .prt-banner__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.5rem, 4cqi, 3rem);
  justify-content: center;
  background: var(--surface-2);
  color: var(--ink);
}
.prt-banner--split.prt-banner--align-center .prt-banner__content {
  align-items: center;
  text-align: center;
}
/* stacked: a real aspect box, position:relative so the fill-image (which is
   `absolute inset-0` inside PrtLazyImg) has a definite-height host. Without this
   the aspect-ratio height isn't "definite" for the child's block-size:100% and
   the fill image collapses to zero (overlay works only because its grid cell has
   a definite min-block-size). */
.prt-banner--split .prt-banner__media {
  position: relative;
  aspect-ratio: 16 / 9;
}
.prt-banner--split .prt-banner__media > :deep(*) {
  position: absolute;
  inset: 0;
}
@container (min-width: 40rem) {
  .prt-banner--split {
    grid-template-columns: var(--prt-banner-ratio, 1fr) 1fr;
    align-items: stretch;
    min-block-size: var(--prt-banner-minh, 60svh);
  }
  .prt-banner--split .prt-banner__media {
    /* drop the aspect box; the grid row's `align-items: stretch` sizes the media
       to the content column's height (a definite used height the absolute-fill
       image can fill). `block-size: 100%` would resolve against the container's
       only-min height and collapse to zero. */
    aspect-ratio: auto;
  }
  /* mediaAlign swaps the column order (logical, no markup change) */
  .prt-banner--split.prt-banner--media-start .prt-banner__media {
    order: -1;
  }
  .prt-banner--split.prt-banner--media-end .prt-banner__media {
    order: 1;
  }
}

/* the slotted media (PrtLazyImg) fills the banner's media box — the box owns
   sizing, the image owns object-fit (pass `fill` to PrtLazyImg). */
.prt-banner__media > :deep(*) {
  inline-size: 100%;
  block-size: 100%;
  /* the FRAME (on .prt-banner__layout) owns the corners — kill any radius the
     slotted media carries (PrtLazyImg defaults to rounded="surface"), or the
     image rounds its own INNER seam against the content panel. */
  border-radius: 0;
}

/* fluid HERO heading via cqi — no vw, no em (overlay only) */
.prt-banner__heading {
  font-size: clamp(1.75rem, 4cqi + 1rem, 3.5rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02ch;
  text-wrap: balance;
}
/* the split side caption is a RESTRAINED box, not a hero: modest type so the
   image stays dominant. */
.prt-banner--split .prt-banner__heading {
  font-size: clamp(1.25rem, 1cqi + 1.05rem, 1.6rem);
  line-height: 1.2;
}
.prt-banner--split .prt-banner__text {
  font-size: 0.9375rem;
}
.prt-banner--split .prt-banner__content {
  gap: 0.625rem;
}
.prt-banner__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12ch;
  color: var(--seed, var(--accent));
}
.prt-banner--overlay .prt-banner__eyebrow {
  /* over the scrim, the kicker rides the tone ink (don't tint to a dark seed) */
  color: inherit;
  opacity: 0.85;
}
.prt-banner__text {
  font-size: 1.0625rem;
  line-height: 1.5;
  max-inline-size: 52ch;
}
.prt-banner--overlay .prt-banner__text {
  opacity: 0.92;
}
.prt-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block-start: 0.5rem;
}
.prt-banner--align-center .prt-banner__actions {
  justify-content: center;
}
</style>
