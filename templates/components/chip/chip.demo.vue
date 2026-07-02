<template>
  <DemoSection title="Live — dismiss wired to state (the parent owns visibility)" min="16rem">
    <DemoItem label="dismiss, then restore">
      <div class="flex items-center">
        <PrtChip v-if="open" dismissible @dismiss="open = false">filter: drafts</PrtChip>
        <PrtBtn v-else size="sm" variant="ghost" @click="open = true">restore chip</PrtBtn>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants — same vocabulary as PrtBtn, chip-scaled" min="12rem">
    <DemoItem label="solid">
      <div class="flex"><PrtChip>refactor</PrtChip></div>
    </DemoItem>
    <DemoItem label="outline">
      <div class="flex"><PrtChip variant="outline">refactor</PrtChip></div>
    </DemoItem>
    <DemoItem label="ghost">
      <div class="flex"><PrtChip variant="ghost">refactor</PrtChip></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds × variants — closed matrix, seed drives all color" min="22rem">
    <DemoItem label="solid">
      <div class="flex flex-wrap gap-2">
        <PrtChip>none</PrtChip>
        <PrtChip seed="3">teal</PrtChip>
        <PrtChip seed="5">magenta</PrtChip>
        <PrtChip seed="7">emerald</PrtChip>
        <PrtChip seed="9">amber</PrtChip>
      </div>
    </DemoItem>
    <DemoItem label="outline">
      <div class="flex flex-wrap gap-2">
        <PrtChip variant="outline">none</PrtChip>
        <PrtChip variant="outline" seed="3">teal</PrtChip>
        <PrtChip variant="outline" seed="5">magenta</PrtChip>
        <PrtChip variant="outline" seed="7">emerald</PrtChip>
        <PrtChip variant="outline" seed="9">amber</PrtChip>
      </div>
    </DemoItem>
    <DemoItem label="ghost">
      <div class="flex flex-wrap gap-2">
        <PrtChip variant="ghost">none</PrtChip>
        <PrtChip variant="ghost" seed="3">teal</PrtChip>
        <PrtChip variant="ghost" seed="5">magenta</PrtChip>
        <PrtChip variant="ghost" seed="7">emerald</PrtChip>
        <PrtChip variant="ghost" seed="9">amber</PrtChip>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes & edges" min="14rem">
    <DemoItem label="sm / base / lg">
      <div class="flex items-center gap-2">
        <PrtChip size="sm" seed="6">sm</PrtChip>
        <PrtChip seed="6">base</PrtChip>
        <PrtChip size="lg" seed="6">lg</PrtChip>
      </div>
    </DemoItem>
    <DemoItem label="edges: rounded (default) / square / pill (opt-in — tag input boxes)">
      <div class="flex items-center gap-2">
        <PrtChip seed="10">rounded</PrtChip>
        <PrtChip edges="square" seed="10">square</PrtChip>
        <PrtChip edges="pill" seed="10">pill</PrtChip>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Icon & dismiss — × emits `dismiss`; the parent owns the list" min="14rem">
    <DemoItem label="leading icon">
      <div class="flex"><PrtChip icon="i-lucide-tag" seed="4">design</PrtChip></div>
    </DemoItem>
    <DemoItem label="dismissible">
      <div class="flex"><PrtChip dismissible seed="8">urgent</PrtChip></div>
    </DemoItem>
    <DemoItem label="disabled">
      <div class="flex"><PrtChip dismissible disabled>archived</PrtChip></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Derived from container — one data-seed themes the section" min="18rem">
    <DemoItem label='unseeded chips under data-seed="6"'>
      <div data-seed="6" class="flex flex-wrap gap-2 p-3 rounded-surface border border-edge">
        <PrtChip>alpha</PrtChip>
        <PrtChip>beta</PrtChip>
        <PrtChip variant="outline">gamma</PrtChip>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const open = ref(true)
</script>
