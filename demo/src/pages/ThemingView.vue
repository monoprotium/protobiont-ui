<template>
  <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Theming
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        reference · a theme is variable re-declaration, nothing else
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        Components contain references, never values — every visual decision reads a
        custom property from <code class="font-mono text-xs">tokens.css</code>.
        A theme is therefore just a set of re-declarations somewhere in the cascade:
        a file loaded after tokens.css (app-wide), a
        <code class="font-mono text-xs">[data-theme='x']</code> block (flip one
        attribute on <code class="font-mono text-xs">&lt;html&gt;</code>), or a
        wrapper — which is what the examples below do, so each one is a complete,
        self-contained theme scoped to its own div.
      </p>
      <p class="text-ink-faint text-xs font-mono">
        light mode is the existing proof: [data-mode='light'] IS a theme and no
        component knows. the examples here are deliberately crude — they
        demonstrate the mechanism, they are not designs.
      </p>
    </div>

    <DemoSection title="Same markup, three themes" min="19rem">
      <DemoItem :label="themes[0].label" :code="themes[0].code">
        <div class="p-4 rounded-surface bg-surface-0">
          <PrtCard variant="raised">
            <template #header>Deploy summary</template>
            Build finished in 42s. 0 warnings.
            <template #footer>
              <PrtBtn size="sm" seed="7">View logs</PrtBtn>
              <PrtBtn size="sm" variant="outline">Dismiss</PrtBtn>
            </template>
          </PrtCard>
        </div>
      </DemoItem>
      <DemoItem :label="themes[1].label" :code="themes[1].code">
        <div
          style="--radius-control: 0px; --radius-surface: 0px;
                 --shadow-raise: 5px 5px 0 0 #000;
                 --motion-duration: 0ms;
                 --surface-0: #f5f0e6; --surface-1: #fffbeb;
                 --surface-2: #fde68a; --surface-3: #fcd34d;
                 --ink: #18181b; --ink-muted: #3f3f46; --ink-faint: #52525b;
                 --edge: #18181b; --edge-strong: #18181b;
                 --wash: rgb(0 0 0 / 0.08);
                 --seed-7: #18181b; --seed-7-ink: #f5f0e6"
          class="p-4 bg-[var(--surface-0)]"
        >
          <PrtCard variant="raised">
            <template #header>Deploy summary</template>
            Build finished in 42s. 0 warnings.
            <template #footer>
              <PrtBtn size="sm" seed="7">View logs</PrtBtn>
              <PrtBtn size="sm" variant="outline">Dismiss</PrtBtn>
            </template>
          </PrtCard>
        </div>
      </DemoItem>
      <DemoItem :label="themes[2].label" :code="themes[2].code">
        <div
          style="--surface-1: #0a0f16; --surface-2: #0f1620; --surface-3: #17202e;
                 --ink: #e6f7ff; --ink-muted: #7fa8c0; --ink-faint: #4c6474;
                 --edge: rgb(45 212 255 / 0.22); --edge-strong: rgb(45 212 255 / 0.55);
                 --wash: rgb(45 212 255 / 0.10);
                 --accent: #2dd4ff;
                 --seed-7: oklch(78% 0.14 215); --seed-7-ink: initial;
                 --radius-surface: 0px; --radius-control: 0px;
                 --shadow-raise: 0 0 0 1px rgb(45 212 255 / 0.4), 0 0 24px rgb(45 212 255 / 0.16), 0 14px 44px rgb(0 0 0 / 0.6)"
          class="p-4"
        >
          <PrtCard variant="raised">
            <template #header>Deploy summary</template>
            Build finished in 42s. 0 warnings.
            <template #footer>
              <PrtBtn size="sm" seed="7">View logs</PrtBtn>
              <PrtBtn size="sm" variant="outline">Dismiss</PrtBtn>
            </template>
          </PrtCard>
        </div>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Rack swap — retune the rack" min="19rem">
      <DemoItem :label="rack[0].label" :code="rack[0].code">
        <div class="flex flex-wrap gap-2">
          <PrtBtn size="sm" seed="3">3</PrtBtn>
          <PrtBtn size="sm" seed="8">8</PrtBtn>
          <PrtBtn size="sm" seed="4">4</PrtBtn>
          <PrtBtn size="sm" seed="9">9</PrtBtn>
          <PrtBtn size="sm" seed="5">5</PrtBtn>
          <PrtBtn size="sm" seed="10">10</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="rack[1].label" :code="rack[1].code">
        <div
          style="--seed-3: oklch(80% 0.17 190); --seed-8: oklch(72% 0.21 10);
                 --seed-4: oklch(72% 0.24 310); --seed-9: oklch(85% 0.17 90);
                 --seed-5: oklch(74% 0.25 345); --seed-10: oklch(75% 0.16 230)"
          class="flex flex-wrap gap-2"
        >
          <PrtBtn size="sm" seed="3">3</PrtBtn>
          <PrtBtn size="sm" seed="8">8</PrtBtn>
          <PrtBtn size="sm" seed="4">4</PrtBtn>
          <PrtBtn size="sm" seed="9">9</PrtBtn>
          <PrtBtn size="sm" seed="5">5</PrtBtn>
          <PrtBtn size="sm" seed="10">10</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Derivation knobs — retune the engine, not the components" min="16rem">
      <DemoItem :label="knobs[0].label" :code="knobs[0].code">
        <div
          style="--derive-ink-chroma: 0; --derive-ink-dark: 0; --derive-ink-light: 1"
          class="flex flex-wrap gap-2"
        >
          <PrtBtn size="sm" seed="3">3</PrtBtn>
          <PrtBtn size="sm" seed="5">5</PrtBtn>
          <PrtBtn size="sm" seed="9">9</PrtBtn>
          <PrtBtn size="sm" seed="10">10</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="knobs[1].label" :code="knobs[1].code">
        <div
          style="--derive-ink-chroma: 0.6; --derive-wash-alpha: 0.3"
          class="flex flex-wrap gap-2"
        >
          <PrtBtn size="sm" seed="3">3</PrtBtn>
          <PrtBtn size="sm" seed="5">5</PrtBtn>
          <PrtBtn size="sm" variant="ghost" seed="5">ghost</PrtBtn>
          <PrtBtn size="sm" variant="ghost" seed="10">ghost</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="knobs[2].label" :code="knobs[2].code">
        <div style="--seed-3-ink: oklch(96% 0.05 199)" class="flex flex-wrap gap-2">
          <PrtBtn size="sm" seed="3">designed</PrtBtn>
          <PrtBtn size="sm" seed="8">derived</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        Everything above changed without touching a component: surfaces, ink,
        edges, radii, shadows, motion, seeds — and the derivation engine itself
        (<code class="font-mono text-xs">--derive-*</code> knobs, plus
        <code class="font-mono text-xs">--seed-N-ink</code> for a hand-designed
        ink on any single pad). A real theme would put exactly these
        declarations in a <code class="font-mono text-xs">[data-theme='…']</code>
        block. When reloading the rack, keep the tuning invariant: pads N and N+5
        reload as complement pairs, per mode. And a pad that carries a designed
        ink re-tunes <em>as a pair</em> — re-declare
        <code class="font-mono text-xs">--seed-7-ink</code> with it (brutalist
        does: cream), or release it back to the derivation engine with
        <code class="font-mono text-xs">--seed-7-ink: initial</code> (cyberpunk
        does) — otherwise the house's designed ink goes stale over your new pad.
      </p>
      <p class="text-ink-faint text-xs font-mono">
        one limitation: border width is baked at 1px (components use a literal
        `border`), so a thick-border theme needs --edge-w tokenized first.
        everything else is a pure variable swap.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

