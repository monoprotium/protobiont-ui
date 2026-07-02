<!--
  PrtCard
  Slot contract:
    image   — full-bleed media at the top (no padding)
    header  — padded header row
    default — padded content
    footer  — padded footer row, hairline-separated
-->
<template>
  <div :class="cx(cardVariants({ variant, edges }), props.class)">
    <div v-if="$slots.image">
      <slot name="image" />
    </div>
    <div v-if="$slots.header" class="px-5 pt-4 pb-0 text-ink font-medium">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" class="px-5 py-4 text-ink-muted text-sm">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="px-5 py-3 border-t border-edge flex items-center gap-2"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtCardProps } from './types'
import { cardVariants } from './variants'

const props = withDefaults(defineProps<PrtCardProps>(), {
  variant: 'default',
  edges: 'rounded',
  class: '',
})
</script>
