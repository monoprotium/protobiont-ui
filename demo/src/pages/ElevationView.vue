<template>
  <DemoLayout>
    <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Elevation
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        reference · surface lightness + honest dark shadows, revealed by a lighter wrapper
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        <strong class="text-ink">A dark shadow stays dark.</strong> On a near-black
        canvas it gets swallowed whole — so depth seems to vanish. The fix is NOT a
        lighter shadow (that reads fake); it's a <strong class="text-ink">lighter
        wrapper</strong>: sit the layer inside a container a step lighter than the page,
        and the honest dark shadow finally has something to fall on.
      </p>
      <p class="text-ink-muted">
        Elevation signifies a <strong class="text-ink">layer</strong>, not a physical
        button — flat fill, a hairline boundary, and a shadow that says "this floats
        above." No bevels, no gloss.
      </p>
      <p class="text-ink-faint text-xs font-mono">
        depth vocabulary: surface-0..3 lightness · --edge hairline · shadow-raise /
        -float / -overlay (diffusion). (--inset-highlight is the one opt-in tactile cue.)
      </p>
    </div>

    <!-- THE PRINCIPLE — live side-by-side, same layer, two backgrounds -->
    <section class="mb-12">
      <div class="mb-6 border-l-2 border-edge-strong pl-3">
        <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
          The principle — the wrapper reveals the shadow
        </h2>
      </div>
      <div class="pl-3.5 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
        <div class="flex flex-col gap-2">
          <div class="rounded-surface bg-surface-0 h-48 grid place-items-center px-6">
            <div class="w-full max-w-[15rem] rounded-surface bg-surface-2 border border-edge p-4 shadow-overlay">
              <p class="text-sm text-ink">Layer</p>
              <p class="text-xs text-ink-faint mt-0.5">a sheet above the page</p>
            </div>
          </div>
          <span class="text-xs font-mono text-ink-faint">
            on the surface-0 canvas — the dark shadow is swallowed
          </span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="rounded-surface bg-surface-2 h-48 grid place-items-center px-6">
            <div class="w-full max-w-[15rem] rounded-surface bg-surface-2 border border-edge p-4 shadow-overlay">
              <p class="text-sm text-ink">Layer</p>
              <p class="text-xs text-ink-faint mt-0.5">a sheet above the page</p>
            </div>
          </div>
          <span class="text-xs font-mono text-ink-faint">
            in a surface-2 wrapper — same shadow, now it reads
          </span>
        </div>
      </div>
    </section>

    <DemoSection title="The three tiers — diffusion, shown in a lighter wrapper" min="18rem">
      <DemoItem :label="elevation[0].label" :code="elevation[0].code">
        <div class="rounded-surface bg-surface-2 p-7">
          <div class="rounded-surface bg-surface-2 border border-edge p-4 shadow-raise">
            <p class="text-sm text-ink">Raised layer</p>
            <p class="text-xs text-ink-faint mt-0.5">cards, controls</p>
          </div>
        </div>
      </DemoItem>
      <DemoItem :label="elevation[1].label" :code="elevation[1].code">
        <div class="rounded-surface bg-surface-2 p-7">
          <div class="rounded-surface bg-surface-2 border border-edge p-4 shadow-float">
            <p class="text-sm text-ink">Floating layer</p>
            <p class="text-xs text-ink-faint mt-0.5">menus, tooltips</p>
          </div>
        </div>
      </DemoItem>
      <DemoItem :label="elevation[2].label" :code="elevation[2].code">
        <div class="rounded-surface bg-surface-2 p-7">
          <div class="rounded-surface bg-surface-2 border border-edge p-4 shadow-overlay">
            <p class="text-sm text-ink">Overlay layer</p>
            <p class="text-xs text-ink-faint mt-0.5">modals, sheets</p>
          </div>
        </div>
      </DemoItem>
    </DemoSection>

    <!-- DEPTH IS LIGHTNESS — the dark-native ladder -->
    <section class="mb-12">
      <div class="mb-6 border-l-2 border-edge-strong pl-3">
        <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
          Depth is surface lightness (the dark-native cue)
        </h2>
      </div>
      <div class="pl-3.5 max-w-3xl">
        <div class="flex rounded-surface overflow-hidden border border-edge">
          <div
            v-for="s in surfaces"
            :key="s.var"
            class="flex-1 h-24 flex items-end p-2"
            :class="s.bg"
          >
            <span class="text-[0.65rem] font-mono text-ink-faint">{{ s.var }}</span>
          </div>
        </div>
        <p class="mt-3 text-xs font-mono text-ink-faint">
          on dark the primary depth cue is the surface-lightness step, not the shadow.
          the wrapper trick just lets the dark shadow add a second, honest cue on top.
        </p>
      </div>
    </section>

    <DemoSection title="Inset highlight — opt-in tactile top edge (use sparingly)" min="18rem">
      <DemoItem :label="highlight[0].label" :code="highlight[0].code">
        <div
          class="rounded-surface bg-surface-2 p-6 text-sm text-ink"
          :style="{ boxShadow: 'var(--inset-highlight)' }"
        >Inset highlight</div>
      </DemoItem>
      <DemoItem :label="highlight[1].label" :code="highlight[1].code">
        <div
          class="rounded-surface bg-surface-2 p-6 text-sm text-ink"
          :style="{ boxShadow: 'var(--inset-highlight), var(--shadow-overlay)' }"
        >Raised + highlit</div>
      </DemoItem>
    </DemoSection>

    <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        <code class="font-mono text-xs">--inset-highlight</code> is a 1px inner stroke on
        the TOP edge of a raised surface — the one slightly tactile cue, a hair of light.
        It's <strong class="text-ink">opt-in</strong>, not the default: flat fill + hairline
        + shadow already signify the layer. Reach for it only where a surface should feel a
        little physically proud (a primary card, a knob). Never on the page canvas or a
        floating overlay. There is no z-depth scale — three diffusion tiers are the whole
        vocabulary.
      </p>
    </div>
    </div>
  </DemoLayout>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'
