<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="step and watch it echo">
      <div class="flex flex-col gap-2">
        <PrtInputNumber v-model="num" :min="0" :max="10" placeholder="0–10" />
        <span class="text-xs font-mono text-ink-faint">num: {{ num === null ? 'null' : num }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Basic — the null contract, visible" min="19rem">
    <DemoItem label="empty is null, never 0">
      <div class="flex flex-col gap-2">
        <PrtInputNumber v-model="ex.basic" placeholder="type, clear, step" />
        <span class="text-xs font-mono text-ink-faint">
          modelValue: {{ ex.basic === null ? 'null' : ex.basic }} ({{ ex.basic === null ? 'object' : typeof ex.basic }})
        </span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Min / max / step — steppers clamp, typing never does" min="19rem">
    <DemoItem label="min 0 · max 10 · step 2">
      <PrtInputNumber v-model="ex.mm" :min="0" :max="10" :step="2" placeholder="0–10" />
    </DemoItem>
    <DemoItem label="step 0.5">
      <PrtInputNumber v-model="ex.half" :step="0.5" placeholder="halves" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants" min="19rem">
    <DemoItem label="filled">
      <PrtInputNumber v-model="ex.filled" placeholder="filled (default)" />
    </DemoItem>
    <DemoItem label="outline">
      <PrtInputNumber v-model="ex.outline" variant="outline" placeholder="outline" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtInputNumber v-model="ex.minimal" variant="minimal" placeholder="minimal" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <PrtInputNumber v-model="ex.sm" size="sm" placeholder="small" />
    </DemoItem>
    <DemoItem label="base">
      <PrtInputNumber v-model="ex.base" size="base" placeholder="base" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtInputNumber v-model="ex.lg" size="lg" placeholder="large" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges" min="19rem">
    <DemoItem label="square">
      <PrtInputNumber v-model="ex.square" edges="square" placeholder="square" />
    </DemoItem>
    <DemoItem label="rounded (default)">
      <PrtInputNumber v-model="ex.rounded" edges="rounded" placeholder="rounded" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Hide controls" min="19rem">
    <DemoItem label="plain number field — native ArrowUp/Down still works">
      <PrtInputNumber v-model="ex.hide" hide-controls placeholder="no steppers" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="error">
      <PrtInputNumber :model-value="999" error />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtInputNumber :model-value="42" disabled />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="19rem">
    <DemoItem label='slot usage with v-bind="inputProps"'>
      <PrtFormField label="Replicas" helper-text="Empty means auto.">
        <template #default="{ inputProps, error, disabled }">
          <PrtInputNumber
            v-model="ex.field"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
            :min="0"
            :max="64"
          />
        </template>
      </PrtFormField>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Recipe — price input (snippet, not a dedicated component)" min="19rem">
    <DemoItem label="step 0.01 + min 0 + a trailing currency code — pure composition">
      <PrtFormField label="Unit price" helper-text="Net, per seat.">
        <template #default="{ inputProps, error, disabled }">
          <div class="flex items-center gap-2">
            <PrtInputNumber
              v-model="ex.price"
              v-bind="inputProps"
              :error="error"
              :disabled="disabled"
              :min="0"
              :step="0.01"
              hide-controls
            />
            <span class="text-sm font-mono text-ink-faint">EUR</span>
          </div>
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
const num = ref<number | null>(null)
// each showcase field gets its own key so they step independently
const ex = ref<Record<string, number | null>>({ basic: null, mm: null, half: null, filled: null, outline: null, minimal: null, sm: null, base: null, lg: null, square: null, rounded: null, hide: null, field: null, price: null })
</script>
