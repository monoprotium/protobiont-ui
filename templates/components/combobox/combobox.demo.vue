<template>
  <!-- Live section: the async recipe needs a watcher + fake fetch — direct
       render (not a DemoItem slot). The recipe IS the contract: listen to
       update:query, fetch, pass :options + :filter="false" + :loading. -->
  <DemoSection title="Live — async search (update:query → fetch)" min="24rem">
    <div class="flex flex-col gap-2 max-w-sm">
      <PrtCombobox
        v-model="pkg"
        :options="pkgOptions"
        :filter="false"
        :loading="pkgLoading"
        clearable
        placeholder="Search the registry…"
        @update:query="onPkgQuery"
      />
      <span class="text-xs font-mono text-ink-faint">picked: {{ pkg ?? '—' }}</span>
      <p class="text-xs font-mono text-ink-faint">
        @update:query="fetch" + :filter="false" + :loading — the consumer owns
        the request, the field owns the panel
      </p>
    </div>
  </DemoSection>

  <DemoSection title="Live — wired v-model (strict: emits only on selection)" min="19rem">
    <DemoItem label="type to filter, arrows + enter, watch it echo">
      <div class="flex flex-col gap-2">
        <PrtCombobox
          v-model="choice"
          placeholder="Assign to…"
          :options="[
            { value: 'mara', label: 'Mara Vogel' },
            { value: 'jonas', label: 'Jonas Brandt' },
            { value: 'ines', label: 'Ines Okafor' },
            { value: 'tomas', label: 'Tomas Lindqvist' },
            { value: 'aiko', label: 'Aiko Tanaka' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">assignee: {{ choice || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="freeText — the text IS the value (the autocomplete half)" min="19rem">
    <DemoItem label="emits on every keystroke; selecting just fills">
      <div class="flex flex-col gap-2">
        <PrtCombobox
          v-model="value"
          free-text
          clearable
          placeholder="Destination city…"
          :options="[
            { value: 'Lisbon', label: 'Lisbon' },
            { value: 'Ljubljana', label: 'Ljubljana' },
            { value: 'London', label: 'London' },
            { value: 'Luxembourg', label: 'Luxembourg' },
            { value: 'Lyon', label: 'Lyon' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">value: "{{ value }}"</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Typed values — numbers stay numbers" min="19rem">
    <DemoItem label="id-keyed entities: {{ choice }} is {{ typeof choice }}">
      <div class="flex flex-col gap-2">
        <PrtCombobox
          v-model="choice"
          placeholder="Customer account…"
          :options="[
            { value: 1042, label: 'Acme Fertigung GmbH' },
            { value: 1077, label: 'Borealis Logistics AB' },
            { value: 1103, label: 'Cardea Health BV' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">emitted: {{ choice }} ({{ typeof choice }})</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Option icons" min="19rem">
    <DemoItem label="icon per option, panel and all">
      <PrtCombobox
        v-model="choice"
        placeholder="Jump to…"
        :options="[
          { value: 'deploys', label: 'Deployments', icon: 'i-lucide-rocket' },
          { value: 'logs', label: 'Logs', icon: 'i-lucide-scroll-text' },
          { value: 'metrics', label: 'Metrics', icon: 'i-lucide-chart-line' },
          { value: 'alerts', label: 'Alerts', icon: 'i-lucide-siren' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Clearable" min="19rem">
    <DemoItem label="the × resets to null and keeps focus">
      <PrtCombobox
        v-model="choice"
        clearable
        placeholder="Billing country…"
        :options="[
          { value: 'de', label: 'Germany' },
          { value: 'nl', label: 'Netherlands' },
          { value: 'se', label: 'Sweden' },
          { value: 'pt', label: 'Portugal' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Large set — capped at maxVisible, tail invites typing" min="19rem">
    <DemoItem label="1000 rows, default cap 100 — no virtualization, recorded decision">
      <PrtCombobox
        v-model="choice"
        placeholder="Find a SKU…"
        :options="Array.from({ length: 1000 }, (_, i) => ({
          value: 'SKU-' + String(i + 1).padStart(4, '0'),
          label: 'SKU-' + String(i + 1).padStart(4, '0'),
        }))"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <PrtCombobox v-model="choice" size="sm" placeholder="small"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtCombobox v-model="choice" size="lg" placeholder="large"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants + edges" min="19rem">
    <DemoItem label="outline">
      <PrtCombobox v-model="choice" variant="outline" placeholder="outline"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtCombobox v-model="choice" variant="minimal" placeholder="minimal"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
    <DemoItem label="square">
      <PrtCombobox v-model="choice" edges="square" placeholder="square"
        :options="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="error">
      <PrtCombobox v-model="choice" error placeholder="unknown assignee"
        :options="[{ value: 'a', label: 'Alpha' }]" />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtCombobox disabled placeholder="locked"
        :options="[{ value: 'a', label: 'Alpha' }]" />
    </DemoItem>
    <DemoItem label="disabled option">
      <PrtCombobox v-model="choice" placeholder="Pick a plan…"
        :options="[
          { value: 'starter', label: 'Starter' },
          { value: 'scale', label: 'Scale (contact sales)', disabled: true },
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="19rem">
    <DemoItem label='slot usage with v-bind="inputProps" — blur reporting works (focus stays on the input)'>
      <PrtFormField label="Assignee" helper-text="Who owns the incident.">
        <template #default="{ inputProps, error, disabled }">
          <PrtCombobox
            v-model="choice"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
            placeholder="Assign to…"
            :options="[
              { value: 'mara', label: 'Mara Vogel' },
              { value: 'jonas', label: 'Jonas Brandt' },
            ]"
          />
        </template>
      </PrtFormField>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PrtOption } from '@ui/_shared/types'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// fake registry fetch — 600 ms latency, contains-match
const REGISTRY = [
  'vue',
  'vue-router',
  'pinia',
  'vite',
  'vitest',
  'unocss',
  'class-variance-authority',
  'clsx',
  'shiki',
  'valibot',
  'zod',
]
const pkg = ref<string | number | null>(null)
const pkgOptions = ref<PrtOption[]>(REGISTRY.map((n) => ({ value: n, label: n })))
const pkgLoading = ref(false)
let pkgTimer: ReturnType<typeof setTimeout> | undefined
function onPkgQuery(q: string) {
  pkgLoading.value = true
  clearTimeout(pkgTimer)
  pkgTimer = setTimeout(() => {
    pkgOptions.value = REGISTRY.filter((n) =>
      n.includes(q.trim().toLowerCase()),
    ).map((n) => ({ value: n, label: n }))
    pkgLoading.value = false
  }, 600)
}

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const choice = ref<string | number>('')
</script>
