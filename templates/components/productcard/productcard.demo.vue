<template>
  <DemoSection title="Live — favorite + add-to-cart wired" min="20rem">
    <DemoItem label="favorite is controlled; add-to-cart feeds a visible cart count">
      <div class="flex flex-col gap-3">
        <div class="relative self-end inline-flex h-8 w-8 items-center justify-center text-ink-muted">
          <span class="i-lucide-shopping-cart" />
          <PrtBadge :count="count" position="top-right" seed="7" />
        </div>
        <PrtProductCard
          :product="{
          id: 'sq-1',
          title: 'Pulse-8 desktop synth',
          description: '8-voice hybrid synth with per-voice analog filters and a 64-step sequencer.',
          price: '$549',
          image: '/geo-1.svg',
          rating: 4
        }"
          :favorite="checked"
          seed="7"
          @update:favorite="checked = $event"
          @add-to-cart="count += $event"
        />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Data-presence — omit a field, lose its section" min="20rem">
    <DemoItem label="minimal: title + price (no image, no rating, no description)">
      <PrtProductCard
        :product="{ id: 'cl-1', title: 'Clip studio limiter', price: '$179' }"
        :show-favorite="false"
      />
    </DemoItem>
    <DemoItem label="no rating, image present">
      <PrtProductCard
        :product="{ id: 'dr-1', title: 'Drift analog delay', description: 'BBD-style delay pedal with modulated repeats.', price: '$219', image: '/geo-4.svg' }"
        :show-favorite="false"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Slots replace sections" min="20rem">
    <DemoItem label="#meta and #actions overridden — a pre-order card">
      <PrtProductCard
        :product="{ id: 'rx-1', title: 'Route-X DanteBridge', description: '64-channel Dante-to-USB bridge for studio rigs.', price: '$799', image: '/geo-2.svg' }"
        :show-favorite="false"
      >
        <template #meta>
          <PrtBadge intent="info">Ships July 2026</PrtBadge>
        </template>
        <template #actions>
          <PrtBtn size="sm" variant="outline">Pre-order</PrtBtn>
        </template>
      </PrtProductCard>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeded accent" min="18rem">
    <DemoItem label='seed="7" — the identity emerald on the action'>
      <PrtProductCard seed="7" :show-favorite="false" :product="{ id: 'gr-1', title: 'Grid-16 drum machine', price: '$429', image: '/geo-3.svg', rating: 5 }" />
    </DemoItem>
    <DemoItem label='seed="9" — amber pluck'>
      <PrtProductCard seed="9" :show-favorite="false" :product="{ id: 'gr-2', title: 'Grid-8 pocket sampler', price: '$199', image: '/geo-3.svg', rating: 4 }" />
    </DemoItem>
    <DemoItem label="unseeded — quiet surface action">
      <PrtProductCard :show-favorite="false" :product="{ id: 'gr-3', title: 'Grid-32 performance pad', price: '$519', image: '/geo-3.svg', rating: 4 }" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a listing — the pairing payoff" min="40rem">
    <DemoItem label="productcard as the #item renderer of a PrtListing grid">
      <PrtListing
        item-min="14rem"
        :items="[
          { id: 'sq-1', title: 'Pulse-8 desktop synth', price: '$549', image: '/geo-1.svg', rating: 4 },
          { id: 'gr-1', title: 'Grid-16 drum machine', price: '$429', image: '/geo-3.svg', rating: 5 },
          { id: 'dr-1', title: 'Drift analog delay', price: '$219', image: '/geo-4.svg', rating: 4 }
        ]"
      >
        <template #item="{ item }">
          <PrtProductCard :product="item" :show-favorite="false" class="h-full" />
        </template>
      </PrtListing>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const checked = ref(false)
const count = ref(0)
const filters = ref<string[]>([])
</script>
