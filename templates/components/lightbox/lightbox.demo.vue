<template>
  <DemoSection title="Default — centered & contained on the dimmed page (mixed ratios)" min="19rem">
    <DemoItem label="counter on; the page shows through dimmed — no empty black bands">
      <div>
        <PrtBtn @click="show = true">Open lightbox</PrtBtn>
        <PrtLightbox v-model:open="show" :items="[
            { src: 'https://picsum.photos/seed/lb-wide/1600/1066', thumb: 'https://picsum.photos/seed/lb-wide/200/133', alt: 'Coastal cliffs', caption: 'Coastal cliffs — 3:2' },
            { src: 'https://picsum.photos/seed/lb-tall/1200/1600', thumb: 'https://picsum.photos/seed/lb-tall/150/200', alt: 'Forest path', caption: 'Forest path — 3:4 portrait' },
            { src: 'https://picsum.photos/seed/lb-pano/1920/820', thumb: 'https://picsum.photos/seed/lb-pano/200/85', alt: 'Mountain panorama', caption: 'Mountain panorama — 21:9' },
            { src: 'https://picsum.photos/seed/lb-sq/1200/1200', thumb: 'https://picsum.photos/seed/lb-sq/160/160', alt: 'Harbour at night', caption: 'Harbour — 1:1' },
          ]" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="E-commerce — thumbnail rail + click-to-zoom" min="19rem">
    <DemoItem label="thumbs (bottom strip) + zoom: click the image to fill the viewport">
      <div>
        <PrtBtn @click="show = true">Open gallery</PrtBtn>
        <PrtLightbox v-model:open="show" thumbs zoom :items="[
            { src: 'https://picsum.photos/seed/lb-wide/1600/1066', thumb: 'https://picsum.photos/seed/lb-wide/200/133', alt: 'Coastal cliffs', caption: 'Coastal cliffs — 3:2' },
            { src: 'https://picsum.photos/seed/lb-tall/1200/1600', thumb: 'https://picsum.photos/seed/lb-tall/150/200', alt: 'Forest path', caption: 'Forest path — 3:4 portrait' },
            { src: 'https://picsum.photos/seed/lb-pano/1920/820', thumb: 'https://picsum.photos/seed/lb-pano/200/85', alt: 'Mountain panorama', caption: 'Mountain panorama — 21:9' },
            { src: 'https://picsum.photos/seed/lb-sq/1200/1200', thumb: 'https://picsum.photos/seed/lb-sq/160/160', alt: 'Harbour at night', caption: 'Harbour — 1:1' },
          ]" />
      </div>
    </DemoItem>
    <DemoItem label='side rail (thumbsPosition="side")'>
      <div>
        <PrtBtn variant="outline" @click="show = true">Open with side rail</PrtBtn>
        <PrtLightbox v-model:open="show" thumbs thumbs-position="side" zoom :items="[
            { src: 'https://picsum.photos/seed/lb-wide/1600/1066', thumb: 'https://picsum.photos/seed/lb-wide/200/133', alt: 'Coastal cliffs', caption: 'Coastal cliffs — 3:2' },
            { src: 'https://picsum.photos/seed/lb-tall/1200/1600', thumb: 'https://picsum.photos/seed/lb-tall/150/200', alt: 'Forest path', caption: 'Forest path — 3:4 portrait' },
            { src: 'https://picsum.photos/seed/lb-pano/1920/820', thumb: 'https://picsum.photos/seed/lb-pano/200/85', alt: 'Mountain panorama', caption: 'Mountain panorama — 21:9' },
            { src: 'https://picsum.photos/seed/lb-sq/1200/1200', thumb: 'https://picsum.photos/seed/lb-sq/160/160', alt: 'Harbour at night', caption: 'Harbour — 1:1' },
          ]" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Fullscreen — the immersive opt-in (photographer / art galleries)" min="19rem">
    <DemoItem label="fullscreen edge-to-edge on an opaque surface">
      <div>
        <PrtBtn @click="show = true">Open fullscreen</PrtBtn>
        <PrtLightbox v-model:open="show" fullscreen :items="[
            { src: 'https://picsum.photos/seed/lb-wide/1600/1066', thumb: 'https://picsum.photos/seed/lb-wide/200/133', alt: 'Coastal cliffs', caption: 'Coastal cliffs — 3:2' },
            { src: 'https://picsum.photos/seed/lb-tall/1200/1600', thumb: 'https://picsum.photos/seed/lb-tall/150/200', alt: 'Forest path', caption: 'Forest path — 3:4 portrait' },
            { src: 'https://picsum.photos/seed/lb-pano/1920/820', thumb: 'https://picsum.photos/seed/lb-pano/200/85', alt: 'Mountain panorama', caption: 'Mountain panorama — 21:9' },
            { src: 'https://picsum.photos/seed/lb-sq/1200/1200', thumb: 'https://picsum.photos/seed/lb-sq/160/160', alt: 'Harbour at night', caption: 'Harbour — 1:1' },
          ]" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Captions — opt-in (OFF by default; e-commerce stays clean)" min="19rem">
    <DemoItem label="captions — built-in bar from item.caption (portfolio style)">
      <div>
        <PrtBtn @click="show = true">Open with captions</PrtBtn>
        <PrtLightbox v-model:open="show" captions thumbs :items="[
            { src: 'https://picsum.photos/seed/lb-wide/1600/1066', thumb: 'https://picsum.photos/seed/lb-wide/200/133', alt: 'Coastal cliffs', caption: 'Coastal cliffs — 3:2' },
            { src: 'https://picsum.photos/seed/lb-tall/1200/1600', thumb: 'https://picsum.photos/seed/lb-tall/150/200', alt: 'Forest path', caption: 'Forest path — 3:4 portrait' },
            { src: 'https://picsum.photos/seed/lb-pano/1920/820', thumb: 'https://picsum.photos/seed/lb-pano/200/85', alt: 'Mountain panorama', caption: 'Mountain panorama — 21:9' },
            { src: 'https://picsum.photos/seed/lb-sq/1200/1200', thumb: 'https://picsum.photos/seed/lb-sq/160/160', alt: 'Harbour at night', caption: 'Harbour — 1:1' },
          ]" />
      </div>
    </DemoItem>
    <DemoItem label="#caption slot — your own markup (always renders)">
      <div>
        <PrtBtn variant="outline" @click="show = true">Open with rich caption</PrtBtn>
        <PrtLightbox v-model:open="show" thumbs :items="[
            { src: 'https://picsum.photos/seed/lb-wide/1600/1066', thumb: 'https://picsum.photos/seed/lb-wide/200/133', alt: 'Coastal cliffs', caption: 'Coastal cliffs — 3:2' },
            { src: 'https://picsum.photos/seed/lb-tall/1200/1600', thumb: 'https://picsum.photos/seed/lb-tall/150/200', alt: 'Forest path', caption: 'Forest path — 3:4 portrait' },
            { src: 'https://picsum.photos/seed/lb-pano/1920/820', thumb: 'https://picsum.photos/seed/lb-pano/200/85', alt: 'Mountain panorama', caption: 'Mountain panorama — 21:9' },
            { src: 'https://picsum.photos/seed/lb-sq/1200/1200', thumb: 'https://picsum.photos/seed/lb-sq/160/160', alt: 'Harbour at night', caption: 'Harbour — 1:1' },
          ]">
          <template #caption="{ item, index }">
            <span class="font-mono text-ink">{{ item.caption }}</span>
            <span class="text-ink-faint"> · {{ index + 1 }} of 4</span>
          </template>
        </PrtLightbox>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const show = ref(false)
</script>
