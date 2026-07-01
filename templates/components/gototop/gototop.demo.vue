<template>
  <DemoSection title="Drop it in — reveals past the scroll threshold (scroll down to see it)" min="24rem">
    <DemoItem label="default bottom-right, low threshold so it shows here">
      <PrtGoToTop :threshold="120" seed="7" />
    </DemoItem>
    <DemoItem label="bottom-left placement">
      <PrtGoToTop :threshold="120" position="bottom-left" />
    </DemoItem>
  </DemoSection>

  <!-- filler so the page actually scrolls and the button has something to reveal over -->
  <section class="pl-3.5 max-w-2xl mb-12 flex flex-col gap-4">
    <p v-for="n in 24" :key="n" class="text-sm leading-relaxed text-ink-muted">
      <span class="font-mono text-ink-faint mr-2">{{ n }}.</span>{{ lorem }}
    </p>
  </section>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod ' +
  'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
  'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
  'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
  'cillum dolore eu fugiat nulla pariatur.'
</script>
