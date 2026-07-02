<!--
  PrtList demo — a specimen-catalogue layout. Each list is a figure with a ruled
  header (index · name · token) and a demoted footnote; sections carry a big mono
  numeral. The active state lives in the specimen header/footnote (a selected
  index row), not a floating caption.

  This page is its own bespoke layout (no DemoItem). The examples are real
  <PrtList> markup driven by per-spec props — no runtime template compiler. The
  source panel string is generated from the same spec data (sourceOf), so the
  render and the shown source share one source of truth. The list content is
  disposable placeholder; the component is the subject.
  No `em` units anywhere (house rule).
-->
<template>
  <div class="lc">
    <section v-for="sec in sections" :key="sec.no" class="lc-section">
      <div class="lc-sec-head">
        <span class="lc-no">{{ sec.no }}</span>
        <h2>{{ sec.title }}</h2>
        <span class="lc-sub">{{ sec.sub }}</span>
      </div>
      <div class="lc-grid" :class="sec.cols === 2 ? 'lc-grid-2' : 'lc-grid-1'">
        <article
          v-for="spec in sec.specs"
          :key="spec.id"
          class="lc-spec"
          :class="{ active: isActive(spec) }"
        >
          <header class="lc-spec-head" @click="select(spec)">
            <span class="lc-id">{{ spec.id }}</span>
            <span class="lc-name">{{ spec.name }}</span>
            <span class="lc-token" v-html="spec.token" />
          </header>
          <div class="lc-body">
            <PrtList :marker="spec.marker" :size="spec.size" :dense="spec.dense" :class="spec.cls">
              <template v-if="spec.content === 'nested'">
                <li v-for="g in nestedGroups" :key="g.label">
                  {{ g.label }}
                  <ul>
                    <li v-for="s in g.sub" :key="s">{{ s }}</li>
                  </ul>
                </li>
              </template>
              <template v-else-if="spec.content === 'rich'">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <li v-for="t in richItems" :key="t" v-html="t" />
              </template>
              <template v-else>
                <li v-for="t in items" :key="t">{{ t }}</li>
              </template>
            </PrtList>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="lc-foot" @click="select(spec)" v-html="spec.foot" />
        </article>
      </div>
    </section>

    <p class="lc-colophon">
      A design element, not body copy. Every mark is drawn with
      <code>::before</code> (not <code>::marker</code>), sized in cap / lh / ch
      so the whole list scales with its font-size. No <b>em</b> units anywhere.
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { activeSnippet, showSnippet, showSnippetIfEmpty } from '@demo/sourceStore'
import type { PrtListMarker } from './types'

// Disposable placeholder content — the component is the subject, not the words.
const items = [
  'One identity color, ten seeds.',
  'Borders before shadows.',
  'Three radii, one motion curve.',
  'Dark is canonical; light is a token swap.',
]
// rich <li> children — the inline-composition demo
const richItems = [
  'Install once with <code>bun add -g prt</code>, then <code>prt init</code> per app.',
  'Tokens live in <a href="#">tokens.css</a> — swap the theme file and <strong>everything</strong> restyles.',
  'Behavior lives in composables, never <strong>smeared through templates</strong>.',
]
// one-level nesting demo
const nestedGroups = [
  { label: 'Status & feedback', sub: ['notice, toast, loader', 'progress, skeleton, emptystate'] },
  { label: 'Collections', sub: ['listing, filterbar, infinitescroll', 'indexbar, timeline'] },
]

interface Spec {
  id: string
  name: string
  // header right-set token + footnote — authored HTML (value goes accent via <b>)
  token: string
  foot: string
  // props that drive BOTH the live render and the generated source
  marker?: PrtListMarker
  size?: 'sm' | 'base' | 'lg'
  dense?: boolean
  // arbitrary layout class (e.g. the poster font-size override)
  cls?: string
  content?: 'plain' | 'rich' | 'nested'
}
interface Section {
  no: string
  title: string
  sub: string
  cols: 1 | 2
  specs: Spec[]
}

