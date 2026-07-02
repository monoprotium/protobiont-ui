<!--
  PrtCheckoutOrderSummary
  The order-summary block every checkout needs. The kit does no money math — every
  price arrives pre-formatted as a string, because client-side money math invites
  price manipulation and sync bugs. Totals are a <dl>; the total row is aria-live
  so screen readers hear it recompute. Promo is collapsed behind a link (so it
  doesn't trigger coupon-hunting) and auto-applies on blur — no "Apply" button.

  Flat panel — borders before shadows (bg-surface-2 + hairline, no shadow).
  Desktop sticky / mobile bottom-drawer is the starter page's job (layout); this
  composite is the reusable panel.

  Slot contract:
    line-item-extra (scoped { item }) — per-item extra (e.g. variant chips)
    totals-extra    — extra rows inside the totals <dl>
    promo-feedback  — consumer drops a PrtNotice here after promoApply
    trust-signals   — badges / guarantees below the total
  emits: promoApply(code) · quantityChange({ id, quantity })
-->
<template>
  <section :class="panelClass" aria-label="Order summary">
    <h2 class="text-sm font-medium text-ink mb-3">{{ title }}</h2>

    <ul class="flex flex-col gap-3">
      <li v-for="item in lineItems" :key="item.id" class="flex items-center gap-3">
        <!-- a square thumbnail WELL on a contrasting surface (surface-3 ≠ the
             surface-2 panel) so the image — or the empty-image placeholder —
             reads as a distinct slot instead of blending into the panel. -->
        <div class="size-12 shrink-0 grid place-items-center overflow-hidden rounded-control bg-surface-3">
          <PrtLazyImg
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.imageAlt ?? ''"
            aspect="1"
            rounded="none"
            class="w-full"
          />
          <span v-else class="i-lucide-image text-base text-ink-faint" aria-hidden="true" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm text-ink truncate">{{ item.label }}</p>
          <div class="mt-0.5 flex items-center gap-2">
            <div v-if="showQuantityControls" class="inline-flex items-center gap-1">
              <PrtBtn
                variant="outline"
                size="sm"
                :aria-label="decreaseLabel"
                @click="step(item, -1)"
              >
                <span class="i-lucide-minus" aria-hidden="true" />
              </PrtBtn>
              <span class="text-xs font-mono tabular-nums w-6 text-center">{{ item.quantity }}</span>
              <PrtBtn
                variant="outline"
                size="sm"
                :aria-label="increaseLabel"
                @click="step(item, 1)"
              >
                <span class="i-lucide-plus" aria-hidden="true" />
              </PrtBtn>
            </div>
            <span v-else class="text-xs font-mono text-ink-faint tabular-nums">
              × {{ item.quantity }}
            </span>
          </div>
          <slot name="line-item-extra" :item="item" />
        </div>
        <!-- price is its OWN right column (vertically centered with the row), so
             it lines up cleanly regardless of thumbnail/label height -->
        <span class="shrink-0 text-sm tabular-nums text-ink">{{ item.totalFormatted }}</span>
      </li>
    </ul>

    <!-- promo: collapsed behind a link, auto-apply on blur -->
    <div class="mt-4 border-t border-edge pt-3">
      <button
        v-if="!promoOpen"
        type="button"
        class="text-xs font-medium text-accent bg-transparent prt-motion-colors hover:underline underline-offset-2"
        @click="promoOpen = true"
      >
        {{ promoToggleText }}
      </button>
      <div v-else class="flex flex-col gap-2">
        <PrtInput
          v-model="promoCode"
          :placeholder="promoPlaceholder"
          @blur="onPromoBlur"
        />
        <slot name="promo-feedback" />
      </div>
    </div>

    <!-- totals -->
    <dl class="mt-4 border-t border-edge pt-3 flex flex-col gap-2 text-sm">
      <div class="flex justify-between">
        <dt class="text-ink-muted">{{ labelSubtotal }}</dt>
        <dd class="tabular-nums text-ink">{{ subtotalFormatted }}</dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-ink-muted">{{ labelShipping }}</dt>
        <dd class="tabular-nums" :class="shippingFormatted ? 'text-ink' : 'text-ink-faint'">
          {{ shippingFormatted ?? shippingPendingText }}
        </dd>
      </div>
      <div v-if="taxFormatted" class="flex justify-between">
        <dt class="text-ink-muted">{{ labelTax }}</dt>
        <dd class="tabular-nums text-ink">{{ taxFormatted }}</dd>
      </div>
      <div v-if="discountFormatted" class="flex justify-between">
        <dt class="text-ink-muted">{{ labelDiscount }}</dt>
        <dd class="tabular-nums text-accent">−{{ discountFormatted }}</dd>
      </div>
      <slot name="totals-extra" />
      <div
        class="flex justify-between border-t border-edge pt-2 mt-1 text-base font-medium"
        aria-live="polite"
      >
        <dt class="text-ink">{{ labelTotal }}</dt>
        <dd class="tabular-nums text-ink">{{ totalFormatted }}</dd>
      </div>
    </dl>

    <div v-if="$slots['trust-signals']" class="mt-4 border-t border-edge pt-3">
      <slot name="trust-signals" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrtBtn from '../btn/PrtBtn.vue'
import PrtInput from '../input/PrtInput.vue'
import PrtLazyImg from '../lazyimg/PrtLazyImg.vue'
import type { CheckoutLineItem, PrtCheckoutOrderSummaryProps } from './types'

const props = withDefaults(defineProps<PrtCheckoutOrderSummaryProps>(), {
  showQuantityControls: false,
  title: 'Order summary',
  labelSubtotal: 'Subtotal',
  labelShipping: 'Shipping',
  labelTax: 'Tax',
  labelDiscount: 'Discount',
  labelTotal: 'Total',
  shippingPendingText: 'Calculated at next step',
  promoToggleText: 'Have a promo code?',
  promoPlaceholder: 'Promo code',
  decreaseLabel: 'Decrease quantity',
  increaseLabel: 'Increase quantity',
})

const emit = defineEmits<{
  promoApply: [code: string]
  quantityChange: [payload: { id: string; quantity: number }]
}>()

const panelClass = 'bg-surface-2 border border-edge rounded-surface p-4'

const promoOpen = ref(false)
const promoCode = ref('')

function onPromoBlur() {
  const code = promoCode.value.trim()
  if (code) emit('promoApply', code)
}

function step(item: CheckoutLineItem, delta: number) {
  const next = Math.max(0, item.quantity + delta)
  if (next !== item.quantity) emit('quantityChange', { id: item.id, quantity: next })
}
</script>
