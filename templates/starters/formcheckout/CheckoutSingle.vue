<!--
  CheckoutSingle — the one-page checkout starter. Everything on one screen,
  sections grouped with PrtCollapsible, the same sticky summary + payment
  iframe slot + Place Order as CheckoutSteps. Same kit/app boundary (see the
  starters doc). Research: single-vs-multi is perceived complexity, not page
  count — ship both, let the project pick.

  Adjust the import paths below to your componentDir.
-->
<template>
  <div class="checkout mx-auto max-w-5xl px-4 py-8">
    <div class="checkout-grid grid gap-8">
      <PrtForm :form="form" class="min-w-0 flex flex-col gap-4">
        <PrtCollapsible v-model="open.contact" label="Contact & shipping">
          <PrtCheckoutAddressFields v-model="state.shipping" mode="shipping" :region-options="regions" />
        </PrtCollapsible>

        <PrtCollapsible v-model="open.delivery" label="Delivery">
          <PrtRadioGroup v-model="state.method" variant="card" :options="methodOptions">
            <template #meta="{ option }">
              <span class="text-right">
                <span class="block text-sm tabular-nums text-ink">{{ methodMeta[option.value].price }}</span>
                <span class="block text-xs text-ink-faint">{{ methodMeta[option.value].eta }}</span>
              </span>
            </template>
          </PrtRadioGroup>
        </PrtCollapsible>

        <PrtCollapsible v-model="open.payment" label="Payment">
          <!-- PCI SAQ-A: the kit renders no PAN/CVV inputs; the provider mounts here -->
          <div
            id="payment-fields"
            class="min-h-32 rounded-surface border border-dashed border-edge-strong bg-surface-1 p-4 text-sm text-ink-faint flex items-center justify-center"
          >
            <slot name="payment-fields">Your payment provider mounts here (#payment-fields).</slot>
          </div>
        </PrtCollapsible>

        <PrtBtn
          seed="7"
          full-width
          :loading="form.submitting"
          :disabled="form.submitting"
          @click="form.submit()"
        >
          Place order
        </PrtBtn>
      </PrtForm>

      <aside class="checkout-summary">
        <PrtCheckoutOrderSummary
          :line-items="lineItems"
          subtotal-formatted="€179.00"
          shipping-formatted="Free"
          tax-formatted="€34.85"
          total-formatted="€213.85"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { PrtBtn } from '@/components/ui/btn'
import { PrtCheckoutAddressFields } from '@/components/ui/checkoutaddressfields'
import { PrtCheckoutOrderSummary } from '@/components/ui/checkoutordersummary'
import { PrtCollapsible } from '@/components/ui/collapsible'
import { PrtForm, useForm } from '@/components/ui/form'
import { PrtRadioGroup } from '@/components/ui/radiogroup'
import { checkoutSchema } from './formcheckout.schema'

const emit = defineEmits<{ orderPlaced: [values: unknown] }>()

const state = reactive({
  email: '',
  phone: '',
  shipping: {} as Record<string, string>,
  method: 'standard',
})
const form = useForm({ state, schema: checkoutSchema, onSubmit: (o) => emit('orderPlaced', o) })

const open = reactive({ contact: true, delivery: true, payment: true })

const methodOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'pickup', label: 'Store pickup' },
]
const methodMeta: Record<string, { price: string; eta: string }> = {
  standard: { price: 'Free', eta: 'Arrives Thu, Jun 19' },
  express: { price: '€9.95', eta: 'Arrives Tue, Jun 17' },
  pickup: { price: 'Free', eta: 'Ready today' },
}
const regions = [
  { value: 'BY', label: 'Bavaria' },
  { value: 'IDF', label: 'Île-de-France' },
  { value: 'CAT', label: 'Catalonia' },
  { value: 'LOM', label: 'Lombardy' },
  { value: 'NH', label: 'North Holland' },
]
const lineItems = [
  { id: 'a', label: 'Aurora desk lamp', quantity: 1, unitPriceFormatted: '€89.00', totalFormatted: '€89.00', imageUrl: '/geo-1.svg' },
  { id: 'b', label: 'Linen throw — sand', quantity: 2, unitPriceFormatted: '€45.00', totalFormatted: '€90.00', imageUrl: '/geo-4.svg' },
]
</script>

<style scoped>
.checkout {
  container-type: inline-size;
}
@container (min-width: 48rem) {
  .checkout-grid {
    grid-template-columns: 1fr 20rem;
  }
  .checkout-summary {
    position: sticky;
    top: 1.5rem;
    align-self: start;
  }
}
</style>
