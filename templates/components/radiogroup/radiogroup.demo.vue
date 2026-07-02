<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="pick and watch it echo">
      <div class="flex flex-col gap-2">
        <PrtRadioGroup
          v-model="choice"
          :options="[
            { value: 'hobby', label: 'Hobby' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">plan: {{ choice || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Basic" min="19rem">
    <DemoItem label="column (default)">
      <PrtRadioGroup
        v-model="picks.basic"
        :options="[
          { value: 'hobby', label: 'Hobby' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="With legend" min="19rem">
    <DemoItem label="label renders as the fieldset legend">
      <PrtRadioGroup
        v-model="picks.legend"
        label="Plan"
        :options="[
          { value: 'hobby', label: 'Hobby' },
          { value: 'pro', label: 'Pro' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — checked dot re-tints via the fieldset cascade" min="19rem">
    <DemoItem label='seed="5"'>
      <PrtRadioGroup
        v-model="picks.seed5"
        seed="5"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]"
      />
    </DemoItem>
    <DemoItem label='seed="9"'>
      <PrtRadioGroup
        v-model="picks.seed9"
        seed="9"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Inline" min="19rem">
    <DemoItem label="options in a row">
      <PrtRadioGroup
        v-model="picks.inline"
        inline
        :options="[
          { value: 's', label: 'Small' },
          { value: 'm', label: 'Medium' },
          { value: 'l', label: 'Large' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <PrtRadioGroup v-model="picks.sm" size="sm" inline
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtRadioGroup v-model="picks.lg" size="lg" inline
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="disabled group">
      <PrtRadioGroup :model-value="'a'" disabled label="Locked"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="disabled option">
      <PrtRadioGroup v-model="picks.soldOut" label="Beta is sold out"
        :options="[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta', disabled: true },
          { value: 'c', label: 'Gamma' },
        ]" />
    </DemoItem>
    <DemoItem label="error">
      <PrtRadioGroup v-model="picks.error" error label="Pick one"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Card variant — shipping / payment method cards (#meta slot)" min="19rem">
    <DemoItem label="shipping methods — delivery DATE not speed (Baymard), price in #meta">
      <PrtRadioGroup
        v-model="method"
        variant="card"
        label="Delivery"
        :options="[
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express' },
          { value: 'pickup', label: 'Store pickup' },
        ]"
      >
        <template #meta="{ option }">
          <span class="text-right">
            <span class="block text-sm tabular-nums text-ink">
              {{ option.value === 'standard' ? 'Free' : option.value === 'express' ? '€9.95' : 'Free' }}
            </span>
            <span class="block text-xs text-ink-faint">
              {{ option.value === 'standard' ? 'Arrives Thu, Jun 19' : option.value === 'express' ? 'Arrives Tue, Jun 17' : 'Ready today' }}
            </span>
          </span>
        </template>
      </PrtRadioGroup>
    </DemoItem>
    <DemoItem label='seed-tinted card (seed="7")'>
      <PrtRadioGroup
        v-model="picks.cardSeed"
        variant="card"
        seed="7"
        :options="[
          { value: 'standard', label: 'Standard', icon: 'i-lucide-truck' },
          { value: 'express', label: 'Express', icon: 'i-lucide-zap' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field — label-less wrapper pattern" min="19rem">
    <DemoItem label="group keeps its own legend; errors come from the field">
      <PrtFormField error error-message="Choose a plan to continue.">
        <template #default="{ inputProps, error }">
          <PrtRadioGroup
            v-model="picks.field"
            v-bind="inputProps"
            :error="error"
            label="Plan"
            :options="[
              { value: 'hobby', label: 'Hobby' },
              { value: 'pro', label: 'Pro' },
            ]"
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
const choice = ref<string | number>('')
const method = ref('standard')
// each showcase group gets its own key so they select independently
const picks = ref({
  basic: 'pro',
  legend: 'pro',
  inline: 'm',
  sm: 'a',
  lg: 'b',
  soldOut: 'a',
  error: 'a',
  cardSeed: 'express',
  field: 'hobby',
  seed5: 'b',
  seed9: 'a',
})
</script>
