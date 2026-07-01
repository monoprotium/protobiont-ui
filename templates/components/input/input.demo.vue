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
      <PrtInput v-model="value" placeholder="filled (default)" />
    </DemoItem>
    <DemoItem label="outline">
      <PrtInput v-model="value" variant="outline" placeholder="outline" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtInput v-model="value" variant="minimal" placeholder="minimal" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="16rem">
    <DemoItem label="sm">
      <PrtInput v-model="value" size="sm" placeholder="small" />
    </DemoItem>
    <DemoItem label="base">
      <PrtInput v-model="value" size="base" placeholder="base" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtInput v-model="value" size="lg" placeholder="large" />
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
      <PrtInput v-model="value" edges="square" placeholder="square" />
    </DemoItem>
    <DemoItem label="rounded (default)">
      <PrtInput v-model="value" edges="rounded" placeholder="rounded" />
    </DemoItem>
    <DemoItem label="pill">
      <PrtInput v-model="value" edges="pill" placeholder="search…" />
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