const inner = `
  <PrtCard variant="raised">
    <template #header>Deploy summary</template>
    Build finished in 42s. 0 warnings.
    <template #footer>
      <PrtBtn size="sm" seed="7">View logs</PrtBtn>
      <PrtBtn size="sm" variant="outline">Dismiss</PrtBtn>
    </template>
  </PrtCard>`

const themes = [
  {
    label: 'default (no overrides)',
    code: `<div class="p-4 rounded-surface bg-surface-0">${inner}
</div>`,
  },
  {
    label: 'brutalist-ish',
    code: `<div
  style="--radius-control: 0px; --radius-surface: 0px;
         --shadow-raise: 5px 5px 0 0 #000;
         --motion-duration: 0ms;
         --surface-0: #f5f0e6; --surface-1: #fffbeb;
         --surface-2: #fde68a; --surface-3: #fcd34d;
         --ink: #18181b; --ink-muted: #3f3f46; --ink-faint: #52525b;
         --edge: #18181b; --edge-strong: #18181b;
         --wash: rgb(0 0 0 / 0.08);
         --seed-7: #18181b; --seed-7-ink: #f5f0e6"
  class="p-4 bg-[var(--surface-0)]"
>${inner}
</div>`,
  },
  {
    label: 'cyberpunk-ish',
    code: `<div
  style="--surface-1: #0a0f16; --surface-2: #0f1620; --surface-3: #17202e;
         --ink: #e6f7ff; --ink-muted: #7fa8c0; --ink-faint: #4c6474;
         --edge: rgb(45 212 255 / 0.22); --edge-strong: rgb(45 212 255 / 0.55);
         --wash: rgb(45 212 255 / 0.10);
         --accent: #2dd4ff;
         --seed-7: oklch(78% 0.14 215); --seed-7-ink: initial;
         --radius-surface: 0px; --radius-control: 0px;
         --shadow-raise: 0 0 0 1px rgb(45 212 255 / 0.4),
           0 0 24px rgb(45 212 255 / 0.16), 0 14px 44px rgb(0 0 0 / 0.6)"
  class="p-4"
>${inner}
</div>`,
  },
]

