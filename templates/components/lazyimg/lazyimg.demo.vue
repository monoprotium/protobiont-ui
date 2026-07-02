<template>
  <DemoSection title="Lazy in action — scroll the box; below-fold photos load on demand" min="36rem">
    <DemoItem label="sixteen real photos — skeleton holds the box, image fades in on load">
      <div class="h-96 overflow-y-auto rounded-surface border border-edge p-3">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <PrtLazyImg
            v-for="i in 16"
            :key="i"
            :src="'https://picsum.photos/seed/prt-' + i + '/600/450'"
            :alt="'Sample photo ' + i"
            aspect="4/3"
          />
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Blur-up vs skeleton — the placeholder you see WHILE it loads" min="19rem">
    <DemoItem label="blur-up — a tiny inline data: LQIP, sharpens on load">
      <PrtLazyImg
        src="https://picsum.photos/seed/prt-blur/800/600"
        alt="Coastal cliffs at dusk"
        aspect="4/3"
        placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12'%3E%3Crect width='16' height='12' fill='%23262626'/%3E%3Ccircle cx='5' cy='4' r='5' fill='%234b5563'/%3E%3Crect x='8' y='6' width='8' height='6' fill='%23374151'/%3E%3C/svg%3E"
      />
    </DemoItem>
    <DemoItem label="skeleton — no placeholder, seed-tinted shimmer until load">
      <PrtLazyImg seed="7" src="https://picsum.photos/seed/prt-skel/800/600" alt="Forest canopy" aspect="4/3" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Reserved box — `aspect` holds the space so nothing jumps as it loads" min="17rem">
    <DemoItem label='aspect="16/9"'>
      <PrtLazyImg src="https://picsum.photos/seed/prt-wide/960/540" alt="Mountain ridge" aspect="16/9" />
    </DemoItem>
    <DemoItem label='aspect="1/1"'>
      <PrtLazyImg src="https://picsum.photos/seed/prt-sq/600/600" alt="Harbour at night" aspect="1/1" />
    </DemoItem>
    <DemoItem label='fit="contain" — letterbox onto the surface (never black)'>
      <PrtLazyImg src="https://picsum.photos/seed/prt-tall/600/900" alt="Waterfall" aspect="16/9" fit="contain" seed="9" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Error & retry — a broken source falls to the quiet error state" min="18rem">
    <DemoItem label="default error state — i-lucide-image-off + retry">
      <PrtLazyImg src="https://example.invalid/missing.jpg" alt="Studio monitor render" aspect="4/3" />
    </DemoItem>
    <DemoItem label='rounded="none" — square corners'>
      <PrtLazyImg src="https://picsum.photos/seed/prt-square/600/450" alt="City skyline" aspect="4/3" rounded="none" />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
