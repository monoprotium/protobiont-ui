<template>
  <DemoSection title="Live — swapped for content by state" min="18rem">
    <DemoItem label="toggle the loading state">
      <div class="flex flex-col gap-3">
        <PrtToggle v-model="checked" label="loading" />
        <div v-if="checked" class="flex flex-col gap-2">
          <PrtSkeleton class="w-2/3" />
          <PrtSkeleton />
        </div>
        <p v-else class="text-sm text-ink-muted">Loaded — real content replaces the shimmer.</p>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Shapes — line is the default; block and circle are sized via class (layout)" min="12rem">
    <DemoItem label="line">
      <PrtSkeleton />
    </DemoItem>
    <DemoItem label="block — sized by class">
      <PrtSkeleton shape="block" class="h-16 w-full" />
    </DemoItem>
    <DemoItem label="circle — one dimension is enough">
      <div class="flex">
        <PrtSkeleton shape="circle" class="w-10" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Paragraph — stack lines, shorten the last" min="16rem">
    <DemoItem label="three lines">
      <div class="flex flex-col gap-2">
        <PrtSkeleton />
        <PrtSkeleton />
        <PrtSkeleton class="w-2/3" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Composition — shapes are consumer markup" min="20rem">
    <DemoItem label="a loading card">
      <div class="p-4 bg-surface-1 border border-edge rounded-surface flex items-start gap-3">
        <PrtSkeleton shape="circle" class="w-10" />
        <div class="flex-1 flex flex-col gap-2">
          <PrtSkeleton class="w-1/3" />
          <PrtSkeleton />
          <PrtSkeleton class="w-3/4" />
        </div>
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
</script>
