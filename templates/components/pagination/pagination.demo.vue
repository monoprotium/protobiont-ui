<template>
  <DemoSection title="Live — wired v-model:page" min="24rem">
    <DemoItem label="page through; the window slides around you">
      <div class="flex flex-col gap-2">
        <PrtPagination v-model:page="page" :total-pages="24" />
        <span class="text-xs font-mono text-ink-faint">page: {{ page }} / 24</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Few pages — no ellipsis needed" min="24rem">
    <DemoItem label="five pages render plainly">
      <PrtPagination v-model:page="page" :total-pages="5" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Window tuning" min="24rem">
    <DemoItem label="siblingCount=2 — a wider window">
      <PrtPagination v-model:page="page" :total-pages="40" :sibling-count="2" />
    </DemoItem>
    <DemoItem label="boundaryCount=2 — two pages pinned at each end">
      <PrtPagination v-model:page="page" :total-pages="40" :boundary-count="2" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="First/last edges" min="24rem">
    <DemoItem label="show-edges adds the double chevrons">
      <PrtPagination v-model:page="page" :total-pages="64" show-edges />
    </DemoItem>
    <DemoItem label="numbers only — no arrows at all">
      <PrtPagination v-model:page="page" :total-pages="12" :show-arrows="false" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Square edges & sizes" min="24rem">
    <DemoItem label='edges="square"'>
      <PrtPagination v-model:page="page" :total-pages="24" edges="square" />
    </DemoItem>
    <DemoItem label="sm">
      <PrtPagination v-model:page="page" :total-pages="24" size="sm" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtPagination v-model:page="page" :total-pages="24" size="lg" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Disabled" min="24rem">
    <DemoItem label="while the listing loads">
      <PrtPagination v-model:page="page" :total-pages="24" disabled />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const show = ref(false)
const page = ref(1)
</script>
