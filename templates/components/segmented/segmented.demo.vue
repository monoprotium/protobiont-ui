<template>
  <DemoSection title="Single — pick exactly one (the size-selector pattern)" min="24rem">
    <DemoItem label="size picker — the live v-model value updates as you pick">
      <div class="flex flex-col items-start gap-2">
        <PrtSegmented
          v-model="choice"
          label="Size"
          seed="7"
          :options="[
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
            { value: 'xl', label: 'XL' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">v-model = {{ choice || '—' }}</span>
      </div>
    </DemoItem>
    <DemoItem label="view switch with icons (starts on grid)">
      <div class="flex flex-col items-start gap-2">
        <PrtSegmented
          v-model="view"
          seed="7"
          :options="[
            { value: 'grid', label: 'Grid', icon: 'i-lucide-layout-grid' },
            { value: 'list', label: 'List', icon: 'i-lucide-list' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">v-model = {{ view }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Multiple — pick several (a filter / format toolbar)" min="24rem">
    <DemoItem label='type="multiple" — v-model is an array (toggle each on/off)'>
      <div class="flex flex-col items-start gap-2">
        <PrtSegmented
          type="multiple"
          v-model="filters"
          seed="9"
          :options="[
            { value: 'reverb', label: 'Reverb' },
            { value: 'delay', label: 'Delay' },
            { value: 'drive', label: 'Drive' },
            { value: 'chorus', label: 'Chorus' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">v-model = [{{ filters.join(', ') }}]</span>
      </div>
    </DemoItem>
    <DemoItem label="icon-only formatting toolbar (multiple)">
      <div class="flex flex-col items-start gap-2">
        <PrtSegmented
          type="multiple"
          v-model="filters"
          seed="7"
          :options="[
            { value: 'bold', label: 'Bold', icon: 'i-lucide-bold' },
            { value: 'italic', label: 'Italic', icon: 'i-lucide-italic' },
            { value: 'underline', label: 'Underline', icon: 'i-lucide-underline' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">v-model = [{{ filters.join(', ') }}]</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes — sm / base / lg" min="20rem">
    <DemoItem label='size="sm"'>
      <PrtSegmented size="sm" v-model="choice" seed="7" :options="[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }, { value: 'c', label: 'Three' }]" />
    </DemoItem>
    <DemoItem label='size="base"'>
      <PrtSegmented size="base" v-model="choice" seed="7" :options="[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }, { value: 'c', label: 'Three' }]" />
    </DemoItem>
    <DemoItem label='size="lg"'>
      <PrtSegmented size="lg" v-model="choice" seed="7" :options="[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }, { value: 'c', label: 'Three' }]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Real-world — device picker" min="30rem">
    <DemoItem label="single select with icons — pick a device, value updates">
      <div class="flex flex-col items-start gap-2">
        <PrtSegmented
          v-model="choice"
          seed="7"
          :options="[
            { value: 'pc', label: 'PC', icon: 'i-lucide-monitor' },
            { value: 'laptop', label: 'Laptop', icon: 'i-lucide-laptop' },
            { value: 'tablet', label: 'Tablet', icon: 'i-lucide-tablet' },
            { value: 'phone', label: 'Phone', icon: 'i-lucide-smartphone' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">v-model = {{ choice || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const choice = ref<string | number>('')
const view = ref<'grid' | 'list'>('grid')
const filters = ref<string[]>([])
</script>
