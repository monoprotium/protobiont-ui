<template>
  <DemoSection title="Live — initials bound to state" min="16rem">
    <DemoItem label="type initials">
      <div class="flex items-center gap-3">
        <PrtInput v-model="value" placeholder="initials…" class="max-w-28" />
        <PrtAvatar :initials="value || 'AL'" seed="3" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Image — placeholder asset, never a random photo" min="14rem">
    <DemoItem label="src (swap in your real image)">
      <div class="flex"><PrtAvatar src="/avatar-placeholder.svg" alt="placeholder" /></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Initials × seeds — a stable seed per user makes a people row" min="20rem">
    <DemoItem label="people row">
      <div class="flex items-center gap-2">
        <PrtAvatar initials="AK" seed="3" />
        <PrtAvatar initials="MR" seed="5" />
        <PrtAvatar initials="JT" seed="7" />
        <PrtAvatar initials="LN" seed="9" />
        <PrtAvatar initials="DB" seed="10" />
      </div>
    </DemoItem>
    <DemoItem label="unseeded — quiet surface">
      <div class="flex"><PrtAvatar initials="ZK" /></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Fallback chain — broken src degrades to the pad, never a broken image" min="14rem">
    <DemoItem label="broken src → initials">
      <div class="flex"><PrtAvatar src="/nope.png" initials="AK" seed="4" /></div>
    </DemoItem>
    <DemoItem label="no initials → icon">
      <div class="flex"><PrtAvatar seed="6" /></div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes & edges — table row to profile page" min="24rem">
    <DemoItem label="sm / base / lg / xl / 2xl">
      <div class="flex items-center gap-2">
        <PrtAvatar initials="sm" size="sm" seed="5" />
        <PrtAvatar initials="ba" seed="5" />
        <PrtAvatar initials="lg" size="lg" seed="5" />
        <PrtAvatar initials="xl" size="xl" seed="5" />
        <PrtAvatar initials="2x" size="2xl" seed="5" />
      </div>
    </DemoItem>
    <DemoItem label="profile scale with image">
      <div class="flex"><PrtAvatar src="/avatar-placeholder.svg" size="2xl" alt="placeholder" /></div>
    </DemoItem>
    <DemoItem label="edges: rounded (default) / square / pill (opt-in)">
      <div class="flex items-center gap-2">
        <PrtAvatar initials="AK" seed="8" />
        <PrtAvatar initials="AK" edges="square" seed="8" />
        <PrtAvatar initials="AK" edges="pill" seed="8" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Group — overlap is consumer layout" min="16rem">
    <DemoItem label="-ml-2 stack — pill earns its keep here (overlap reads better round)">
      <div class="flex items-center">
        <PrtAvatar initials="AK" edges="pill" seed="3" />
        <PrtAvatar initials="MR" edges="pill" seed="5" class="-ml-2" />
        <PrtAvatar initials="JT" edges="pill" seed="7" class="-ml-2" />
        <PrtAvatar initials="+4" edges="pill" class="-ml-2" />
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
</script>
