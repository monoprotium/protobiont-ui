<template>
  <div class="flex flex-col gap-2 min-w-0">
    <div class="demo-preview min-w-0">
      <slot />
    </div>
    <!-- 2025-style label: plain, unobtrusive text — the click target for source -->
    <span
      class="text-xs font-mono cursor-pointer select-none prt-motion-colors"
      :class="isActive ? 'text-accent' : 'text-ink-faint hover:text-ink-muted'"
      title="Show source"
      @click="select"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { activeSnippet, showSnippet, showSnippetIfEmpty } from './sourceStore'

// `code` is injected at build time by vite-plugin-demo-source from the slot's
// source text — authors write the slot markup only, never the `code` prop.
// The live render IS the compiled slot; `code` only feeds the source panel.
const props = defineProps<{ label: string; code?: string }>()

// imports auto-detected from the snippet — no authoring overhead
function detectImports(code: string): string[] {
  return [...new Set([...code.matchAll(/<(Prt[A-Z]\w*)/g)].map((m) => m[1]))]
}

const isActive = computed(() => activeSnippet.value?.code === props.code)

function snippet() {
  return {
    title: props.label,
    code: props.code ?? '',
    imports: detectImports(props.code ?? ''),
  }
}

function select() {
  showSnippet(snippet())
}

onMounted(() => {
  showSnippetIfEmpty(snippet())
})
</script>

<style scoped>
/* Cap, don't force. `max-width: 100%` lets block/flex components (cards, inputs,
   listings) fill the cell as before — their default width is already auto/100% —
   while inline-flex CONTROLS (segmented, tabs, chip, toggle, badge) hug their
   content instead of being stretched into a long rail. EXCLUDE fixed/floating
   widgets (gototop, fab) so they keep their own size, not the viewport's. */
.demo-preview > :deep(*:not([class~='fixed'])) {
  max-width: 100%;
}
</style>
