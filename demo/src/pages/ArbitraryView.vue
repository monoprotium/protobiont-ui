<template>
  <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Arbitrary seeds
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        reference · escape hatches · how derivation reacts to any value
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        The derivation engine is value-agnostic: ink, hover and wash are computed
        from <code class="text-ink font-mono text-xs">whatever --seed resolves to</code>
        — a pad, a hex, a devtools edit. The ink lands hue-tinted, never pure
        black/white, and the formulas themselves are tunable through the
        <code class="font-mono text-xs">--derive-*</code> knobs (see Theming).
        One rule makes it work:
      </p>
      <p class="text-ink">
        <span class="font-mono text-xs bg-surface-2 border border-edge rounded-control px-1.5 py-0.5">data-seed</span>
        and
        <span class="font-mono text-xs bg-surface-2 border border-edge rounded-control px-1.5 py-0.5">--seed</span>
        travel as a pair. The attribute is what triggers local derivation;
        the variable is the value it derives from.
      </p>
      <p class="text-ink-faint text-xs font-mono">
        the seed prop itself stays a closed 1–10 union — seed="#ff0055" is a type
        error, on purpose. arbitrary color enters through the CSS variable, never
        through the prop.
      </p>
    </div>

    <DemoSection title="One-off arbitrary color" min="16rem">
      <DemoItem :label="arbitrary[0].label" :code="arbitrary[0].code">
        <div data-seed style="--seed: oklch(70% 0.19 320)" class="flex flex-col gap-2">
          <PrtBtn>Derived orchid</PrtBtn>
          <PrtBtn variant="outline">Outline too</PrtBtn>
          <PrtBtn variant="ghost">Ghost wash</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="arbitrary[1].label" :code="arbitrary[1].code">
        <div data-seed style="--seed: #d97706" class="flex flex-col gap-2">
          <PrtBtn>From a hex</PrtBtn>
          <PrtBtn seed="10">Own seed wins</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Re-tune a pad for a subtree" min="16rem">
      <DemoItem :label="retune[0].label" :code="retune[0].code">
        <div style="--seed-3: oklch(65% 0.25 20)" class="flex flex-col gap-2">
          <PrtBtn seed="3">Pad 3, re-tuned</PrtBtn>
          <PrtBtn variant="outline" seed="3">Same override</PrtBtn>
        </div>
      </DemoItem>
      <DemoItem :label="retune[1].label" :code="retune[1].code">
        <div class="flex flex-col gap-2">
          <PrtBtn seed="3">Pad 3, stock</PrtBtn>
          <PrtBtn variant="outline" seed="3">Deep teal</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <DemoSection title="The failure mode (deliberately broken)" min="16rem">
      <DemoItem :label="broken[0].label" :code="broken[0].code">
        <div style="--seed: oklch(70% 0.19 320)" class="flex flex-col gap-2">
          <PrtBtn>Half-broken</PrtBtn>
        </div>
      </DemoItem>
    </DemoSection>

    <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        Above: the background picks the value up (the class chain reads
        <code class="font-mono text-xs">var(--seed, …)</code>) but ink/hover/wash
        never derive, because the
        <code class="font-mono text-xs">[data-seed]</code> block never matched.
        This is load-bearing CSS, not a bug: custom properties pass on
        <em>computed</em> values, so derivation must be re-triggered locally —
        that trigger is the attribute.
      </p>
      <p>
        Also free, no markup needed: edit any
        <code class="font-mono text-xs">--seed-N</code> in devtools and every
        patched component re-derives live — the design-in-browser knob. And an
        arbitrary value makes no tuning promise: pads guarantee a complement at
        +5, your orchid guarantees nothing. Escape hatch, not instrument.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

const arbitrary = [
  {
    label: 'wrapper: data-seed + --seed',
    code: `<div data-seed style="--seed: oklch(70% 0.19 320)" class="flex flex-col gap-2">
  <PrtBtn>Derived orchid</PrtBtn>
  <PrtBtn variant="outline">Outline too</PrtBtn>
  <PrtBtn variant="ghost">Ghost wash</PrtBtn>
</div>`,
  },
  {
    label: 'plain hex works the same · own seed beats the wrapper',
    code: `<div data-seed style="--seed: #d97706" class="flex flex-col gap-2">
  <PrtBtn>From a hex</PrtBtn>
  <PrtBtn seed="10">Own seed wins</PrtBtn>
</div>`,
  },
]

const retune = [
  {
    label: 'override --seed-3 in a subtree',
    code: `<div style="--seed-3: oklch(65% 0.25 20)" class="flex flex-col gap-2">
  <PrtBtn seed="3">Pad 3, re-tuned</PrtBtn>
  <PrtBtn variant="outline" seed="3">Same override</PrtBtn>
</div>`,
  },
  {
    label: 'untouched pad 3, for comparison',
    code: `<div class="flex flex-col gap-2">
  <PrtBtn seed="3">Pad 3, stock</PrtBtn>
  <PrtBtn variant="outline" seed="3">Deep teal</PrtBtn>
</div>`,
  },
]

const broken = [
  {
    label: '--seed without data-seed: bg only, ink/hover never derive',
    code: `<div style="--seed: oklch(70% 0.19 320)" class="flex flex-col gap-2">
  <PrtBtn>Half-broken</PrtBtn>
</div>`,
  },
]
</script>
