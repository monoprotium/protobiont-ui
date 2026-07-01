<template>
  <DemoSection title="Live — wired click handler">
    <DemoItem label="click and watch it count">
      <div class="flex">
        <PrtBtn @click="count++">Clicked {{ count }}×</PrtBtn>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — solid">
    <DemoItem label="default">
      <PrtBtn>Default</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 1">
      <PrtBtn seed="1">Seed 1</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 2">
      <PrtBtn seed="2">Seed 2</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 3">
      <PrtBtn seed="3">Seed 3</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 4">
      <PrtBtn seed="4">Seed 4</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 5">
      <PrtBtn seed="5">Seed 5</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 6">
      <PrtBtn seed="6">Seed 6</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 7">
      <PrtBtn seed="7">Seed 7</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 8">
      <PrtBtn seed="8">Seed 8</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 9">
      <PrtBtn seed="9">Seed 9</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 10">
      <PrtBtn seed="10">Seed 10</PrtBtn>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — outline">
    <DemoItem label="default">
      <PrtBtn variant="outline">Default</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 1">
      <PrtBtn variant="outline" seed="1">Seed 1</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 2">
      <PrtBtn variant="outline" seed="2">Seed 2</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 3">
      <PrtBtn variant="outline" seed="3">Seed 3</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 4">
      <PrtBtn variant="outline" seed="4">Seed 4</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 5">
      <PrtBtn variant="outline" seed="5">Seed 5</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 6">
      <PrtBtn variant="outline" seed="6">Seed 6</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 7">
      <PrtBtn variant="outline" seed="7">Seed 7</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 8">
      <PrtBtn variant="outline" seed="8">Seed 8</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 9">
      <PrtBtn variant="outline" seed="9">Seed 9</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 10">
      <PrtBtn variant="outline" seed="10">Seed 10</PrtBtn>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — ghost">
    <DemoItem label="default">
      <PrtBtn variant="ghost">Default</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 1">
      <PrtBtn variant="ghost" seed="1">Seed 1</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 2">
      <PrtBtn variant="ghost" seed="2">Seed 2</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 3">
      <PrtBtn variant="ghost" seed="3">Seed 3</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 4">
      <PrtBtn variant="ghost" seed="4">Seed 4</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 5">
      <PrtBtn variant="ghost" seed="5">Seed 5</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 6">
      <PrtBtn variant="ghost" seed="6">Seed 6</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 7">
      <PrtBtn variant="ghost" seed="7">Seed 7</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 8">
      <PrtBtn variant="ghost" seed="8">Seed 8</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 9">
      <PrtBtn variant="ghost" seed="9">Seed 9</PrtBtn>
    </DemoItem>
    <DemoItem label="seed 10">
      <PrtBtn variant="ghost" seed="10">Seed 10</PrtBtn>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Ink — who gets dark text, who gets light">
    <DemoItem label="light ink, derived — hue-tinted near-white, never pure #fff">
      <div class="flex flex-wrap gap-2">
        <PrtBtn seed="3">Teal</PrtBtn>
        <PrtBtn seed="4">Violet</PrtBtn>
        <PrtBtn seed="8">Crimson</PrtBtn>
        <PrtBtn seed="10">Azure</PrtBtn>
      </div>
    </DemoItem>
    <DemoItem label="dark ink, derived — amber is the blessed bright pad, both modes">
      <div class="flex flex-wrap gap-2">
        <PrtBtn seed="9">Amber</PrtBtn>
        <PrtBtn seed="9" variant="outline">Outline</PrtBtn>
      </div>
    </DemoItem>
    <DemoItem label="designed pair — pad 7 rides --accent-ink: deep emerald in dark mode, white in light">
      <div class="flex flex-wrap gap-2">
        <PrtBtn seed="7">Designed</PrtBtn>
        <PrtBtn seed="6">Derived sibling</PrtBtn>
      </div>
    </DemoItem>
    <DemoItem label="there is no ink prop — hand-design it per pad or per wrapper instead">
      <div data-seed style="--seed: #6d28d9; --seed-ink: #ede9fe" class="flex">
        <PrtBtn>Hand-designed ink</PrtBtn>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Cascade">
    <DemoItem label="derived seed">
      <div data-seed="4" class="flex flex-col gap-2">
        <PrtBtn>Derives violet</PrtBtn>
        <PrtBtn variant="outline">Me too</PrtBtn>
        <PrtBtn seed="9">Own seed wins</PrtBtn>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes">
    <DemoItem label="sm">
      <PrtBtn seed="7" size="sm">Small</PrtBtn>
    </DemoItem>
    <DemoItem label="base">
      <PrtBtn seed="7" size="base">Base</PrtBtn>
    </DemoItem>
    <DemoItem label="lg">
      <PrtBtn seed="7" size="lg">Large</PrtBtn>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges">
    <DemoItem label="square">
      <PrtBtn seed="7" edges="square">Square</PrtBtn>
    </DemoItem>
    <DemoItem label="rounded">
      <PrtBtn seed="7" edges="rounded">Rounded</PrtBtn>
    </DemoItem>
    <DemoItem label="pill">
      <PrtBtn seed="7" edges="pill">Pill</PrtBtn>
    </DemoItem>
  </DemoSection>

  <DemoSection title="States">
    <DemoItem label="loading">
      <PrtBtn seed="7" loading>Loading</PrtBtn>
    </DemoItem>
    <DemoItem label="disabled">
      <PrtBtn seed="7" disabled>Disabled</PrtBtn>
    </DemoItem>
    <DemoItem label="full width">
      <PrtBtn seed="7" full-width>Full width</PrtBtn>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Icons">
    <DemoItem label="prepend">
      <PrtBtn seed="7">
        <template #prepend><span class="i-lucide-plus" /></template>
        Create
      </PrtBtn>
    </DemoItem>
    <DemoItem label="append">
      <PrtBtn variant="outline">
        Settings
        <template #append><span class="i-lucide-settings" /></template>
      </PrtBtn>
    </DemoItem>
    <DemoItem label="as link">
      <PrtBtn tag="a" href="#" variant="ghost" seed="7">Open docs</PrtBtn>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const count = ref(0)
</script>
