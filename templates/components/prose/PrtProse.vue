<!--
  PrtProse
  A drop-in typography wrapper for content you don't hand-author — rendered
  Markdown, CMS/HTML, slotted body copy. Wrap it and every element is styled with
  zero per-element work.

  The crux: em-free vertical rhythm (lobotomized-owl flow in `rlh`), a two-ratio
  fluid scale (`clamp()` + `cqi`), every element token-mapped. The fluid type
  measures against the prose column, not the viewport, via a two-element
  host/content structure (the host is the container; the content is its child, so
  it can query its own container without the self-container caveat).

  This is the kit's one component that ships a non-scoped <style>: scoped styles
  rewrite `.prt-prose p` → `…p[data-v-x]`, which doesn't match slotted / v-html
  markdown (no scope hash). The `.prt-prose` namespace + `:where()` element
  isolation is what keeps it from leaking.

  Slot contract:
    default — the content (markdown / v-html / authored body copy)
  emits: none
-->
<template>
  <component
    :is="tag"
    class="prt-prose-host"
    :style="{ '--prt-measure': measure }"
  >
    <div class="prt-prose" :class="proseSizeClass[size]"><slot /></div>
  </component>
</template>

<script setup lang="ts">
import type { PrtProseProps } from './types'
import { proseSizeClass } from './variants'

withDefaults(defineProps<PrtProseProps>(), {
  tag: 'article',
  size: 'base',
  measure: '68ch',
  class: '',
})
</script>

<!--
  Non-scoped on purpose (see the SFC header). The specificity rule: the
  `.prt-prose` class lives outside `:where()` (`.prt-prose :where(h1)`), never
  inside it. This is load-bearing.

  Why: the kit ships `@unocss/reset/tailwind-compat.css`, whose bare-element rules
  (`h1{font-size:inherit}`, `p{margin:0}`, `ul{list-style:none}`) carry
  specificity (0,0,1). PrtProse is the one component that styles tags it doesn't
  own (rendered markdown), so it must out-rank that reset. Keeping `.prt-prose`
  outside `:where()` gives every rule one class of weight (0,1,0) — beats the
  reset cleanly — while the element/combinator parts stay inside `:where()` at
  zero, so a consumer still overrides any element with a single normal class (the
  owl trims first/last structurally).

  The trap: `:where(.prt-prose) h1` zeroes the class → ties the reset → loses on
  source order → headings collapse to body size, list markers vanish, owl margins
  die.

  All lengths are em-free: rem/px fixed, lh/rlh/cap/ch type-tracking, % relative.
-->
<style>
.prt-prose-host {
  container-type: inline-size;
  max-inline-size: var(--prt-measure, 68ch);
  display: flow-root; /* contain child margins; the owl handles the rest */
}

.prt-prose {
  /* fluid scale — major-third (1.25) body steps + perfect-fourth (1.333) display
     (h1/h2). cqi measures the prose column. */
  --prt-step--1: clamp(0.9375rem, 0.91rem + 0.14cqi, 1rem); /* small / caption */
  --prt-step-0: clamp(1.0625rem, 1.02rem + 0.18cqi, 1.125rem); /* body */
  --prt-step-1: clamp(1.25rem, 1.18rem + 0.3cqi, 1.5rem); /* h4 / lead */
  --prt-step-2: clamp(1.5rem, 1.38rem + 0.5cqi, 1.875rem); /* h3 */
  --prt-step-3: clamp(1.875rem, 1.66rem + 0.85cqi, 2.25rem); /* h2 */
  --prt-step-4: clamp(2.25rem, 1.92rem + 1.2cqi, 2.75rem); /* h1 */
  /* rhythm — rlh = root line (the app reset sets html line-height:1.5).
     Graduated so headings separate hard from body: small gap after a heading,
     big gap before one. */
  --prt-flow: 1.15rlh; /* body → body */
  --prt-flow-tight: 0.4rlh; /* heading → its first element (cling) */
  --prt-flow-loose: 1.75rlh; /* around figure / table / pre / hr */
  /* per-element token hooks (consumer-overridable; default to kit tokens) */
  --prt-prose-body: var(--ink);
  --prt-prose-link: var(--accent);
  --prt-prose-code-bg: var(--surface-2);
  --prt-prose-quote-rule: var(--edge-strong);

  font-size: var(--prt-step-0);
  line-height: 1.6;
  color: var(--prt-prose-body);
}
.prt-prose--sm {
  --prt-step-0: clamp(1rem, 0.97rem + 0.12cqi, 1.0625rem);
  --prt-flow: 1rlh;
}
.prt-prose--lg {
  --prt-step-0: clamp(1.25rem, 1.18rem + 0.25cqi, 1.375rem);
  --prt-flow: 1.3rlh;
}

