<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="pick and watch it echo">
      <div class="flex flex-col gap-2">
        <PrtSelect
          v-model="choice"
          placeholder="Pick a region…"
          :options="[
            { value: 'eu', label: 'Europe' },
            { value: 'us', label: 'United States' },
            { value: 'ap', label: 'Asia Pacific' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">choice: {{ choice || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Basic" min="19rem">
    <DemoItem label="with placeholder (null until picked)">
      <PrtSelect
        v-model="choice"
        placeholder="Pick a region…"
        :options="[
          { value: 'eu', label: 'Europe' },
          { value: 'us', label: 'United States' },
          { value: 'ap', label: 'Asia Pacific' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants" min="19rem">
    <DemoItem label="filled">
      <PrtSelect v-model="choice" placeholder="filled (default)"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="outline">
      <PrtSelect v-model="choice" variant="outline" placeholder="outline"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtSelect v-model="choice" variant="minimal" placeholder="minimal"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <PrtSelect v-model="choice" size="sm" placeholder="small"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtSelect v-model="choice" size="lg" placeholder="large"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges" min="19rem">
    <DemoItem label="square">
      <PrtSelect v-model="choice" edges="square" placeholder="square"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="rounded (default)">
      <PrtSelect v-model="choice" edges="rounded" placeholder="rounded"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Option icons — the panel is ours, so they render" min="19rem">
    <DemoItem label="icon per option (shown on the trigger too)">
      <PrtSelect
        v-model="choice"
        placeholder="Pick an environment…"
        :options="[
          { value: 'dev', label: 'Development', icon: 'i-lucide-flask-conical' },
          { value: 'stage', label: 'Staging', icon: 'i-lucide-git-branch' },
          { value: 'prod', label: 'Production', icon: 'i-lucide-rocket' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Long list — panel scrolls, flips when out of room" min="19rem">
    <DemoItem label="max-height + overflow; keyboard keeps the active row in view">
      <PrtSelect
        v-model="choice"
        placeholder="Pick a port…"
        :options="Array.from({ length: 24 }, (_, i) => ({
          value: 3000 + i, label: 'Port ' + (3000 + i),
        }))"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Number values — typed emit" min="19rem">
    <DemoItem label="numbers stay numbers: {{ choice }} is {{ typeof choice }}">
      <div class="flex flex-col gap-2">
        <PrtSelect
          v-model="choice"
          placeholder="Pick a port…"
          :options="[
            { value: 3000, label: '3000 (dev)' },
            { value: 8080, label: '8080 (http-alt)' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">emitted: {{ choice }} ({{ typeof choice }})</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="error">
      <PrtSelect v-model="choice" error placeholder="invalid choice"
        :options="[{ value: 'a', label: 'Alpha' }]" />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtSelect disabled placeholder="locked"
        :options="[{ value: 'a', label: 'Alpha' }]" />
    </DemoItem>
    <DemoItem label="disabled option">
      <PrtSelect v-model="choice" placeholder="Beta is sold out"
        :options="[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta (sold out)', disabled: true },
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="19rem">
    <DemoItem label='slot usage with v-bind="inputProps"'>
      <PrtFormField label="Region" helper-text="Where the app deploys.">
        <template #default="{ inputProps, error, disabled }">
          <PrtSelect
            v-model="choice"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
            placeholder="Pick a region…"
            :options="[
              { value: 'eu', label: 'Europe' },
              { value: 'us', label: 'United States' },
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
const choice = ref<string | number>('')
</script>
