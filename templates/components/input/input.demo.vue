<template>
  <DemoSection title="Live — wired v-model" min="16rem">
    <DemoItem label="type and watch it echo">
      <div class="flex flex-col gap-2">
        <PrtInput v-model="value" placeholder="Type something…" />
        <span class="text-xs font-mono text-ink-faint">value: "{{ value }}"</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants" min="16rem">
    <DemoItem label="filled">
      <PrtInput v-model="ex.filled" placeholder="filled (default)" />
    </DemoItem>
    <DemoItem label="outline">
      <PrtInput v-model="ex.outline" variant="outline" placeholder="outline" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtInput v-model="ex.minimal" variant="minimal" placeholder="minimal" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="16rem">
    <DemoItem label="sm">
      <PrtInput v-model="ex.sm" size="sm" placeholder="small" />
    </DemoItem>
    <DemoItem label="base">
      <PrtInput v-model="ex.base" size="base" placeholder="base" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtInput v-model="ex.lg" size="lg" placeholder="large" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="16rem">
    <DemoItem label="error">
      <PrtInput model-value="invalid value" error />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtInput disabled placeholder="disabled" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges" min="16rem">
    <DemoItem label="square">
      <PrtInput v-model="ex.square" edges="square" placeholder="square" />
    </DemoItem>
    <DemoItem label="rounded (default)">
      <PrtInput v-model="ex.rounded" edges="rounded" placeholder="rounded" />
    </DemoItem>
    <DemoItem label="pill">
      <PrtInput v-model="ex.pill" edges="pill" placeholder="search…" />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
// each showcase input gets its own key so they type independently
const ex = ref<Record<string, string>>({ filled: '', outline: '', minimal: '', sm: '', base: '', lg: '', square: '', rounded: '', pill: '' })
</script>
