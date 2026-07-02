<template>
  <DemoSection title="Live — count + clear wired to app state" min="19rem">
    <DemoItem label="the app passes count and resets its own state on @clear">
      <PrtFacet label="Stack" :count="filters.length" @clear="filters = []">
        <PrtFilterBar
          v-model="filters"
          :items="[
            { value: 'go', label: 'Go', count: 14 },
            { value: 'vue', label: 'Vue', count: 22 },
            { value: 'elixir', label: 'Elixir', count: 5 }
          ]"
        />
      </PrtFacet>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Any control in the body — the chrome is control-agnostic" min="19rem">
    <DemoItem label="a toggle facet">
      <PrtFacet label="Availability" :count="checked ? 1 : 0" @clear="checked = false">
        <PrtToggle v-model="checked" label="In stock only" size="sm" />
      </PrtFacet>
    </DemoItem>
    <DemoItem label="a slider facet (price range)">
      <PrtFacet label="Price" :count="1" :clearable="false">
        <div class="px-1"><PrtSlider v-model="range" :min="0" :max="900" :step="10" /></div>
      </PrtFacet>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Disclosure" min="19rem">
    <DemoItem label="default-open=false — starts collapsed">
      <PrtFacet label="Advanced" :default-open="false" :clearable="false">
        <PrtFilterBar
          :model-value="[]"
          :items="[
            { value: 'archived', label: 'Include archived' },
            { value: 'forks', label: 'Include forks' }
          ]"
        />
      </PrtFacet>
    </DemoItem>
    <DemoItem label="collapsible=false — static section chrome">
      <PrtFacet label="Sort" :collapsible="false" :clearable="false">
        <PrtRadioGroup
          v-model="choice"
          :options="[
            { value: 'newest', label: 'Newest first' },
            { value: 'price', label: 'Price, low to high' }
          ]"
        />
      </PrtFacet>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Stacked — the rail rhythm" min="19rem">
    <DemoItem label="facets stack with consistent spacing; see /c/listing for the wired rail">
      <div class="flex w-56 flex-col gap-5">
        <PrtFacet label="Category" :count="filters.length" @clear="filters = []">
          <PrtFilterBar
            v-model="filters"
            :items="[
              { value: 'synths', label: 'Synths', count: 12 },
              { value: 'pedals', label: 'Pedals', count: 23 }
            ]"
          />
        </PrtFacet>
        <PrtFacet label="Availability" :count="checked ? 1 : 0" @clear="checked = false">
          <PrtToggle v-model="checked" label="In stock only" size="sm" />
        </PrtFacet>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const checked = ref(false)
const choice = ref<string | number>('')
const range = ref<[number, number]>([120, 480])
const filters = ref<string[]>([])
</script>
