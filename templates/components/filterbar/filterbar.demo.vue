<template>
  <DemoSection title="Live — array v-model, toggle semantics" min="19rem">
    <DemoItem label="the canonical sidebar facet — counts in the metadata register">
      <div class="flex flex-col gap-3">
        <PrtFilterBar
          v-model="filters"
          label="Category"
          :items="[
            { value: 'synths', label: 'Synths', count: 12 },
            { value: 'drums', label: 'Drum machines', count: 7 },
            { value: 'interfaces', label: 'Interfaces', count: 9 },
            { value: 'pedals', label: 'Pedals', count: 23 }
          ]"
        />
        <p class="font-mono text-xs text-ink-faint">selected: {{ filters }}</p>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Directions" min="19rem">
    <DemoItem label="vertical (default)">
      <PrtFilterBar
        v-model="filters"
        :items="[
          { value: 'open', label: 'Open' },
          { value: 'merged', label: 'Merged' },
          { value: 'draft', label: 'Draft' }
        ]"
      />
    </DemoItem>
    <DemoItem label="horizontal — a wrapping chip-row of checkboxes">
      <PrtFilterBar
        v-model="filters"
        direction="horizontal"
        :items="[
          { value: 'go', label: 'Go' },
          { value: 'vue', label: 'Vue' },
          { value: 'php', label: 'PHP' },
          { value: 'elixir', label: 'Elixir' }
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Header — label + the discoverable clear" min="19rem">
    <DemoItem label="clear appears (without reflow) once something is selected">
      <PrtFilterBar
        v-model="filters"
        label="Status"
        :items="[
          { value: 'active', label: 'Active', count: 31 },
          { value: 'paused', label: 'Paused', count: 4 },
          { value: 'archived', label: 'Archived', count: 118 }
        ]"
      />
    </DemoItem>
    <DemoItem label="show-clear=false — header label only">
      <PrtFilterBar
        v-model="filters"
        label="Region"
        :show-clear="false"
        :items="[
          { value: 'eu', label: 'eu-central' },
          { value: 'us', label: 'us-east' }
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Disabled — per item and whole bar" min="19rem">
    <DemoItem label="disabled item stays put; selectAll skips it">
      <PrtFilterBar
        v-model="filters"
        :items="[
          { value: 'standard', label: 'Standard tier' },
          { value: 'pro', label: 'Pro tier' },
          { value: 'enterprise', label: 'Enterprise tier', disabled: true }
        ]"
      />
    </DemoItem>
    <DemoItem label="whole bar disabled">
      <PrtFilterBar
        disabled
        :model-value="['standard']"
        :items="[
          { value: 'standard', label: 'Standard tier' },
          { value: 'pro', label: 'Pro tier' }
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="#item slot — custom label content" min="19rem">
    <DemoItem label="rich labels keep the checkbox wiring">
      <PrtFilterBar
        v-model="filters"
        :items="[
          { value: 'stable', label: 'stable' },
          { value: 'beta', label: 'beta' }
        ]"
      >
        <template #item="{ item }">
          <span class="font-mono text-xs uppercase tracking-wider">{{ item.label }}</span>
        </template>
      </PrtFilterBar>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const open = ref(true)
const filters = ref<string[]>([])
</script>
