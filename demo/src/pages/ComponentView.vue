<template>
  <div class="grid grid-cols-[minmax(0,1fr)_minmax(320px,26rem)]">
    <div class="px-8 py-8">
      <div class="mb-8 border-l-2 border-accent pl-4 flex items-baseline gap-4">
        <h1 class="text-2xl font-light tracking-tight text-ink">
          {{ entry?.name ?? folder }}
        </h1>
        <span class="text-xs font-mono text-ink-faint uppercase">{{ entry?.category }}</span>
        <button
          type="button"
          class="ml-auto inline-flex items-center gap-1.5 text-xs font-mono text-ink-faint hover:text-ink px-2 py-1 rounded-control hover:bg-wash prt-motion-colors prt-ring"
          @click="copyAdd"
        >
          <span :class="copied ? 'i-lucide-check text-accent' : 'i-lucide-terminal'" />
          prt add {{ entry?.name }}
        </button>
      </div>

      <div :class="folder === 'banner' ? 'max-w-none' : folder === 'list' ? 'max-w-5xl' : 'max-w-3xl'">
        <component :is="demo" v-if="demo" :key="folder" />
        <p v-else class="text-sm font-mono text-ink-faint">no demo for this component yet</p>
      </div>
    </div>

    <SourcePanel />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { gallery } from '../router'
import SourcePanel from '../shell/SourcePanel.vue'
import { clearSnippet } from '../shell/sourceStore'

const props = defineProps<{ folder: string }>()

const entry = computed(() => gallery.find((e) => e.folder === props.folder) ?? null)

const demo = computed(() =>
  entry.value?.demoLoader
    ? defineAsyncComponent(entry.value.demoLoader as () => Promise<never>)
    : null,
)

// switching components: reset the panel so the first section auto-fills it
watch(
  () => props.folder,
  () => clearSnippet(),
)

const copied = ref(false)
async function copyAdd() {
  if (!entry.value) return
  await navigator.clipboard.writeText(`prt add ${entry.value.name}`)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>
