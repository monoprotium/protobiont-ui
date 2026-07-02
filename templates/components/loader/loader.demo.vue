<template>
  <DemoSection title="Live — shown while busy" min="16rem">
    <DemoItem label="toggle the busy state">
      <div class="flex flex-col gap-3">
        <PrtToggle v-model="checked" label="busy" />
        <div class="flex items-center gap-2 text-sm text-ink-muted">
          <PrtLoader v-if="checked" size="sm" />
          {{ checked ? 'fetching…' : 'idle' }}
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants — spinner (default) / dots / squares" min="16rem">
    <DemoItem label="the three loaders">
      <div class="flex items-center gap-6">
        <PrtLoader />
        <PrtLoader variant="dots" />
        <PrtLoader variant="squares" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes × variants" min="16rem">
    <DemoItem label="sm">
      <div class="flex items-center gap-6">
        <PrtLoader size="sm" />
        <PrtLoader variant="dots" size="sm" />
        <PrtLoader variant="squares" size="sm" />
      </div>
    </DemoItem>
    <DemoItem label="base">
      <div class="flex items-center gap-6">
        <PrtLoader />
        <PrtLoader variant="dots" />
        <PrtLoader variant="squares" />
      </div>
    </DemoItem>
    <DemoItem label="lg">
      <div class="flex items-center gap-6">
        <PrtLoader size="lg" />
        <PrtLoader variant="dots" size="lg" />
        <PrtLoader variant="squares" size="lg" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — quiet ink-muted by default, a deliberate pluck when seeded" min="24rem">
    <DemoItem label="default + the full rack">
      <div class="flex flex-wrap items-center gap-4">
        <PrtLoader />
        <PrtLoader seed="1" />
        <PrtLoader seed="2" />
        <PrtLoader seed="3" />
        <PrtLoader seed="4" />
        <PrtLoader seed="5" />
        <PrtLoader seed="6" />
        <PrtLoader seed="7" />
        <PrtLoader seed="8" />
        <PrtLoader seed="9" />
        <PrtLoader seed="10" />
      </div>
    </DemoItem>
    <DemoItem label="seeded trios">
      <div class="flex items-center gap-6">
        <PrtLoader variant="dots" seed="3" />
        <PrtLoader variant="squares" seed="7" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="In context — text rides consumer markup; visibility is consumer v-if" min="16rem">
    <DemoItem label="inline with text">
      <div class="flex items-center gap-2 text-sm text-ink-muted">
        <PrtLoader size="sm" />
        Loading projects…
      </div>
    </DemoItem>
    <DemoItem label="squares inline">
      <div class="flex items-center gap-2 text-sm text-ink-muted">
        <PrtLoader variant="squares" size="sm" />
        Building…
      </div>
    </DemoItem>
    <DemoItem label="derived from a seeded container">
      <div data-seed="6" class="flex items-center gap-2 text-sm text-ink-muted">
        <PrtLoader size="sm" />
        Syncing…
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
