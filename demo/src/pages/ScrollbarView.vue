<template>
  <DemoLayout>
    <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Scrollbars
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        two tiers · PrtScrollArea (controlled overlay) + .prt-scroll utilities (cheap)
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        These style an <strong class="text-ink">individual overflow container</strong>
        (a pane, not the page). Firefox's GTK <strong class="text-ink">overlay</strong>
        scrollbar hover-expands on pointer-approach — its footprint changes, content
        reflows, and the thumb seems to <em>flee the cursor</em>. That is
        <strong class="text-ink">not fixable in CSS</strong> (it's an OS/user setting).
        So the kit ships two tiers.
      </p>
      <p class="text-ink-faint text-xs font-mono leading-relaxed">
        TIER 1 — <span class="text-ink-muted">PrtScrollArea</span>: a native overflow
        viewport with its real bar hidden + a token-driven overlay thumb synced from
        the scroll metrics. Deterministic geometry, identical in Chrome + Firefox, zero
        cursor-repulsion, native physics preserved (no scroll-jacking). The real fix.
      </p>
      <p class="text-ink-faint text-xs font-mono leading-relaxed">
        TIER 0 — <span class="text-ink-muted">.prt-scroll / -fancy / -none</span>:
        pure-CSS utilities + tokens, zero JS. Cheap and fine for trivial panes where an
        OS-shaped Firefox bar is acceptable; they cannot remove the hover-expand.
      </p>
    </div>

    <DemoSection title="Tier 1 · PrtScrollArea — controlled overlay (drag the thumb)" min="21rem">
      <DemoItem :label="controlled[0].label" :code="controlled[0].code">
        <PrtScrollArea class="h-44 rounded-surface border border-edge bg-surface-1">
          <div class="p-4 text-sm text-ink-muted leading-relaxed" v-html="paras" />
        </PrtScrollArea>
      </DemoItem>
      <DemoItem :label="controlled[1].label" :code="controlled[1].code">
        <PrtScrollArea auto-hide="scroll" class="h-44 rounded-surface border border-edge bg-surface-1">
          <div class="p-4 text-sm text-ink-muted leading-relaxed" v-html="paras" />
        </PrtScrollArea>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Tier 0 · .prt-scroll utilities — cheap, pure-CSS" min="16rem">
      <DemoItem :label="bars[0].label" :code="bars[0].code">
        <div class="prt-scroll h-44 overflow-y-auto rounded-surface border border-edge bg-surface-1 p-4 text-sm text-ink-muted leading-relaxed" v-html="paras" />
      </DemoItem>
      <DemoItem :label="bars[1].label" :code="bars[1].code">
        <div class="prt-scroll-fancy h-44 overflow-y-auto rounded-surface border border-edge bg-surface-1 p-4 text-sm text-ink-muted leading-relaxed" v-html="paras" />
      </DemoItem>
      <DemoItem :label="bars[2].label" :code="bars[2].code">
        <div class="prt-scroll-none h-44 overflow-y-auto rounded-surface border border-edge bg-surface-1 p-4 text-sm text-ink-muted leading-relaxed" v-html="paras" />
      </DemoItem>
    </DemoSection>

    <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        <code class="font-mono text-xs">.prt-scroll</code> — a token-coloured bar at the
        browser's default width via <code class="font-mono text-xs">scrollbar-color</code>
        (no forced <code class="font-mono text-xs">scrollbar-width</code>); renders in
        Chrome, Firefox and Zen alike.
        <code class="font-mono text-xs">.prt-scroll-fancy</code> — the Chrome
        <code class="font-mono text-xs">::-webkit</code> tier (exact width/radius/hover).
        <code class="font-mono text-xs">.prt-scroll-none</code> — hidden bar, still
        scrollable.
      </p>
      <p class="text-ink-faint text-xs font-mono leading-relaxed">
        Tier 0 is standard-props-only on purpose — the old Chrome <code>::-webkit</code>
        tier mis-routed in Gecko 151+ (Zen answers <code>@supports
        selector(::-webkit-scrollbar)</code> true → uncoloured hair-thin bar).
        <code>scrollbar-width</code> is keyword-only, so the px of "thin" is browser/OS
        config (Zen ships it narrow). For exact, uniform thickness → Tier 1.
      </p>
    </div>
    </div>
  </DemoLayout>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'
import DemoLayout from '@demo/DemoLayout.vue'

// plain filler — a DEMO, not docs; the box content is incidental, it just scrolls
const paras = `<p class="mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <p class="mb-3">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p class="mb-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  <p class="mb-3">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p class="mb-3">Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius turpis et commodo pharetra est.</p>
  <p>Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula condimentum.</p>`

// Tier 1: the real component (globally registered in the demo app)
const controlled = [
  {
    label: 'PrtScrollArea — overlay thumb, no cursor-repulsion',
    code: `<PrtScrollArea class="h-44 rounded-surface border border-edge bg-surface-1">
  <div class="p-4 text-sm text-ink-muted leading-relaxed">${paras}</div>
</PrtScrollArea>`,
  },
  {
    label: 'auto-hide="scroll" — fades in while scrolling',
    code: `<PrtScrollArea auto-hide="scroll" class="h-44 rounded-surface border border-edge bg-surface-1">
  <div class="p-4 text-sm text-ink-muted leading-relaxed">${paras}</div>
</PrtScrollArea>`,
  },
]

// Tier 0: pure-CSS utilities on a plain overflow box
const box = (cls: string) => `<div class="${cls} h-44 overflow-y-auto rounded-surface border border-edge bg-surface-1 p-4 text-sm text-ink-muted leading-relaxed">
  ${paras}
</div>`

const bars = [
  { label: '.prt-scroll — token-coloured, default width (Chrome · Firefox · Zen)', code: box('prt-scroll') },
  { label: '.prt-scroll-fancy — Chrome ::-webkit tier (thin in Gecko/Zen)', code: box('prt-scroll-fancy') },
  { label: '.prt-scroll-none — hidden, still scrollable', code: box('prt-scroll-none') },
]
</script>
