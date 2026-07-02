<!--
  CheckoutSteps — the multi-step checkout starter (the headline flavor).
  A 4-step flow: Contact & Shipping → Delivery → Payment → Review. Completed
  steps collapse to read-only summaries with an Edit link; focus moves to the
  new step heading.

  KIT/APP BOUNDARY (see the starters doc):
    kit  = field layout/labels/autocomplete, step UX, sticky↔drawer, aria-live,
           focus mgmt, the radio-cards, the payment iframe SLOT.
    app  = the validation schema, ALL money/tax/rates (pre-formatted strings),
           cart/line-items, the payment provider mount (#payment-fields),
           submission + post-order nav, trust content, promo/quantity handlers.

  Adjust the import paths below to your componentDir (prt init default shown).
-->
<template>
  <div class="checkout mx-auto max-w-5xl px-4 py-8">
    <PrtSteps v-model="step" :steps="stepDefs" class="mb-8" />

    <div class="checkout-grid grid gap-8">
      <PrtForm :form="form" class="min-w-0">
        <!-- 1 · Contact & shipping -->
        <section v-show="step === 0" aria-labelledby="step-contact">
          <h2 id="step-contact" ref="heading0" tabindex="-1" class="text-lg font-medium text-ink mb-4">
            Contact & shipping
          </h2>
          <PrtCheckoutAddressFields v-model="state.shipping" mode="shipping" :region-options="regions" />
          <div class="mt-6 flex justify-end">
            <PrtBtn seed="7" @click="next">Continue to delivery</PrtBtn>
          </div>
        </section>

        <!-- 2 · Delivery method (radio cards — delivery DATE, not speed) -->
        <section v-show="step === 1" aria-labelledby="step-delivery">
          <h2 id="step-delivery" ref="heading1" tabindex="-1" class="text-lg font-medium text-ink mb-4">
            Delivery
          </h2>
          <PrtRadioGroup v-model="state.method" variant="card" :options="methodOptions">
            <template #meta="{ option }">
              <span class="text-right">
                <span class="block text-sm tabular-nums text-ink">{{ methodMeta[option.value].price }}</span>
                <span class="block text-xs text-ink-faint">{{ methodMeta[option.value].eta }}</span>
              </span>
            </template>
          </PrtRadioGroup>
          <div class="mt-6 flex justify-between">
            <PrtBtn variant="ghost" @click="back">Back</PrtBtn>
            <PrtBtn seed="7" @click="next">Continue to payment</PrtBtn>
          </div>
        </section>

        <!-- 3 · Payment — the kit renders ZERO PAN/CVV inputs (PCI SAQ-A);
                the app mounts Stripe/Adyen/etc into #payment-fields. -->
        <section v-show="step === 2" aria-labelledby="step-payment">
          <h2 id="step-payment" ref="heading2" tabindex="-1" class="text-lg font-medium text-ink mb-4">
            Payment
          </h2>
          <div
            id="payment-fields"
            class="min-h-32 rounded-surface border border-dashed border-edge-strong bg-surface-1 p-4 text-sm text-ink-faint flex items-center justify-center"
          >
            <slot name="payment-fields">Your payment provider mounts here (#payment-fields).</slot>
          </div>
          <div class="mt-6 flex justify-between">
            <PrtBtn variant="ghost" @click="back">Back</PrtBtn>
            <PrtBtn seed="7" @click="next">Review order</PrtBtn>
          </div>
        </section>

        <!-- 4 · Review + place order -->
        <section v-show="step === 3" aria-labelledby="step-review">
          <h2 id="step-review" ref="heading3" tabindex="-1" class="text-lg font-medium text-ink mb-4">
            Review
          </h2>
          <dl class="text-sm grid gap-2 mb-6">
            <div class="flex gap-2">
              <dt class="text-ink-faint w-24">Ship to</dt>
              <dd class="text-ink">{{ state.shipping.fullName }}, {{ state.shipping.address1 }}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="text-ink-faint w-24">Delivery</dt>
              <dd class="text-ink">{{ methodMeta[state.method].eta }}</dd>
            </div>
          </dl>
          <div class="flex justify-between">
            <PrtBtn variant="ghost" @click="back">Back</PrtBtn>
            <PrtBtn seed="7" :loading="form.submitting" :disabled="form.submitting" @click="form.submit()">
              Place order
            </PrtBtn>
          </div>
        </section>
      </PrtForm>

      <!-- summary: sticky on desktop, a bottom drawer on narrow viewports -->
      <aside class="checkout-summary">
        <PrtCheckoutOrderSummary
          :line-items="lineItems"
          subtotal-formatted="€179.00"
          :shipping-formatted="step >= 1 ? methodMeta[state.method].price : null"
          :tax-formatted="step >= 1 ? '€34.85' : null"
          total-formatted="€213.85"
        >
          <template #trust-signals>
            <p class="flex items-center gap-2 text-xs text-ink-faint">
              <span class="i-lucide-shield-check text-accent" aria-hidden="true" />
              Secure checkout · 30-day returns
            </p>
          </template>
        </PrtCheckoutOrderSummary>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, useTemplateRef } from 'vue'
// adjust to your componentDir (prt init default: src/components/ui)
import { PrtBtn } from '@/components/ui/btn'
import { PrtCheckoutAddressFields } from '@/components/ui/checkoutaddressfields'
import { PrtCheckoutOrderSummary } from '@/components/ui/checkoutordersummary'
import { PrtForm, useForm } from '@/components/ui/form'
import { PrtRadioGroup } from '@/components/ui/radiogroup'
import { PrtSteps } from '@/components/ui/steps'
import { checkoutSchema } from './formcheckout.schema'

const emit = defineEmits<{ orderPlaced: [values: unknown] }>()

const state = reactive({
  email: '',
  phone: '',
  shipping: {} as Record<string, string>,
  method: 'standard',
})

const form = useForm({
  state,
  schema: checkoutSchema,
  onSubmit: (output) => emit('orderPlaced', output),
})

const step = ref(0)
const stepDefs = [
  { label: 'Contact' },
  { label: 'Delivery' },
  { label: 'Payment' },
  { label: 'Review' },
]

// app-owned: real prices/dates come from your cart + rate API (pre-formatted)
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
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
]
const lineItems = [
  { id: 'a', label: 'Aurora desk lamp', quantity: 1, unitPriceFormatted: '€89.00', totalFormatted: '€89.00', imageUrl: '/geo-1.svg' },
  { id: 'b', label: 'Linen throw — sand', quantity: 2, unitPriceFormatted: '€45.00', totalFormatted: '€90.00', imageUrl: '/geo-4.svg' },
]

const headings = [
  useTemplateRef<HTMLElement>('heading0'),
  useTemplateRef<HTMLElement>('heading1'),
  useTemplateRef<HTMLElement>('heading2'),
  useTemplateRef<HTMLElement>('heading3'),
]

function focusStep() {
  nextTick(() => headings[step.value]?.value?.focus())
}
function next() {
  if (step.value < stepDefs.length - 1) step.value++
  focusStep()
}
function back() {
  if (step.value > 0) step.value--
  focusStep()
}
</script>

<style scoped>
/* two-column via CONTAINER query (a hero may sit in a narrow column); the
   summary is sticky with NO overflow ancestor (FF sticky requirement). */
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
