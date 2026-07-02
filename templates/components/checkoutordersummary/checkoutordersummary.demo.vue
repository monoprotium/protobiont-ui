<template>
  <DemoSection title="Order summary — line items, totals, promo" min="24rem">
    <DemoItem label="a real cart with a pending shipping cost">
      <div class="max-w-sm">
        <PrtCheckoutOrderSummary
          :line-items="[
            { id: 'a', label: 'Aurora desk lamp', quantity: 1, unitPriceFormatted: '€89.00', totalFormatted: '€89.00', imageUrl: '/geo-1.svg' },
            { id: 'b', label: 'Linen throw — sand', quantity: 2, unitPriceFormatted: '€45.00', totalFormatted: '€90.00', imageUrl: '/geo-4.svg' },
          ]"
          subtotal-formatted="€179.00"
          :shipping-formatted="null"
          :tax-formatted="null"
          total-formatted="€179.00"
        />
      </div>
    </DemoItem>
    <DemoItem label="with quantity steppers + a discount row + a trust signal">
      <div class="max-w-sm">
        <PrtCheckoutOrderSummary
          show-quantity-controls
          :line-items="[
            { id: 'a', label: 'Aurora desk lamp', quantity: 1, unitPriceFormatted: '€89.00', totalFormatted: '€89.00', imageUrl: '/geo-1.svg' },
            { id: 'b', label: 'Linen throw — sand', quantity: 2, unitPriceFormatted: '€45.00', totalFormatted: '€90.00', imageUrl: '/geo-4.svg' },
          ]"
          subtotal-formatted="€179.00"
          shipping-formatted="€4.95"
          tax-formatted="€34.85"
          discount-formatted="€18.00"
          total-formatted="€200.80"
        >
          <template #trust-signals>
            <p class="flex items-center gap-2 text-xs text-ink-faint">
              <span class="i-lucide-shield-check text-accent" aria-hidden="true" />
              Secure checkout · 30-day returns
            </p>
          </template>
        </PrtCheckoutOrderSummary>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const show = ref(false)
</script>
