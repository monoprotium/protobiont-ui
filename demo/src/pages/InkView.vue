<template>
  <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Ink
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        reference · text on color · derived, tinted, overridable — never a prop
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        There is no text-color prop anywhere in this kit. When a component gets a
        seed, its text color (<code class="font-mono text-xs">--seed-ink</code>)
        is <span class="text-ink">derived from the pad</span> in one central block
        in <code class="font-mono text-xs">tokens.css</code>: a polarity flip
        picks dark or light ink (pads lighter than L≈0.71 take dark ink), and the
        ink lands <span class="text-ink">hue-tinted</span> — a deep shade or a
        near-white of the pad's own hue, never pure
        <code class="font-mono text-xs">#000</code>/<code class="font-mono text-xs">#fff</code>.
        Tinted ink participates in the pad's color instead of punching a hole in it.
      </p>
      <p>
        Two override layers sit on top, both pure variable re-declaration:
        <code class="font-mono text-xs">--seed-N-ink</code> hand-designs the ink
        of one pad (the house does this once: pad 7 rides
        <code class="font-mono text-xs">--accent-ink</code>), and the
        <code class="font-mono text-xs">--derive-*</code> knobs retune the whole
        engine (see Theming, or the live sliders on Seeds).
      </p>
      <p class="text-ink-faint text-xs font-mono">
        why it's closed: a free text-color prop makes bad combos representable. ink is
        derived by default and designed where the eye overrules, measured by
        `bun run lint:rack` (an instrument, not a gate).
      </p>
    </div>

    <DemoSection title="The two ink families" min="19rem">
      <DemoItem :label="families[0].label" :code="families[0].code">
        <div class="flex flex-wrap gap-2">
          <PrtBtn seed="1">1</PrtBtn>
          <PrtBtn seed="2">2</PrtBtn>
          <PrtBtn seed="3">3</PrtBtn>
          <PrtBtn seed="4">4</PrtBtn>
          <PrtBtn seed="5">5</PrtBtn>
          <PrtBtn seed="6">6</PrtBtn>
          <PrtBtn seed="8">8</PrtBtn>
          <PrtBtn seed="10">10</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="families[1].label" :code="families[1].code">
        <div class="flex flex-wrap gap-2">
          <PrtBtn seed="9">Amber</PrtBtn>
          <PrtBtn seed="9" size="sm">Compact</PrtBtn>
          <PrtBtn seed="9" edges="pill">Pill</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Designed vs derived" min="16rem">
      <DemoItem :label="designed[0].label" :code="designed[0].code">
        <div class="flex flex-wrap gap-2">
          <PrtBtn seed="7">Designed</PrtBtn>
          <PrtBtn seed="6">Derived sibling</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="designed[1].label" :code="designed[1].code">
        <div style="--seed-8-ink: oklch(93% 0.06 27)" class="flex flex-wrap gap-2">
          <PrtBtn seed="8">Re-inked</PrtBtn>
          <PrtBtn seed="3">Untouched</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="designed[2].label" :code="designed[2].code">
        <div data-seed style="--seed: #6d28d9; --seed-ink: #ede9fe" class="flex">
          <PrtBtn>Hand-designed ink</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Modes — same markup, the rack shifts per mode" min="16rem">
      <DemoItem :label="modes[0].label" :code="modes[0].code">
        <div class="flex flex-wrap gap-2">
          <PrtBtn seed="5">Magenta</PrtBtn>
          <PrtBtn seed="7">Emerald</PrtBtn>
          <PrtBtn seed="9">Amber</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="modes[1].label" :code="modes[1].code">
        <div
          style="--derive-ink-chroma: 0; --derive-ink-dark: 0; --derive-ink-light: 1"
          class="flex flex-wrap gap-2"
        >
          <PrtBtn seed="5">Magenta</PrtBtn>
          <PrtBtn seed="9">Amber</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        Toggle the mode button (bottom of the sidebar) on this page: the rack
        shifts per mode — same hues, lightness shifted for the surround — and
        every ink re-derives. Derived ink polarity is mode-stable (amber is the
        one bright pad taking dark ink, in both modes). Pad 7's
        <em>designed</em> pair is the deliberate exception: deep-emerald-on-emerald
        in dark mode, white-on-emerald in light — designed values answer to the
        eye, not to the flip.
      </p>
      <p class="text-ink-faint text-xs font-mono">
        how to use, in full: pass seed, done. to re-ink one pad: declare
        --seed-N-ink anywhere in the cascade. to retune everything: the --derive-*
        knobs. for arbitrary colors: the data-seed + --seed pair rule (see
        Arbitrary seeds) — derivation, tint and overrides all work the same there.
        one trap: a pad that carries a designed ink re-tunes AS A PAIR — re-declare
        --seed-N-ink with the pad, or release it with --seed-N-ink: initial,
        or the stale designed ink sits on your new pad.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

const families = [
  {
    label: 'light ink — derived, hue-tinted near-white (pads below the flip point)',
    code: `<div class="flex flex-wrap gap-2">
  <PrtBtn seed="1">1</PrtBtn>
  <PrtBtn seed="2">2</PrtBtn>
  <PrtBtn seed="3">3</PrtBtn>
  <PrtBtn seed="4">4</PrtBtn>
  <PrtBtn seed="5">5</PrtBtn>
  <PrtBtn seed="6">6</PrtBtn>
  <PrtBtn seed="8">8</PrtBtn>
  <PrtBtn seed="10">10</PrtBtn>
</div>`,
  },
  {
    label: 'dark ink — derived, hue-tinted near-black: amber, the one bright pad',
    code: `<div class="flex flex-wrap gap-2">
  <PrtBtn seed="9">Amber</PrtBtn>
  <PrtBtn seed="9" size="sm">Compact</PrtBtn>
  <PrtBtn seed="9" edges="pill">Pill</PrtBtn>
</div>`,
  },
]

const designed = [
  {
    label: 'pad 7 — the designed pair (--seed-7-ink: var(--accent-ink))',
    code: `<div class="flex flex-wrap gap-2">
  <PrtBtn seed="7">Designed</PrtBtn>
  <PrtBtn seed="6">Derived sibling</PrtBtn>
</div>`,
  },
  {
    label: 'design any pad yourself — one variable, scoped to a wrapper',
    code: `<div style="--seed-8-ink: oklch(93% 0.06 27)" class="flex flex-wrap gap-2">
  <PrtBtn seed="8">Re-inked</PrtBtn>
  <PrtBtn seed="3">Untouched</PrtBtn>
</div>`,
  },
  {
    label: 'arbitrary color, hand-designed ink — the full escape hatch',
    code: `<div data-seed style="--seed: #6d28d9; --seed-ink: #ede9fe" class="flex">
  <PrtBtn>Hand-designed ink</PrtBtn>
</div>`,
  },
]

const modes = [
  {
    label: 'this exact markup re-inks itself when you toggle the mode',
    code: `<div class="flex flex-wrap gap-2">
  <PrtBtn seed="5">Magenta</PrtBtn>
  <PrtBtn seed="7">Emerald</PrtBtn>
  <PrtBtn seed="9">Amber</PrtBtn>
</div>`,
  },
  {
    label: 'binary ink — the flat look, three knobs, not an API',
    code: `<div
  style="--derive-ink-chroma: 0; --derive-ink-dark: 0; --derive-ink-light: 1"
  class="flex flex-wrap gap-2"
>
  <PrtBtn seed="5">Magenta</PrtBtn>
  <PrtBtn seed="9">Amber</PrtBtn>
</div>`,
  },
]
</script>
