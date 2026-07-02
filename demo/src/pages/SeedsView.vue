<template>
  <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">Seeds</h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        the rack · 10 pads · N ↔ N+5 are near-complements · 6/7 the identity pair
      </p>
    </div>

    <!-- derivation knobs: live tuning of the engine itself -->
    <div class="mb-8 bg-surface-1 border border-edge rounded-surface px-5 py-4">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs font-mono uppercase tracking-wider text-ink-faint">
          derivation knobs — live
        </p>
        <button
          type="button"
          class="text-xs font-mono text-ink-muted hover:text-ink px-2 py-0.5 rounded-control hover:bg-wash prt-motion-colors"
          @click="resetKnobs"
        >
          reset
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-3">
        <label v-for="k in knobs" :key="k.cssVar" class="flex flex-col gap-1">
          <span class="text-xs font-mono text-ink-muted flex justify-between gap-2">
            <span>{{ k.label }}</span>
            <span class="text-ink-faint tabular-nums">{{ values[k.cssVar] }}</span>
          </span>
          <PrtSlider
            v-model="values[k.cssVar]"
            :min="k.min"
            :max="k.max"
            :step="k.step"
            @update:model-value="touched.add(k.cssVar)"
          />
        </label>
      </div>
      <p class="mt-3 text-xs font-mono text-ink-faint">
        a moved knob re-declares its --derive-* variable on the rack below and every
        pad re-derives live — components never know. designed inks (pad 7 rides
        --accent-ink) ignore the ink knobs, by design. untouched knobs keep the
        mode's own defaults.
      </p>
    </div>

    <!-- complement pairs, side by side -->
    <div class="flex flex-col gap-6" :style="knobStyle">
      <div v-for="row in rows" :key="row.label" class="flex flex-col gap-2">
        <p class="text-xs font-mono uppercase tracking-wider text-ink-faint">
          {{ row.label }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="pad in row.pads"
            :key="pad.n"
            :data-seed="pad.n"
            class="bg-surface-1 border border-edge rounded-surface overflow-hidden"
          >
            <!-- the swatch IS a seeded surface: bg/ink come from the derivation -->
            <div
              class="h-20 px-5 flex items-end justify-between pb-3 bg-[var(--seed)] text-[var(--seed-ink)]"
            >
              <span class="font-mono text-2xl font-light">{{ pad.n }}</span>
              <span class="font-mono text-xs">{{ pad.name }}</span>
            </div>
            <div class="px-5 py-4 flex flex-wrap items-center gap-2">
              <PrtBtn size="sm">solid</PrtBtn>
              <PrtBtn size="sm" variant="outline">outline</PrtBtn>
              <PrtBtn size="sm" variant="ghost">ghost</PrtBtn>
              <code class="ml-auto text-xs font-mono text-ink-faint">seed="{{ pad.n }}"</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-8 text-xs font-mono text-ink-faint">
      buttons above carry no seed prop — they derive their tint from the card's
      data-seed through the cascade. that's the section-theming feature, demonstrated.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

interface Pad {
  n: string
  name: string
}

interface Knob {
  cssVar: string
  label: string
  min: number
  max: number
  step: number
  init: number
}

// init values mirror the :root knob defaults in tokens.css (dark mode)
const knobs: Knob[] = [
  { cssVar: '--derive-ink-dark', label: 'ink dark L', min: 0, max: 0.4, step: 0.01, init: 0.16 },
  { cssVar: '--derive-ink-light', label: 'ink light L', min: 0.6, max: 1, step: 0.01, init: 0.95 },
  { cssVar: '--derive-ink-chroma', label: 'ink chroma ×', min: 0, max: 1, step: 0.05, init: 0.3 },
  { cssVar: '--derive-hover-lift', label: 'hover lift ×', min: 0.7, max: 1.4, step: 0.01, init: 1.1 },
  { cssVar: '--derive-wash-alpha', label: 'wash alpha', min: 0, max: 0.5, step: 0.01, init: 0.14 },
]

const values = reactive<Record<string, number>>(
  Object.fromEntries(knobs.map((k) => [k.cssVar, k.init])),
)
// only knobs the user actually moved get re-declared — untouched ones keep
// the mode's own defaults (light mode flips --derive-hover-lift, for one)
const touched = reactive(new Set<string>())
const knobStyle = computed(() =>
  Object.fromEntries([...touched].map((cssVar) => [cssVar, String(values[cssVar])])),
)
function resetKnobs() {
  touched.clear()
  for (const k of knobs) values[k.cssVar] = k.init
}

const rows: { label: string; pads: Pad[] }[] = [
  {
    label: 'neutrals',
    pads: [
      { n: '1', name: 'graphite' },
      { n: '2', name: 'void' },
    ],
  },
  {
    label: 'identity pair',
    pads: [
      { n: '6', name: 'sea' },
      { n: '7', name: 'emerald — the identity' },
    ],
  },
  {
    label: 'complements · 3 ↔ 8',
    pads: [
      { n: '3', name: 'deep teal' },
      { n: '8', name: 'crimson' },
    ],
  },
  {
    label: 'complements · 4 ↔ 9',
    pads: [
      { n: '4', name: 'violet' },
      { n: '9', name: 'amber' },
    ],
  },
  {
    label: 'complements · 5 ↔ 10',
    pads: [
      { n: '5', name: 'magenta' },
      { n: '10', name: 'azure' },
    ],
  },
]
</script>
