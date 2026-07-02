<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="type and watch the count">
      <div class="flex flex-col gap-2">
        <PrtTextarea v-model="value" placeholder="Draft a release note…" />
        <span class="text-xs font-mono text-ink-faint">{{ value.length }} chars</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants" min="19rem">
    <DemoItem label="filled">
      <PrtTextarea v-model="texts.filled" placeholder="filled (default)" />
    </DemoItem>
    <DemoItem label="outline">
      <PrtTextarea v-model="texts.outline" variant="outline" placeholder="outline" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtTextarea v-model="texts.minimal" variant="minimal" placeholder="minimal" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <PrtTextarea v-model="texts.sm" size="sm" placeholder="small" />
    </DemoItem>
    <DemoItem label="base">
      <PrtTextarea v-model="texts.base" size="base" placeholder="base" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtTextarea v-model="texts.lg" size="lg" placeholder="large" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="error">
      <PrtTextarea model-value="invalid value" error />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtTextarea disabled placeholder="disabled" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges" min="19rem">
    <DemoItem label="square">
      <PrtTextarea v-model="texts.square" edges="square" :rows="2" placeholder="square" />
    </DemoItem>
    <DemoItem label="rounded (default)">
      <PrtTextarea v-model="texts.rounded" edges="rounded" :rows="2" placeholder="rounded" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Rows — initial height; resize-y lets the user drag beyond it" min="19rem">
    <DemoItem label="rows = 2">
      <PrtTextarea v-model="texts.r2" :rows="2" placeholder="two rows" />
    </DemoItem>
    <DemoItem label="rows = 8">
      <PrtTextarea v-model="texts.r8" :rows="8" placeholder="eight rows" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="19rem">
    <DemoItem label='slot usage with v-bind="inputProps"'>
      <PrtFormField v-model="texts.field" label="Description" helper-text="Markdown allowed.">
        <template #default="{ inputProps, error, disabled }">
          <PrtTextarea
            v-model="texts.field"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
            placeholder="What is this project about?"
          />
        </template>
      </PrtFormField>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
// each showcase textarea gets its own key so they type independently
const texts = ref({ filled: '', outline: '', minimal: '', sm: '', base: '', lg: '', square: '', rounded: '', r2: '', r8: '', field: '' })
</script>
