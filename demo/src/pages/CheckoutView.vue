<!--
  Checkout — the composed recipe page. It renders the whole form in place:
  contact + shipping (PrtCheckoutAddressFields), delivery (PrtRadioGroup card),
  the PCI payment slot, Place order, and a sticky PrtCheckoutOrderSummary —
  exactly the `formcheckout` starter (CheckoutSingle.vue), shown live as one page.

  This is a demo page, so it imports useForm and uses the globally-registered
  Prt* components. The copyable source is the starter: `prt add formcheckout`.
-->
<template>
  <DemoLayout>
    <div class="px-8 py-8">
      <div class="mb-8 border-l-2 border-accent pl-4">
        <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
          Checkout
        </h1>
        <p class="text-xs font-mono text-ink-faint mt-1">
          recipe · the whole checkout in place — fields + delivery + payment + sticky summary
        </p>
      </div>

      <div class="mb-8 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
        <p>
          The composed <strong class="text-ink">formcheckout</strong> starter, live:
          contact &amp; shipping via <code class="font-mono text-xs">PrtCheckoutAddressFields</code>,
          delivery as <code class="font-mono text-xs">PrtRadioGroup variant="card"</code>,
          a PCI <code class="font-mono text-xs">#payment-fields</code> slot the
          provider mounts into (the kit renders no PAN/CVV), and a sticky
          <code class="font-mono text-xs">PrtCheckoutOrderSummary</code>. The kit
          does zero money math — every price is a pre-formatted string. Copy the
          source with <code class="font-mono text-xs">prt add formcheckout</code>.
        </p>
      </div>

      <!-- the recipe, centered like a real checkout subpage -->
      <div class="checkout mx-auto max-w-5xl">
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
              <div
                id="payment-fields"
                class="min-h-32 rounded-surface border border-dashed border-edge-strong bg-surface-1 p-4 text-sm text-ink-faint flex items-center justify-center text-center"
              >
                Your payment provider (Stripe / Adyen / …) mounts here
                (<code class="font-mono text-xs">#payment-fields</code>).
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
    </div>
  </DemoLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useForm } from '@ui/form'
import DemoLayout from '../shell/DemoLayout.vue'
import { showSnippet } from '../shell/sourceStore'
// the EXACT copyable recipe source (what `prt add formcheckout` writes), shown
// verbatim in the Source panel — a whole-page recipe isn't a DemoItem snippet,
// so feed it directly. onMounted runs after DemoLayout's onBeforeMount clear.
import checkoutSource from '../../../templates/starters/formcheckout/CheckoutSingle.vue?raw'

const state = reactive({
  shipping: {} as Record<string, string>,
  method: 'standard',
})
const form = useForm({ state, onSubmit: () => {} })

const open = reactive({ contact: true, delivery: true, payment: true })

onMounted(() => {
  showSnippet({
    title: 'CheckoutSingle.vue',
    code: checkoutSource,
    imports: [],
    raw: true,
    lang: 'vue',
  })
})

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
  { id: 'a', label: 'Aurora desk lamp', quantity: 1, unitPriceFormatted: '€89.00', totalFormatted: '€89.00', imageUrl: '/geo-1.svg', imageAlt: 'Desk lamp' },
  { id: 'b', label: 'Linen throw — sand', quantity: 2, unitPriceFormatted: '€45.00', totalFormatted: '€90.00', imageUrl: '/geo-2.svg', imageAlt: 'Folded linen throw' },
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
