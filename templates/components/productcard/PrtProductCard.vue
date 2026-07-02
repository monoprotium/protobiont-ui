<!--
  PrtProductCard (recipe)
  A storefront card composed from existing parts: PrtCard substrate, PrtRating
  (readonly) meta row, PrtInputNumber qty, PrtBtn action. Slots + data-presence
  instead of show* booleans: omit a field in `product` and its section disappears;
  a named slot replaces its section. Restrained hover (edge shift) — no scale zoom,
  no shadow bloom. Price arrives pre-formatted (string); favorite is
  controlled-only.
  Slot contract:
    media   — replaces the product image (the favorite overlay stays)
    title   — replaces the title line
    meta    — replaces the rating row
    price   — replaces the price text
    actions — replaces the qty + add-to-cart pair
-->
<template>
  <PrtCard :class="cx('hover:border-edge-strong', props.class)">
    <template v-if="$slots.media || product.image" #image>
      <div class="relative">
        <slot name="media">
          <img
            :src="product.image"
            alt=""
            class="aspect-square w-full bg-surface-2 object-cover"
          />
        </slot>
        <button
          v-if="showFavorite"
          type="button"
          :aria-label="favoriteLabel"
          :class="productCardFavoriteVariants({ active: favorite === true })"
          @click="emit('update:favorite', !(favorite ?? false))"
        >
          <span class="i-lucide-heart" aria-hidden="true" />
        </button>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col gap-1.5">
        <slot name="title">
          <p class="text-sm font-medium text-ink">{{ product.title }}</p>
        </slot>
        <slot name="meta">
          <PrtRating
            v-if="product.rating != null"
            :model-value="product.rating"
            readonly
            size="sm"
          />
        </slot>
        <p v-if="product.description" class="line-clamp-2 text-sm text-ink-muted">
          {{ product.description }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
        <slot name="price">
          <span class="text-sm font-medium text-ink tabular-nums">{{ product.price }}</span>
        </slot>
        <div class="ml-auto flex items-center gap-2">
          <slot name="actions">
            <!-- fixed-width wrapper: PrtInputNumber's root is w-full, so it
                 must be CONSTRAINED here or it stretches and breaks the row.
                 w-24: the two sm steppers eat 64px (w-8 each); 96px leaves
                 ~24px of centered text room — enough for a 2-digit qty.
                 w-20 clipped the digit (only 8px left). -->
            <div class="w-24 shrink-0">
              <PrtInputNumber
                :model-value="qty"
                size="sm"
                :min="1"
                @update:model-value="setQty"
              />
            </div>
            <!-- compact cart ICON, not a text label (a label wraps in narrow
                 cards); cartLabel rides along as the accessible name -->
            <PrtBtn
              size="sm"
              :seed="seed"
              :aria-label="cartLabel"
              :title="cartLabel"
              class="shrink-0"
              @click="emit('add-to-cart', qty)"
            >
              <span :class="cartIcon" aria-hidden="true" />
            </PrtBtn>
          </slot>
        </div>
      </div>
    </template>
  </PrtCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { cx } from '../_shared/cx'
import { PrtBtn } from '../btn'
import { PrtCard } from '../card'
import { PrtInputNumber } from '../inputnumber'
import { PrtRating } from '../rating'
import type { PrtProductCardProps } from './types'
import { productCardFavoriteVariants } from './variants'

const props = withDefaults(defineProps<PrtProductCardProps>(), {
  showFavorite: true,
  cartLabel: 'Add to cart',
  cartIcon: 'i-lucide-shopping-cart',
  favoriteLabel: 'Add to favorites',
  class: '',
})

const emit = defineEmits<{
  'add-to-cart': [quantity: number]
  'update:favorite': [favorite: boolean]
  'update:quantity': [quantity: number]
}>()

// qty: optional v-model — the prop wins when set, local state otherwise
const localQty = ref(props.quantity ?? 1)
const qty = computed(() => props.quantity ?? localQty.value)

function setQty(value: number | null) {
  const next = value ?? 1
  localQty.value = next
  emit('update:quantity', next)
}
</script>
