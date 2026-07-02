<template>
  <DemoSection title="Speed-dial — main button fans out actions (click to open)" min="28rem">
    <DemoItem label="fan up (default), seeded, square — scoped to the panel">
      <div class="relative h-64 overflow-hidden rounded-surface border border-edge bg-surface-2" style="contain: layout">
        <PrtFab
          seed="7"
          :actions="[
            { id: 'new-track', icon: 'i-lucide-music', label: 'New track' },
            { id: 'import', icon: 'i-lucide-upload', label: 'Import audio' },
            { id: 'record', icon: 'i-lucide-mic', label: 'Record' },
          ]"
          @action="(id) => { value = id }"
        />
      </div>
    </DemoItem>
    <DemoItem label='fan right, round FAB (edges="pill"), bottom-left'>
      <div class="relative h-64 overflow-hidden rounded-surface border border-edge bg-surface-2" style="contain: layout">
        <PrtFab
          edges="pill"
          direction="right"
          position="bottom-left"
          icon="i-lucide-share-2"
          :actions="[
            { id: 'link', icon: 'i-lucide-link', label: 'Copy link' },
            { id: 'mail', icon: 'i-lucide-mail', label: 'Email' },
            { id: 'export', icon: 'i-lucide-download', label: 'Export' },
          ]"
          @action="(id) => { value = id }"
        />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Last action" min="20rem">
    <DemoItem label="the emit carries the action id">
      <span class="text-sm font-mono text-ink-muted">last action: {{ value || '—' }}</span>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
</script>