const rack = [
  {
    label: 'house rack (tokens.css)',
    code: `<div class="flex flex-wrap gap-2">
  <PrtBtn size="sm" seed="3">3</PrtBtn>
  <PrtBtn size="sm" seed="8">8</PrtBtn>
  <PrtBtn size="sm" seed="4">4</PrtBtn>
  <PrtBtn size="sm" seed="9">9</PrtBtn>
  <PrtBtn size="sm" seed="5">5</PrtBtn>
  <PrtBtn size="sm" seed="10">10</PrtBtn>
</div>`,
  },
  {
    label: 'neon rack, same pairs',
    code: `<div
  style="--seed-3: oklch(80% 0.17 190); --seed-8: oklch(72% 0.21 10);
         --seed-4: oklch(72% 0.24 310); --seed-9: oklch(85% 0.17 90);
         --seed-5: oklch(74% 0.25 345); --seed-10: oklch(75% 0.16 230)"
  class="flex flex-wrap gap-2"
>
  <PrtBtn size="sm" seed="3">3</PrtBtn>
  <PrtBtn size="sm" seed="8">8</PrtBtn>
  <PrtBtn size="sm" seed="4">4</PrtBtn>
  <PrtBtn size="sm" seed="9">9</PrtBtn>
  <PrtBtn size="sm" seed="5">5</PrtBtn>
  <PrtBtn size="sm" seed="10">10</PrtBtn>
</div>`,
  },
]

const knobs = [
  {
    label: 'binary ink — the flat look, as a theme choice',
    code: `<div
  style="--derive-ink-chroma: 0; --derive-ink-dark: 0; --derive-ink-light: 1"
  class="flex flex-wrap gap-2"
>
  <PrtBtn size="sm" seed="3">3</PrtBtn>
  <PrtBtn size="sm" seed="5">5</PrtBtn>
  <PrtBtn size="sm" seed="9">9</PrtBtn>
  <PrtBtn size="sm" seed="10">10</PrtBtn>
</div>`,
  },
  {
    label: 'soft tint — deeper ink color, heavier wash',
    code: `<div
  style="--derive-ink-chroma: 0.6; --derive-wash-alpha: 0.3"
  class="flex flex-wrap gap-2"
>
  <PrtBtn size="sm" seed="3">3</PrtBtn>
  <PrtBtn size="sm" seed="5">5</PrtBtn>
  <PrtBtn size="sm" variant="ghost" seed="5">ghost</PrtBtn>
  <PrtBtn size="sm" variant="ghost" seed="10">ghost</PrtBtn>
</div>`,
  },
  {
    label: 'designed ink — hand-tune one pad, variable re-declaration only',
    code: `<div style="--seed-3-ink: oklch(96% 0.05 199)" class="flex flex-wrap gap-2">
  <PrtBtn size="sm" seed="3">designed</PrtBtn>
  <PrtBtn size="sm" seed="8">derived</PrtBtn>
</div>`,
  },
]
</script>
