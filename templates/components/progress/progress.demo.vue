<template>
  <DemoSection title="Live — value bound to state" min="18rem">
    <DemoItem label="advance and reset">
      <div class="flex flex-col gap-3">
        <PrtProgress :value="count" show-value />
        <div class="flex gap-2">
          <PrtBtn size="sm" variant="outline" @click="count = Math.min(100, count + 10)">+10</PrtBtn>
          <PrtBtn size="sm" variant="ghost" @click="count = 0">reset</PrtBtn>
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Determinate" min="14rem">
    <DemoItem label="25">
      <PrtProgress :value="25" />
    </DemoItem>
    <DemoItem label="60">
      <PrtProgress :value="60" />
    </DemoItem>
    <DemoItem label="100">
      <PrtProgress :value="100" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Circle — % centered by default" min="22rem">
    <DemoItem label="values">
      <div class="flex flex-wrap items-center gap-4">
        <PrtProgress type="circle" :value="75" />
        <PrtProgress type="circle" :value="35" seed="4" />
        <PrtProgress type="circle" :value="56" seed="9" />
        <PrtProgress type="circle" :value="22" seed="2" />
      </div>
    </DemoItem>
    <DemoItem label="sizes">
      <div class="flex flex-wrap items-center gap-4">
        <PrtProgress type="circle" :value="59" size="sm" />
        <PrtProgress type="circle" :value="59" />
        <PrtProgress type="circle" :value="59" size="lg" />
      </div>
    </DemoItem>
    <DemoItem label='ring only — :show-value="false"'>
      <div class="flex"><PrtProgress type="circle" :value="80" :show-value="false" /></div>
    </DemoItem>
    <DemoItem label="live — bound to state">
      <div class="flex items-center gap-4">
        <PrtProgress type="circle" :value="count" />
        <PrtBtn size="sm" variant="outline" @click="count = Math.min(100, count + 10)">+10</PrtBtn>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes — hairline tracks, restraint over slabs" min="14rem">
    <DemoItem label="sm">
      <PrtProgress :value="60" size="sm" />
    </DemoItem>
    <DemoItem label="base">
      <PrtProgress :value="60" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtProgress :value="60" size="lg" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — identity accent by default" min="14rem">
    <DemoItem label="default (accent)">
      <PrtProgress :value="70" />
    </DemoItem>
    <DemoItem label="seed 4">
      <PrtProgress :value="70" seed="4" />
    </DemoItem>
    <DemoItem label="seed 9">
      <PrtProgress :value="70" seed="9" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Value label — tabular-nums, data numerals" min="14rem">
    <DemoItem label="show-value">
      <PrtProgress :value="42" show-value />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const count = ref(0)
const show = ref(false)
</script>
