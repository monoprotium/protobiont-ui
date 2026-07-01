<!--
  PrtModeToggle
  Wires useMode() (two states: light / dark — no 'system') into a control. It
  mutates data-mode directly — no inject, no shadow state.

  presentation:
    'icon'      (default) — one icon button; click toggles dark⇄light. The glyph
                shows where a click goes (sun in dark mode → light, moon in light
                mode → dark).
    'segmented' — sun / moon both visible at once, click to pin.

  First paint: the shared <head> boot snippet (starters/_boot) sets data-mode
  before paint. useMode only reconciles after mount, so it's never the FOUC source.

  Slot contract: none.  emits: none (mutates the global mode singleton).
-->
<template>
  <PrtSegmented
    v-if="presentation === 'segmented'"
    type="single"
    :options="options"
    :model-value="mode"
    :size="size"
    :label="ariaLabel"
    @update:model-value="(v) => setMode(v as PrtMode)"
  />
  <button
    v-else
    type="button"
    :aria-label="toggleLabel"
    :class="modeToggleTriggerClass"
    @click="toggle"
  >
    <span :class="triggerIcon" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PrtOption } from '../_shared/types'
import { type PrtMode, useMode } from '../_shared/useMode'
import PrtSegmented from '../segmented/PrtSegmented.vue'
import type { PrtModeToggleProps } from './types'
import { modeToggleTriggerClass } from './variants'

const props = withDefaults(defineProps<PrtModeToggleProps>(), {
  presentation: 'icon',
  ariaLabel: 'Color mode',
  size: 'base',
})

const { mode, setMode, toggle, modeOptions } = useMode()

// apply label overrides over the composable's English defaults
const options = computed<PrtOption[]>(() =>
  modeOptions.map((o) => ({
    value: o.value,
    label: props.labels?.[o.value] ?? o.label,
    icon: o.icon,
  })),
)

// the icon trigger shows the glyph of the mode a click will SWITCH TO
const triggerIcon = computed(() => (mode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'))
const toggleLabel = computed(() =>
  mode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
)
</script>
