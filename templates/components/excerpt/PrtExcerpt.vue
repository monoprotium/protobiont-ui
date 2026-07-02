<!--
  PrtExcerpt
  Visual line-clamp with a more/less reveal. Clamp uses the legacy
  -webkit-line-clamp combo (cross-browser); the unprefixed `line-clamp` isn't in
  Chrome yet. Toggle is an instant swap, avoiding per-frame text-geometry thrash.
  The line count rides a CSS variable, never a generated class.

  Slot contract:
    default — the text content
    toggle  — replace the more/less control (slot props { expanded, toggle })
  Model: v-model:expanded (boolean)
-->
<template>
  <div :data-seed="seed ?? undefined" :class="props.class">
    <div
      :class="collapsed ? (fade ? 'prt-excerpt prt-excerpt-fade' : 'prt-excerpt') : ''"
      :style="collapsed ? { '--prt-lines': String(lines) } : undefined"
    >
      <slot />
    </div>

    <template v-if="expandable">
      <slot name="toggle" :expanded="expanded" :toggle="toggle">
        <button
          type="button"
          :class="excerptToggleClass"
          :aria-expanded="expanded"
          @click="toggle"
        >
          {{ expanded ? lessLabel : moreLabel }}
          <span
            :class="expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PrtExcerptProps } from './types'
import { excerptToggleClass } from './variants'

const props = withDefaults(defineProps<PrtExcerptProps>(), {
  lines: 3,
  expandable: true,
  fade: false,
  moreLabel: 'Show more',
  lessLabel: 'Show less',
  class: '',
})

const expanded = defineModel<boolean>('expanded', { default: false })
const collapsed = computed(() => !expanded.value)

function toggle() {
  expanded.value = !expanded.value
}
</script>

<style scoped>
/* The legacy line-clamp combo — interop in both engines. The line count
   is the --prt-lines variable (set by a style binding). */
.prt-excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--prt-lines, 3);
  overflow: hidden;
}
/* optional soft fade at the clamp edge — `black` is a MASK alpha, not a color */
.prt-excerpt-fade {
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}
</style>