/* rhythm: lobotomized-owl flow in rlh (the em-free crux). `.prt-prose` outside
   `:where()` (0,1,0) so it beats the reset's `p{margin:0}` (0,0,1). Base first;
   every per-element override comes after so it wins the (0,1,0) tie on source
   order. */
.prt-prose > * + * {
  margin-block-start: var(--prt-flow);
}
.prt-prose :where(* + :is(figure, table, pre, hr)) {
  margin-block-start: var(--prt-flow-loose);
}
.prt-prose :where(* + h1) {
  margin-block-start: 2.5rlh;
}
.prt-prose :where(* + h2) {
  margin-block-start: 2rlh;
}
.prt-prose :where(* + h3) {
  margin-block-start: 1.6rlh;
}
.prt-prose :where(* + :is(h4, h5, h6)) {
  margin-block-start: 1.3rlh;
}
.prt-prose :where(li + li) {
  margin-block-start: 0.3rlh;
}
.prt-prose :where(li > :is(ul, ol)) {
  margin-block-start: 0.3rlh;
}
/* heading → its content clings (tight). Last among rhythm rules so a heading
   followed by anything (incl. a figure) reads as introducing it. */
.prt-prose :where(:is(h1, h2, h3, h4, h5, h6) + *) {
  margin-block-start: var(--prt-flow-tight);
}

/* element treatments, all token-mapped, all em-free. The appearance rules carry
   the not-prose guard so a `.not-prose` island bleeds nothing. (Flow rules need
   no guard: the owl is a direct-child selector, so it never reaches inside an
   island.) */
