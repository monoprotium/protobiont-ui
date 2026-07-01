<template>
  <DemoSection title="Live — wired v-model" min="14rem">
    <DemoItem label="flip and watch it echo">
      <div class="flex flex-col gap-2">
        <PrtToggle v-model="checked" label="Auto-deploy" />
        <span class="text-xs font-mono text-ink-faint">{{ checked ? 'on — deploys on push' : 'off' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Basic" min="12rem">
    <DemoItem label="off → click me">
      <PrtToggle v-model="checked" label="Auto-deploy" />
    </DemoItem>
    <DemoItem label="on (static)">
      <PrtToggle :model-value="true" label="On" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — ON track re-tints; OFF stays quiet" min="20rem">
    <DemoItem label="identity (unseeded) + seeded row">
      <div class="flex flex-wrap gap-4">
        <PrtToggle :model-value="true" label="default" />
        <PrtToggle :model-value="true" seed="3" label="3" />
        <PrtToggle :model-value="true" seed="5" label="5" />
        <PrtToggle :model-value="true" seed="9" label="9" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="12rem">
    <DemoItem label="sm">
      <PrtToggle v-model="checked" size="sm" label="small" />
    </DemoItem>
    <DemoItem label="base">
      <PrtToggle v-model="checked" size="base" label="base" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtToggle v-model="checked" size="lg" label="large" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="12rem">
    <DemoItem label="disabled off">
      <PrtToggle disabled label="locked" />
    </DemoItem>
    <DemoItem label="disabled on">
      <PrtToggle :model-value="true" disabled label="locked" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Label via slot" min="16rem">
    <DemoItem label="default slot overrides the label prop">
      <PrtToggle v-model="checked">
        Maintenance mode <span class="text-ink-faint">(applies immediately)</span>
      </PrtToggle>
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="19rem">
    <DemoItem label='slot usage with v-bind="inputProps"'>
      <PrtFormField label="Visibility" helper-text="Public projects appear in search.">
        <template #default="{ inputProps, disabled }">
          <PrtToggle
            v-model="checked"
            v-bind="inputProps"
            :disabled="disabled"
            label="Public project"
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
