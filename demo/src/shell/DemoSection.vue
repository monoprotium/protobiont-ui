<template>
  <!-- pure layout: uniform grid like the 2025 demo — visual rhythm only,
       all interactivity lives on each DemoItem's label. -->
  <section class="mb-12">
    <div class="mb-6 border-l-2 border-edge-strong pl-3">
      <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
        {{ title }}
      </h2>
    </div>
    <div
      class="pl-3.5 grid gap-x-5 gap-y-6"
      :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min ?? '10rem'}, 100%), 1fr))` }"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  /** min column width of the example grid (e.g. '20rem' for cards/inputs) */
  min?: string
}>()
</script>
