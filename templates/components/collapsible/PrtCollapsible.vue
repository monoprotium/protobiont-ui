<!--
  PrtCollapsible
  Single-disclosure primitive: one trigger, one region, boolean v-model. Accordion
  behavior is composed by the consumer (v-for + own exclusivity state) — the
  primitive stays dumb on purpose.
  Animation: grid-template-rows 0fr→1fr (the cross-browser height-auto answer;
  `interpolate-size` isn't in Firefox). The single grid child carries
  overflow:hidden + min-height:0 — on the child, not the container.
  Not <details>-based: full styling control + the boolean v-model beat the free
  semantics.
  Slot contract:
    trigger — replaces the default label text (slot props: { open })
    default — the collapsing content
-->
<template>
  <div :class="cx('w-full', props.class)">
    <button
      type="button"
      :disabled="disabled"
      :aria-expanded="modelValue"
      :aria-controls="regionId"
      :class="collapsibleTriggerVariants({ size, edges, variant, disabled })"
      @click="toggle"
    >
      <span class="min-w-0 flex-1 truncate">
        <slot name="trigger" :open="modelValue">{{ label }}</slot>
      </span>
      <span
        :class="[
          'i-lucide-chevron-down shrink-0 text-ink-faint prt-motion',
          modelValue ? 'rotate-180' : '',
        ]"
        aria-hidden="true"
      />
    </button>
    <div
      :id="regionId"
      class="prt-collapsible-region"
      :data-open="modelValue || undefined"
    >
      <div class="prt-collapsible-inner">
        <div :class="collapsibleContentVariants({ size })">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtCollapsibleProps } from './types'
import { collapsibleContentVariants, collapsibleTriggerVariants } from './variants'

const props = withDefaults(defineProps<PrtCollapsibleProps>(), {
  label: '',
  variant: 'quiet',
  size: 'base',
  edges: 'square',
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [open: boolean]
}>()

// id context, not class construction
const regionId = `prt-clp-${useId()}`

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
/* the grid 0fr→1fr trick — the sanctioned <style> use (the transition +
   child constraint pairing isn't expressible as utility literals).
   overflow:hidden + min-height:0 MUST sit on the child. */
.prt-collapsible-region {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--motion-duration) var(--motion-ease);
}
.prt-collapsible-region[data-open] {
  grid-template-rows: 1fr;
}
.prt-collapsible-inner {
  overflow: hidden;
  min-height: 0;
}
</style>