const sections: Section[] = [
  {
    no: '01',
    title: 'Poster scale',
    sub: 'the list as a design element, not body copy',
    cols: 1,
    specs: [
      { id: '01·1', name: 'square', token: 'size=<b>"lg"</b>', foot: 'a confident medium — the marks and the rhythm scale <b>with</b> the type, never against it.', marker: 'square', size: 'lg' },
      { id: '01·2', name: 'decimal', token: 'poster-sized', foot: 'numbered, poster-sized — the numeral becomes the graphic.', marker: 'decimal', cls: '![font-size:1.35rem]' },
    ],
  },
  {
    no: '02',
    title: 'Markers',
    sub: 'the designed range, one content set',
    cols: 2,
    specs: [
      { id: '02·1', name: 'square', token: 'marker=<b>"square"</b>', foot: 'default — a solid emerald square, the signature.', marker: 'square' },
      { id: '02·2', name: 'spine', token: 'marker=<b>"spine"</b>', foot: 'solid nodes joined by a hairline — timeline / steps.', marker: 'spine' },
      { id: '02·3', name: 'dash', token: 'marker=<b>"dash"</b>', foot: 'a short 2px accent tick.', marker: 'dash' },
      { id: '02·4', name: 'decimal', token: 'marker=<b>"decimal"</b>', foot: 'accent numerals, leading-zero, tabular, right-set.', marker: 'decimal' },
      { id: '02·5', name: 'disc', token: 'marker=<b>"disc"</b>', foot: 'a drawn, centered accent circle — the rare round.', marker: 'disc' },
      { id: '02·6', name: 'none', token: 'marker=<b>"none"</b>', foot: 'rhythm only — the gap does the work.', marker: 'none' },
    ],
  },
  {
    no: '03',
    title: 'Rhythm',
    sub: 'the grouping is the point',
    cols: 2,
    specs: [
      { id: '03·1', name: 'blocks', token: 'default gap', foot: 'tight leading inside, deliberate gap between — each item reads as a <b>block</b>.', marker: 'square' },
      { id: '03·2', name: 'dense', token: 'dense', foot: 'the tighter changelog rhythm.', marker: 'dash', dense: true },
      { id: '03·3', name: 'index', token: '01 → 10', foot: 'numerals hold one right edge; the text axis stays dead straight.', marker: 'decimal' },
      { id: '03·4', name: 'spine', token: 'diagram', foot: 'the same content reads as a knowledge diagram.', marker: 'spine' },
    ],
  },
  {
    no: '04',
    title: 'Rich inline',
    sub: 'links, code, emphasis — still composed',
    cols: 1,
    specs: [
      { id: '04·1', name: 'inline', token: '&lt;a&gt; · &lt;code&gt; · &lt;strong&gt;', foot: 'rich <code>&lt;li&gt;</code> children render fully composed.', marker: 'square', content: 'rich' },
    ],
  },
  {
    no: '05',
    title: 'Nesting',
    sub: 'one level deep, zero effort',
    cols: 1,
    specs: [
      { id: '05·1', name: 'nested', token: '&lt;ul&gt; &gt; &lt;ul&gt;', foot: 'a nested plain <code>&lt;ul&gt;</code> derives the same marks and rhythm.', marker: 'square', content: 'nested' },
    ],
  },
]

// the source-panel string, GENERATED from the same spec data the live render
// uses — no template string is ever compiled, render and source can't drift.
function sourceOf(spec: Spec): string {
  const attrs = [
    spec.marker && spec.marker !== 'square' ? `marker="${spec.marker}"` : '',
    spec.size ? `size="${spec.size}"` : '',
    spec.dense ? 'dense' : '',
    spec.cls ? `class="${spec.cls}"` : '',
  ].filter(Boolean)
  const open = attrs.length ? `<PrtList ${attrs.join(' ')}>` : '<PrtList>'
  let inner: string
  if (spec.content === 'nested') {
    inner = nestedGroups
      .map((g) => `  <li>${g.label}\n    <ul>\n${g.sub.map((s) => `      <li>${s}</li>`).join('\n')}\n    </ul>\n  </li>`)
      .join('\n')
  } else if (spec.content === 'rich') {
    inner = richItems.map((t) => `  <li>${t}</li>`).join('\n')
  } else {
    inner = items.map((t) => `  <li>${t}</li>`).join('\n')
  }
  return `${open}\n${inner}\n</PrtList>`
}

function snippetOf(spec: Spec) {
  return { title: spec.name, code: sourceOf(spec), imports: ['PrtList'] }
}

function isActive(spec: Spec): boolean {
  return activeSnippet.value?.code === sourceOf(spec)
}

function select(spec: Spec) {
  showSnippet(snippetOf(spec))
}

onMounted(() => {
  showSnippetIfEmpty(snippetOf(sections[0].specs[0]))
})
</script>

