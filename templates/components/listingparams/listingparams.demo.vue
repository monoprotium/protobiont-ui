<template>
  <DemoSection title="Variants — zebra (default) and hairline" min="24rem">
    <DemoItem label="zebra — wash striping, surface-agnostic">
      <PrtListingParams :params="[
          { name: 'Voices', value: 8 },
          { name: 'Filter', value: 'Analog 4-pole lowpass' },
          { name: 'Oscillators per voice', value: 2 },
          { name: 'Keyboard', value: '37 keys, velocity + aftertouch' },
          { name: 'Weight', value: '4.2 kg' },
          { name: 'Power', value: 'USB-C PD, 15 W' }
        ]" />
    </DemoItem>
    <DemoItem label="hairline — row separators instead">
      <PrtListingParams variant="hairline" :params="[
          { name: 'Voices', value: 8 },
          { name: 'Filter', value: 'Analog 4-pole lowpass' },
          { name: 'Oscillators per voice', value: 2 },
          { name: 'Keyboard', value: '37 keys, velocity + aftertouch' },
          { name: 'Weight', value: '4.2 kg' },
          { name: 'Power', value: 'USB-C PD, 15 W' }
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="#value slot — chips, links, badges per row" min="24rem">
    <DemoItem label="the slot replaces any rich-value prop API">
      <PrtListingParams
        :params="[
          { name: 'Status', value: 'operational' },
          { name: 'Region', value: 'eu-central-1' },
          { name: 'Endpoint', value: 'api.example.dev' },
          { name: 'Uptime (90 d)', value: 99.98 }
        ]"
      >
        <template #value="{ param }">
          <PrtBadge v-if="param.name === 'Status'" intent="success">{{ param.value }}</PrtBadge>
          <a v-else-if="param.name === 'Endpoint'" href="#" class="text-accent underline underline-offset-2">{{ param.value }}</a>
          <template v-else>{{ param.value }}</template>
        </template>
      </PrtListingParams>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="24rem">
    <DemoItem label="sm — sidebar spec panels">
      <PrtListingParams
        size="sm"
        :params="[
          { name: 'Category', value: 'Synths' },
          { name: 'Price', value: '$549' },
          { name: 'SKU', value: 'PL8-100' }
        ]"
      />
    </DemoItem>
    <DemoItem label="lg — the spec page hero table">
      <PrtListingParams
        size="lg"
        variant="hairline"
        :params="[
          { name: 'Dimensions', value: '590 × 320 × 95 mm' },
          { name: 'Weight', value: '4.2 kg' },
          { name: 'Warranty', value: '3 years' }
        ]"
      />
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
