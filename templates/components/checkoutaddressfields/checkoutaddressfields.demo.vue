<template>
  <DemoSection title="Shipping address — drop-in (free-text country/region)" min="26rem">
    <DemoItem label="v-model is a flat address object — type and watch it fill">
      <div class="max-w-md flex flex-col gap-3">
        <PrtCheckoutAddressFields v-model="address" mode="shipping" />
        <pre class="text-xs font-mono text-ink-faint">{{ address }}</pre>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="With a region combobox (country provided)" min="26rem">
    <DemoItem label="regionOptions swaps the State field for a searchable combobox">
      <div class="max-w-md">
        <PrtCheckoutAddressFields
          v-model="address"
          mode="shipping"
          :region-options="[
            { value: 'CA', label: 'California' },
            { value: 'NY', label: 'New York' },
            { value: 'TX', label: 'Texas' },
            { value: 'WA', label: 'Washington' },
          ]"
        />
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const address = ref<Record<string, string>>({})
</script>