<style scoped>
/* UNITS: NO `em`. rem/px fixed; ch for text-axis; cap/lh in the list itself. */
.lc-section { margin-bottom: 4.5rem; }
.lc-section:last-of-type { margin-bottom: 2.5rem; }

/* section header — the numeral is the graphic anchor, restrained (not display) */
.lc-sec-head { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 2rem; }
.lc-no {
  font-family: var(--font-mono); font-size: 1.0625rem;
  font-variant-numeric: tabular-nums; letter-spacing: 0.06ch;
  color: var(--accent); flex-shrink: 0;
}
.lc-sec-head h2 {
  margin: 0; font-size: 0.8125rem; font-weight: 400;
  letter-spacing: 0.18rem; text-transform: uppercase; color: var(--ink); flex-shrink: 0;
}
.lc-sub {
  font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-faint);
  border-left: 1px solid var(--edge-strong); padding-left: 0.85rem;
  align-self: stretch; display: flex; align-items: center;
}

/* the grid of specimens */
.lc-grid { display: grid; gap: 0; }
.lc-grid-1 { grid-template-columns: 1fr; }
.lc-grid-2 { grid-template-columns: repeat(auto-fill, minmax(min(24rem, 100%), 1fr)); column-gap: 3rem; }

/* a single specimen = ruled header + body + footnote */
.lc-spec {
  border-top: 1px solid var(--edge);
  padding: 1.5rem 0 1.75rem;
  min-width: 0; display: flex; flex-direction: column;
}

/* ruled header: index · name on the left, token on the right */
.lc-spec-head { display: flex; align-items: baseline; gap: 0.9ch; margin-bottom: 1.4rem; cursor: pointer; }
.lc-id {
  font-family: var(--font-mono); font-size: 0.75rem;
  font-variant-numeric: tabular-nums; letter-spacing: 0.04ch; color: var(--ink-faint);
  display: inline-flex; align-items: baseline; gap: 0.7ch; flex-shrink: 0;
  transition: color var(--motion-duration) var(--motion-ease);
}
/* the signature mark, echoed in the header; goes accent when selected */
.lc-id::before {
  content: ''; width: 0.45rem; height: 0.45rem; border-radius: 1px;
  background: var(--edge-strong); transform: translateY(-0.04rem);
  transition: background var(--motion-duration) var(--motion-ease);
}
.lc-name {
  font-size: 0.75rem; font-weight: 500; letter-spacing: 0.13rem;
  text-transform: uppercase; color: var(--ink-muted);
  transition: color var(--motion-duration) var(--motion-ease);
}
.lc-token {
  margin-left: auto; font-family: var(--font-mono); font-size: 0.6875rem;
  letter-spacing: 0.02ch; color: var(--ink-faint); white-space: nowrap; align-self: center;
}
.lc-token :deep(b) { color: var(--accent); font-weight: 400; }

/* ACTIVE — green lives in the index/header row, reading as a selected row */
.lc-spec.active .lc-id { color: var(--accent); }
.lc-spec.active .lc-id::before { background: var(--accent); }
.lc-spec.active .lc-name { color: var(--accent); }

/* the list body — constrained so the measure stays readable */
.lc-body { min-width: 0; max-width: 40rem; }

/* footnote — demoted, faint, clearly secondary; selects the specimen */
.lc-foot {
  margin: 1.4rem 0 0; max-width: 40rem; width: fit-content; cursor: pointer;
  font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.55; color: var(--ink-faint);
  transition: color var(--motion-duration) var(--motion-ease);
}
.lc-foot :deep(b) { color: var(--ink-muted); font-weight: 400; transition: color var(--motion-duration) var(--motion-ease); }
.lc-foot:hover { color: var(--ink-muted); }
.lc-spec.active .lc-foot,
.lc-spec.active .lc-foot :deep(b) { color: var(--accent); }

/* closing colophon */
.lc-colophon {
  margin-top: 1rem; padding: 1.25rem 0 0; border-top: 1px solid var(--edge);
  font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.65;
  color: var(--ink-faint); max-width: 44rem;
}
.lc-colophon :deep(code) {
  font-family: var(--font-mono); font-size: 85%; color: var(--ink);
  background: var(--wash); padding: 1px 0.4ch; border-radius: var(--radius-mark);
}
.lc-colophon b { color: var(--ink-muted); font-weight: 400; }
</style>