import DemoLayout from '@demo/DemoLayout.vue'

const surfaces = [
  { var: 'surface-0', bg: 'bg-surface-0' },
  { var: 'surface-1', bg: 'bg-surface-1' },
  { var: 'surface-2', bg: 'bg-surface-2' },
  { var: 'surface-3', bg: 'bg-surface-3' },
]

// each tier is a FLAT layer (fill + hairline + shadow, NO highlight) in a
// surface-2 wrapper so the honest dark shadow is visible
const elevation = [
  {
    label: 'shadow-raise — buttons, cards, just off the surface',
    code: `<div class="rounded-surface bg-surface-2 p-7">
  <div class="rounded-surface bg-surface-2 border border-edge p-4 shadow-raise">
    <p class="text-sm text-ink">Raised layer</p>
    <p class="text-xs text-ink-faint mt-0.5">cards, controls</p>
  </div>
</div>`,
  },
  {
    label: 'shadow-float — menus, tooltips, popovers',
    code: `<div class="rounded-surface bg-surface-2 p-7">
  <div class="rounded-surface bg-surface-2 border border-edge p-4 shadow-float">
    <p class="text-sm text-ink">Floating layer</p>
    <p class="text-xs text-ink-faint mt-0.5">menus, tooltips</p>
  </div>
</div>`,
  },
  {
    label: 'shadow-overlay — modals, drawers, sheets',
    code: `<div class="rounded-surface bg-surface-2 p-7">
  <div class="rounded-surface bg-surface-2 border border-edge p-4 shadow-overlay">
    <p class="text-sm text-ink">Overlay layer</p>
    <p class="text-xs text-ink-faint mt-0.5">modals, sheets</p>
  </div>
</div>`,
  },
]

const highlight = [
  {
    label: '--inset-highlight alone — the faint top edge',
    code: `<div
  class="rounded-surface bg-surface-2 p-6 text-sm text-ink"
  :style="{ boxShadow: 'var(--inset-highlight)' }"
>Inset highlight</div>`,
  },
  {
    label: 'composed — highlight + overlay shadow (the tactile look)',
    code: `<div
  class="rounded-surface bg-surface-2 p-6 text-sm text-ink"
  :style="{ boxShadow: 'var(--inset-highlight), var(--shadow-overlay)' }"
>Raised + highlit</div>`,
  },
]
</script>
