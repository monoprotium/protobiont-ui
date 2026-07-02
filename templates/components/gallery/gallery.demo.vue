<template>
  <DemoSection title="Grid — uniform aspect, auto-fill; click a cell to open the lightbox" min="34rem">
    <DemoItem label="square cells, lightbox morph on click">
      <PrtGallery
        :items="[
          { src: '/geo-1.svg', alt: 'Pulse-8 synthesizer', caption: 'Pulse-8' },
          { src: '/geo-2.svg', alt: 'Route-X DanteBridge', caption: 'Route-X' },
          { src: '/geo-3.svg', alt: 'Grid-16 drum machine', caption: 'Grid-16' },
          { src: '/geo-4.svg', alt: 'Drift analog delay', caption: 'Drift' },
          { src: '/geo-6.svg', alt: 'Pocket sampler', caption: 'Pocket' },
          { src: '/geo-5.svg', alt: 'Studio monitor', caption: 'Monitor' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Masonry — varied heights via CSS columns (grid-lanes when it ships)" min="34rem">
    <DemoItem label="natural ratios pack into columns">
      <PrtGallery
        layout="masonry"
        item-min="11rem"
        :items="[
          { src: '/geo-5.svg', alt: 'Tall rack unit' },
          { src: '/geo-6.svg', alt: 'Wide console' },
          { src: '/geo-1.svg', alt: 'Pulse-8 synthesizer' },
          { src: '/geo-7.svg', alt: 'Channel strip' },
          { src: '/geo-2.svg', alt: 'Route-X DanteBridge' },
          { src: '/geo-3.svg', alt: 'Grid-16 drum machine' },
          { src: '/geo-6.svg', alt: 'Patchbay' },
          { src: '/geo-5.svg', alt: 'Mic preamp' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Selectable — a checkable overlay, array v-model (derive, no shadow state)" min="34rem">
    <DemoItem label="v-model:selected, seed tints the checked mark">
      <div class="flex flex-col gap-3">
        <PrtGallery
          selectable
          seed="7"
          :lightbox="false"
          v-model:selected="picked"
          item-min="10rem"
          :items="[
            { src: '/geo-1.svg', alt: 'Pulse-8 synthesizer' },
            { src: '/geo-2.svg', alt: 'Route-X DanteBridge' },
            { src: '/geo-3.svg', alt: 'Grid-16 drum machine' },
            { src: '/geo-4.svg', alt: 'Drift analog delay' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">selected indices: {{ picked.join(', ') || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Overlay slot — per-cell hover content" min="34rem">
    <DemoItem label="a caption strip that fades in on hover">
      <PrtGallery
        item-min="12rem"
        :items="[
          { src: '/geo-1.svg', alt: 'Pulse-8 synthesizer', caption: 'Pulse-8 desktop synth' },
          { src: '/geo-3.svg', alt: 'Grid-16 drum machine', caption: 'Grid-16 drum machine' },
          { src: '/geo-2.svg', alt: 'Route-X DanteBridge', caption: 'Route-X DanteBridge' },
        ]"
      >
        <template #overlay="{ item }">
          <div class="w-full bg-surface-1 border-t border-edge px-3 py-2 text-xs text-ink">
            {{ item.caption }}
          </div>
        </template>
      </PrtGallery>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const picked = ref<number[]>([])
</script>