.prt-prose :where(h1, h2, h3, h4, h5, h6):not(:where(.not-prose, .not-prose *)) {
  color: var(--ink);
  font-weight: 600;
  line-height: 1.15;
  text-wrap: balance; /* headings only — silently no-ops past ~6 lines */
  letter-spacing: -0.02ch; /* ch, never em */
}
.prt-prose :where(h1) {
  font-size: var(--prt-step-4);
}
.prt-prose :where(h2) {
  font-size: var(--prt-step-3);
}
.prt-prose :where(h3) {
  font-size: var(--prt-step-2);
}
.prt-prose :where(h4) {
  font-size: var(--prt-step-1);
}
.prt-prose :where(h5, h6) {
  font-size: var(--prt-step-0);
}
.prt-prose :where(strong, b):not(:where(.not-prose, .not-prose *)) {
  color: var(--ink);
  font-weight: 600;
}
.prt-prose :where(p) {
  text-wrap: pretty; /* enhancement — FF falls back, no breakage */
}
.prt-prose :where(a):not(:where(.not-prose, .not-prose *)) {
  color: var(--prt-prose-link);
  text-decoration: underline;
  text-decoration-color: color-mix(in oklab, var(--prt-prose-link) 40%, transparent);
  text-underline-offset: 2px;
  transition: text-decoration-color 150ms cubic-bezier(0.2, 0, 0, 1);
}
.prt-prose :where(a):not(:where(.not-prose, .not-prose *)):hover {
  text-decoration-color: var(--prt-prose-link);
}
.prt-prose :where(code, kbd):not(:where(.not-prose, .not-prose *)) {
  font-size: 0.9375rem;
  font-family: var(--font-mono);
  border-radius: var(--radius-control);
}
.prt-prose :where(code):not(pre code):not(:where(.not-prose, .not-prose *)) {
  background: var(--prt-prose-code-bg);
  color: var(--ink);
  border: 1px solid var(--edge);
  padding: 0.125rem 0.375rem;
}
.prt-prose :where(kbd):not(:where(.not-prose, .not-prose *)) {
  background: var(--surface-3);
  border: 1px solid var(--edge-strong);
  padding: 0.125rem 0.375rem;
}
.prt-prose :where(pre):not(:where(.not-prose, .not-prose *)) {
  background: var(--surface-1);
  color: var(--ink);
  border: 1px solid var(--edge);
  border-radius: var(--radius-surface);
  padding: 0.875rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  line-height: 1.5;
  tab-size: 2;
  overflow-x: auto;
}
.prt-prose :where(pre code) {
  background: none;
  border: 0;
  padding: 0;
  font-size: inherit;
}
.prt-prose :where(blockquote):not(:where(.not-prose, .not-prose *)) {
  border-inline-start: 2px solid var(--prt-prose-quote-rule);
  padding-inline-start: 1rem;
  color: var(--ink-muted);
}
.prt-prose :where(hr):not(:where(.not-prose, .not-prose *)) {
  border: 0;
  block-size: 1px;
  background: var(--edge);
}
.prt-prose :where(table):not(:where(.not-prose, .not-prose *)) {
  width: 100%;
  border-collapse: collapse;
}
.prt-prose :where(th, td):not(:where(.not-prose, .not-prose *)) {
  border-bottom: 1px solid var(--edge);
  padding: 0.5rem 0.75rem;
  text-align: start;
}
.prt-prose :where(th):not(:where(.not-prose, .not-prose *)) {
  color: var(--ink);
  font-weight: 600;
  background: var(--surface-1);
}
.prt-prose :where(td):not(:where(.not-prose, .not-prose *)) {
  font-variant-numeric: tabular-nums; /* the kit's data stance, reused */
}
.prt-prose :where(img, figure):not(:where(.not-prose, .not-prose *)) {
  max-inline-size: 100%;
  block-size: auto;
  border-radius: var(--radius-surface);
}
.prt-prose :where(figcaption, small):not(:where(.not-prose, .not-prose *)) {
  color: var(--ink-faint);
  font-size: var(--prt-step--1);
}
.prt-prose :where(mark):not(:where(.not-prose, .not-prose *)) {
  /* solid accent — opaque so the hue stays vivid (translucency over the dark page
     desaturates emerald into muddy green). Pairs with --accent-ink: dark green ink
     in dark mode, white ink in light. Small pad + soft corners; clone so a wrapped
     highlight rounds per line. */
  background: var(--accent);
  color: var(--accent-ink);
  padding: 0.125rem 0.3rem;
  border-radius: var(--radius-mark);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
/* light mode only: the light accent is bright, so darken the fill a touch so
   the white --accent-ink reads with weight. Inherently per-mode (the ink
   polarity flips), hence the one mode selector this component carries. */
[data-mode='light'] .prt-prose :where(mark):not(:where(.not-prose, .not-prose *)) {
  background: color-mix(in oklab, var(--accent) 82%, oklch(0 0 0));
}
.prt-prose :where(abbr):not(:where(.not-prose, .not-prose *)) {
  text-decoration: underline dotted;
}

/* lists: the reset strips list-style + padding; prose restores them. */
.prt-prose :where(ul):not(:where(.not-prose, .not-prose *)) {
  list-style: disc;
}
.prt-prose :where(ol):not(:where(.not-prose, .not-prose *)) {
  list-style: decimal;
}
.prt-prose :where(ul, ol):not(:where(.not-prose, .not-prose *)) {
  padding-inline-start: 1.5rem; /* marker hang; comfortable for 2-digit ol */
}
.prt-prose :where(li):not(:where(.not-prose, .not-prose *))::marker {
  color: var(--ink-muted);
}

/* escape hatch: a `.not-prose` island (live UI dropped mid-article) — the
   element-rule guards stop prose treatments; revert-layer backstops inherited
   color/font from tinting it. */
.not-prose,
.not-prose * {
  color: revert-layer;
  font: revert-layer;
}

/* Chromium-only polish, never load-bearing (Firefox falls back, rhythm intact) */
@supports (text-box-trim: trim-both) {
  .prt-prose :where(h1, h2, h3) {
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
  }
}
</style>
