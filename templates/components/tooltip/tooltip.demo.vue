<template>
  <DemoSection title="Basic — hover or focus the trigger; instant by design" min="12rem">
    <DemoItem label="on a button">
      <div class="flex"><PrtTooltip content="Duplicate project"><PrtBtn variant="outline">Hover me</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="on plain text">
      <span class="text-sm text-ink-muted">
        deployed <PrtTooltip content="2026-06-11 14:02 UTC"><span class="underline decoration-dotted cursor-help">2 hours ago</span></PrtTooltip>
      </span>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Placements — flip near viewport edges is free (position-try-fallbacks)" min="10rem">
    <DemoItem label="top (default)">
      <div class="flex"><PrtTooltip content="top"><PrtBtn variant="outline">top</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="bottom">
      <div class="flex"><PrtTooltip content="bottom" placement="bottom"><PrtBtn variant="outline">bottom</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="left">
      <div class="flex"><PrtTooltip content="left" placement="left"><PrtBtn variant="outline">left</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="right">
      <div class="flex"><PrtTooltip content="right" placement="right"><PrtBtn variant="outline">right</PrtBtn></PrtTooltip></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — the tooltip surface re-tints; triggers stay quiet" min="10rem">
    <DemoItem label="default (surface)">
      <div class="flex"><PrtTooltip content="quiet"><PrtBtn variant="outline">default</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="seed 7">
      <div class="flex"><PrtTooltip content="emerald" seed="7"><PrtBtn variant="outline">seed 7</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="seed 4">
      <div class="flex"><PrtTooltip content="violet" seed="4"><PrtBtn variant="outline">seed 4</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="seed 9">
      <div class="flex"><PrtTooltip content="amber" seed="9"><PrtBtn variant="outline">seed 9</PrtBtn></PrtTooltip></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Content slot — markup beats the prop" min="14rem">
    <DemoItem label="#content">
      <div class="flex">
        <PrtTooltip>
          <PrtBtn variant="outline">Shortcut</PrtBtn>
          <template #content>
            Save — <span class="font-mono text-ink-muted">⌘S</span>
          </template>
        </PrtTooltip>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Timing & states" min="12rem">
    <DemoItem label="opt-in delay (never the default)">
      <div class="flex"><PrtTooltip content="patient" :delay="400"><PrtBtn variant="outline">delay 400</PrtBtn></PrtTooltip></div>
    </DemoItem>
    <DemoItem label="disabled">
      <div class="flex"><PrtTooltip content="never shows" disabled><PrtBtn variant="outline" disabled>disabled</PrtBtn></PrtTooltip></div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
