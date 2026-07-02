<template>
  <!-- same two-column frame as ComponentView (/c/*): content + the Source panel,
       so the SYSTEM demo pages match the component pages and DemoItem's
       click-a-label → show-source interaction has somewhere to land. -->
  <div class="grid grid-cols-[minmax(0,1fr)_minmax(320px,26rem)]">
    <div class="min-w-0">
      <slot />
    </div>
    <SourcePanel />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import SourcePanel from './SourcePanel.vue'
import { clearSnippet } from './sourceStore'

// Reset on entry so the page's first DemoItem auto-fills the panel. MUST be
// onBeforeMount, not onMounted: this layout is an ancestor of the slotted
// DemoItems, whose own onMounted (showSnippetIfEmpty) fires BEFORE a parent's
// onMounted — clearing there would wipe what they just set.
onBeforeMount(() => clearSnippet())
</script>
