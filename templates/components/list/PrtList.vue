<!--
  PrtList
  A designed list object (infographic / feature / knowledge register), not a
  documentation bullet list. Character comes from proportion and the marks, not
  display sizes: a deliberate grouping rhythm (inter-item gap well above the
  line-leading, so items read as discrete blocks), cap-height-aligned custom
  marks, a single text axis, accent used sparingly, type kept restrained
  (sm/base/lg).
  Primary API: the default slot with <li> children (rich inline content — links,
  code, bold — is the point). `items` covers the trivial string case. Element
  follows the marker: <ol> for 'decimal', <ul> otherwise.
  Marks are drawn with ::before/::after, not ::marker — ::marker accepts too few
  properties and Firefox is stricter about it; only the 'disc' opt-out rides
  ::marker. role="list" restores list semantics that `list-style:none` strips in
  some engines.
  No active/disabled/hover states — selection and navigation are other components'
  jobs.
  Slot contract:
    default — <li> children (wins over `items`)
-->
<template>
  <component
    :is="tag"
    role="list"
    :data-marker="marker"
    :data-dense="dense || undefined"
    :class="cx(listVariants({ size }), props.class)"
  >
    <slot>
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtListProps } from './types'
import { listVariants } from './variants'

const props = withDefaults(defineProps<PrtListProps>(), {
  marker: 'square',
  dense: false,
  size: 'base',
  items: () => [],
  class: '',
})

// semantics follow the marker
const tag = computed(() => (props.marker === 'decimal' ? 'ol' : 'ul'))
</script>

<style>
/* Unscoped on purpose, namespaced under .prt-list (same as the dialog
   scroll-lock): the rules must reach slotted <li> children, which carry the
   consumer's scope id, so scoped CSS can't match them. Idempotent when copied.
   Descendant `li` selectors let nested plain <ul>/<ol> inherit the marks and
   rhythm one level deep. */
/* No `em`, ever (house rule — it compounds unpredictably). Font-relative units
   here: `cap` and `lh` for anything that tracks the type, `ch` for text-axis
   indents, `%` for relative font-size, `rem`/`px` for fixed lengths. */
.prt-list {
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1.5;
  /* confident ink, not washed gray */
  color: var(--ink);
  text-wrap: pretty;
}
.prt-list li {
  position: relative;
  /* Optical-center anchor for marks (size-proof). 1lh = line box, 1cap = cap
     height. The cap sits above the line-box center, so the constant is tuned
     (0.42cap, not 0.5cap) to land marks on the text's visual middle — this is
     the centering knob; nudge it if marks read high or low. */
  --prt-cap: calc((1lh - 1cap) / 2 + 0.42cap);
  /* gutter (ch = text-axis indent) — mark sits close to the text; wrapped lines
     align to one axis past it */
  padding-left: 1.9ch;
}
/* rhythm (lh scales with the leading); dense tightens it for changelog-style
   lists */
.prt-list li + li {
  margin-top: 0.75lh;
}
.prt-list[data-dense] li + li {
  margin-top: 0.4lh;
}
/* nested: one clean step in, same rhythm */
.prt-list li > ul,
.prt-list li > ol {
  margin: 0.3lh 0 0;
  padding-left: 1.4ch;
  list-style: none;
}

/* marks: solid, accent-forward, sized in `cap` so they track the type,
   cap-aligned via --prt-cap */

/* SQUARE — the signature: a solid emerald square. One small, decisive mark. */
.prt-list[data-marker='square'] li::before {
  content: '';
  position: absolute;
  left: 0;
  top: calc(var(--prt-cap) - 0.25cap);
  width: 0.5cap;
  height: 0.5cap;
  background: var(--accent);
  border-radius: 1px;
}

/* DASH — a short accent tick (2px), not a faint hairline. */
.prt-list[data-marker='dash'] li::before {
  content: '';
  position: absolute;
  left: 0;
  top: calc(var(--prt-cap) - 1px);
  width: 1.3ch;
  height: 2px;
  background: var(--accent);
}

/* SPINE — solid accent nodes joined by a hairline rule (timeline / step
   diagram). padding-bottom carries the gap so the connector can span it;
   ::before = node, ::after = connector. */
.prt-list[data-marker='spine'] li {
  padding-bottom: 0.75lh;
}
.prt-list[data-marker='spine'] li + li {
  margin-top: 0;
}
.prt-list[data-marker='spine'] li:last-child {
  padding-bottom: 0;
}
.prt-list[data-marker='spine'] li::before {
  content: '';
  position: absolute;
  left: 0;
  top: calc(var(--prt-cap) - 0.25cap);
  width: 0.5cap;
  height: 0.5cap;
  background: var(--accent);
  border-radius: 1px;
  z-index: 1;
}
.prt-list[data-marker='spine'] li::after {
  content: '';
  position: absolute;
  left: calc(0.25cap - 0.5px); /* centered under the 0.5cap node */
  top: calc(var(--prt-cap) + 0.25cap); /* from the node's bottom edge */
  bottom: -1px;
  width: 1px;
  background: var(--edge-strong);
}
.prt-list[data-marker='spine'] li:last-child::after {
  display: none;
}

/* DISC — the round alternative, drawn (not ::marker, which sits on the baseline
   and reads off-center): a small accent circle, cap-centered via --prt-cap. */
.prt-list[data-marker='disc'] li::before {
  content: '';
  position: absolute;
  left: 0;
  top: calc(var(--prt-cap) - 0.23cap);
  width: 0.46cap;
  height: 0.46cap;
  border-radius: 50%;
  background: var(--accent);
}

/* DECIMAL — numbered index: accent numerals, tabular + leading-zero, right-set
   so the column holds one edge and the text keeps one axis. Full-size + top:0 so
   the numeral baseline aligns with the body baseline (shrinking the font threw
   the alignment off). */
.prt-list[data-marker='decimal'] {
  counter-reset: prt-list-n;
  padding-left: 0;
}
.prt-list[data-marker='decimal'] li {
  counter-increment: prt-list-n;
  padding-left: 3.6ch;
}
.prt-list[data-marker='decimal'] li::before {
  content: counter(prt-list-n, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0; /* same font-size + line-height ⇒ baselines align */
  width: 2.6ch;
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  letter-spacing: 0.04ch;
  color: var(--accent);
}

.prt-list[data-marker='none'] li {
  padding-left: 0;
}

/* ink hierarchy + the house link/code treatment — so dropped-in HTML looks
   composed */
.prt-list strong,
.prt-list b {
  color: var(--ink);
  font-weight: 500;
}
.prt-list a {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--edge-strong);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2ex;
  transition:
    color var(--motion-duration) var(--motion-ease),
    text-decoration-color var(--motion-duration) var(--motion-ease);
}
.prt-list a:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
}
.prt-list code {
  font-family: var(--font-mono);
  font-size: 85%;
  color: var(--ink);
  background: var(--wash);
  padding: 1px 0.4ch;
  border-radius: var(--radius-mark);
}
</style>
