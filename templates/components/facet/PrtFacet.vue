<!--
  PrtFacet
  The facet-section chrome a mixed filter rail repeats: header label (faint
  uppercase mono) + active count + clear affordance + collapsible body taking any
  control (PrtFilterBar, PrtSlider, PrtToggle, PrtCombobox…) — so a rail of mixed
  controls reads as one designed thing. The facet owns no filter value: `count` is
  passed in, `clear` is an emit the app handles (facet chrome here, filter
  semantics in the app).
  The collapsing body reuses PrtCollapsible's grid 0fr→1fr technique, not the
  component itself: the facet header carries a separate clear <button>, which can't
  legally nest inside the collapsible's trigger button — so the region markup is
  replicated, self-contained, with the same child-constraint rule.
  Slot contract:
    label   — replaces the header label text
    default — the facet body (any control)
-->
<template>
  <div :class="cx('w-full', props.class)">
    <div class="flex items-center gap-2">
      <component
        :is="collapsible ? 'button' : 'div'"
        :type="collapsible ? 'button' : undefined"
        :aria-expanded="collapsible ? open : undefined"
        :class="facetHeaderVariants({ collapsible })"
        @click="toggle"
      >
        <span class="truncate font-mono text-xs uppercase tracking-wider text-ink-muted">
          <slot name="label">{{ label }}</slot>
        </span>
        <span
          v-if="count != null && count > 0"
          class="font-mono text-xs text-accent tabular-nums"
        >
          {{ count }}
        </span>
      </component>
      <button
        v-if="clearable"
        type="button"
        :class="facetClearVariants({ hidden: !count })"
        @click="emit('clear')"
      >
        {{ clearLabel }}
      </button>
      <!-- chevron is the RIGHTMOST element so Clear lands just inside it
           (the sidebar-acceptable layout). A decorative duplicate of the
           header toggle: tabindex=-1 + aria-hidden — mouse users can click
           the chevron, keyboard/AT use the header button above. -->
      <button
        v-if="collapsible"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        class="shrink-0 bg-transparent text-ink-faint hover:text-ink prt-motion-colors"
        @click="toggle"
      >
        <span
          :class="['i-lucide-chevron-down prt-motion', open ? 'rotate-180' : '']"
          aria-hidden="true"
        />
      </button>
    </div>
    <div class="prt-facet-region" :data-open="open || !collapsible || undefined">
      <div class="prt-facet-inner">
        <div class="pt-3">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtFacetProps } from './types'
import { facetClearVariants, facetHeaderVariants } from './variants'

const props = withDefaults(defineProps<PrtFacetProps>(), {
  collapsible: true,
  defaultOpen: true,
  clearable: true,
  clearLabel: 'Clear',
  class: '',
})

const emit = defineEmits<{
  clear: []
}>()

const open = ref(props.defaultOpen)

function toggle() {
  if (!props.collapsible) return
  open.value = !open.value
}
</script>

<style scoped>
/* grid 0fr→1fr (PrtCollapsible's technique, replicated self-contained).
   overflow:hidden + min-height:0 MUST sit on the CHILD (trap registry). */
.prt-facet-region {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--motion-duration) var(--motion-ease);
}
.prt-facet-region[data-open] {
  grid-template-rows: 1fr;
}
.prt-facet-inner {
  overflow: hidden;
  min-height: 0;
}
</style>
