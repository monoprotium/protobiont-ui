<template>
  <DemoSection title="Live — wired v-model (re-click the current mark to clear)" min="18rem">
    <DemoItem label="click, arrow around, watch it echo">
      <div class="flex flex-col gap-2">
        <PrtRating v-model="count" />
        <span class="text-xs font-mono text-ink-faint">build quality: {{ count }}/5</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Star — the icon-prop opt-in" min="18rem">
    <DemoItem label='icon="i-lucide-star"'>
      <PrtRating v-model="count" icon="i-lucide-star" />
    </DemoItem>
    <DemoItem label="max 10, hearts — any icon class works">
      <PrtRating v-model="count" :max="10" icon="i-lucide-heart" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeded — fill rides the rack (default is accent)" min="18rem">
    <DemoItem label="seed 9">
      <PrtRating v-model="count" seed="9" />
    </DemoItem>
    <DemoItem label="seed 3, star">
      <PrtRating v-model="count" seed="3" icon="i-lucide-star" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Readonly display — full ink, no buttons" min="18rem">
    <DemoItem label="review average rounded to 4 (3.7 precise is a future question)">
      <PrtRating :model-value="4" readonly icon="i-lucide-star" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Behavior switches" min="18rem">
    <DemoItem label=':clearable="false" — re-click does nothing, arrows still never clear'>
      <PrtRating v-model="count" :clearable="false" />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtRating :model-value="3" disabled />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="18rem">
    <DemoItem label="sm">
      <PrtRating v-model="count" size="sm" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtRating v-model="count" size="lg" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="18rem">
    <DemoItem label="a number like any other; no error prop (immediate control, the toggle precedent) — errors render on the field">
      <PrtFormField label="Onboarding experience" helper-text="1 = rough, 5 = smooth.">
        <template #default="{ disabled }">
          <PrtRating v-model="count" :disabled="disabled" />
        </template>
      </PrtFormField>
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
