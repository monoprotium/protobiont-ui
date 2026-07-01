<template>
  <DemoSection title="Icon — the default (one button, click toggles dark⇄light)" min="20rem">
    <DemoItem label="the bare toggle — icon only, no text">
      <PrtModeToggle />
    </DemoItem>
    <DemoItem label="in a header bar — the glyph shows where a click goes">
      <div class="flex items-center justify-between gap-4 w-full px-4 py-2.5 rounded-surface border border-edge bg-surface-1">
        <span class="font-light tracking-[0.2em] uppercase text-ink text-sm">Protobiont</span>
        <PrtModeToggle />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Segmented — both states visible (settings panel)" min="20rem">
    <DemoItem label='presentation="segmented" — sun / moon'>
      <div class="flex flex-col items-start gap-2">
        <span class="text-xs font-mono uppercase tracking-wider text-ink-faint">Appearance</span>
        <PrtModeToggle presentation="segmented" />
      </div>
    </DemoItem>
    <DemoItem label="with a localized label override — Dark becomes Night">
      <PrtModeToggle presentation="segmented" :labels="{ dark: 'Night' }" />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
