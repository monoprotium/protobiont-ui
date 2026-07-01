<template>
  <DemoSection title="Live — wired v-model" min="14rem">
    <DemoItem label="check and watch it echo">
      <div class="flex flex-col gap-2">
        <PrtCheckbox v-model="checked" label="Enable previews" />
        <span class="text-xs font-mono text-ink-faint">checked: {{ checked }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Basic" min="12rem">
    <DemoItem label="unchecked → click me">
      <PrtCheckbox v-model="checked" label="Enable previews" />
    </DemoItem>
    <DemoItem label="checked (static)">
      <PrtCheckbox :model-value="true" label="Checked" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — checked mark re-tints; unchecked stays quiet" min="20rem">
    <DemoItem label="identity (unseeded) + seeded row">
      <div class="flex flex-wrap gap-4">
        <PrtCheckbox :model-value="true" label="default" />
        <PrtCheckbox :model-value="true" seed="3" label="3" />
        <PrtCheckbox :model-value="true" seed="5" label="5" />
        <PrtCheckbox :model-value="true" seed="8" label="8" />
        <PrtCheckbox :model-value="true" seed="9" label="9" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges — rounded rides --radius-mark (3px), tighter than controls" min="12rem">
    <DemoItem label="rounded (default)">
      <PrtCheckbox :model-value="true" edges="rounded" label="rounded" />
    </DemoItem>
    <DemoItem label="square">
      <PrtCheckbox :model-value="true" edges="square" label="square" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="12rem">
    <DemoItem label="sm">
      <PrtCheckbox v-model="checked" size="sm" label="small" />
    </DemoItem>
    <DemoItem label="base">
      <PrtCheckbox v-model="checked" size="base" label="base" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtCheckbox v-model="checked" size="lg" label="large" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="12rem">
    <DemoItem label="disabled">
      <PrtCheckbox :model-value="true" disabled label="locked" />
    </DemoItem>
    <DemoItem label="error">
      <PrtCheckbox v-model="checked" error label="must be accepted" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Label via slot" min="16rem">
    <DemoItem label="default slot overrides the label prop">
      <PrtCheckbox v-model="checked">
        I accept the <span class="underline">terms</span>
      </PrtCheckbox>
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="19rem">
    <DemoItem label='slot usage with v-bind="inputProps"'>
      <PrtFormField label="Notifications" helper-text="Sent on deploy only.">
        <template #default="{ inputProps, error, disabled }">
          <PrtCheckbox
            v-model="checked"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
            label="Email me when a deploy finishes"
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
const checked = ref(false)
</script>
