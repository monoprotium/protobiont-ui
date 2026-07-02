<!--
  PrtGallery
  Image-specialized grid (not a renamed listing): aspect control, masonry, and a
  built-in lightbox trigger. Cells are PrtLazyImg (blur-up/skeleton/error free).
  Clicking a cell opens the internal PrtLightbox at that index with a
  View-Transition thumbnail morph.

  Layouts: 'grid' (uniform-aspect auto-fill) | 'masonry' (varied-height CSS
  columns — reads top-to-bottom per column, a source-order trade-off).

  Slot contract:
    item    — override a cell (slot props { item, index, open })
    overlay — per-cell hover overlay (slot props { item, index })
  Model: v-model:selected (number[]) when `selectable`.
-->
<template>
  <div :data-seed="seed ?? undefined">
    <div :class="cx(containerClass, props.class)" :style="containerStyle">
      <div
        v-for="(item, i) in items"
        :key="i"
        :class="galleryCellVariants({ layout, gap, selected: isSelected(i) })"
        :style="morphIndex === i ? morphStyle : undefined"
      >
        <slot name="item" :item="item" :index="i" :open="() => openCell(i)">
          <button
            type="button"
            class="block w-full cursor-pointer border-0 bg-transparent p-0 prt-ring"
            @click="openCell(i)"
          >
            <PrtLazyImg
              :src="item.thumb || item.src"
              :alt="item.alt"
              :aspect="layout === 'grid' ? (aspect || '1/1') : undefined"
              :seed="seed"
            />
          </button>
        </slot>

        <button
          v-if="selectable"
          type="button"
          :class="gallerySelectVariants({ selected: isSelected(i) })"
          :aria-pressed="isSelected(i)"
          :aria-label="selectLabel"
          @click.stop="toggle(i)"
        >
          <span
            :class="isSelected(i) ? 'i-lucide-check' : 'i-lucide-plus'"
            class="h-4 w-4"
            aria-hidden="true"
          />
        </button>

        <div
          v-if="$slots.overlay"
          class="pointer-events-none absolute inset-0 flex items-end opacity-0 prt-motion group-hover:opacity-100"
        >
          <slot name="overlay" :item="item" :index="i" />
        </div>
      </div>
    </div>

    <PrtLightbox
      v-if="lightbox"
      ref="lb"
      v-model:open="lbOpen"
      v-model:index="lbIndex"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from 'vue'
import { PrtLazyImg } from '../lazyimg'
import { PrtLightbox } from '../lightbox'
import { LIGHTBOX_MORPH_NAME } from '../lightbox/variants'
import { cx } from '../_shared/cx'
import type { PrtGalleryProps } from './types'
import { galleryCellVariants, gallerySelectVariants } from './variants'

const props = withDefaults(defineProps<PrtGalleryProps>(), {
  layout: 'grid',
  gap: 'normal',
  selectable: false,
  lightbox: true,
  selectLabel: 'Select image',
  class: '',
})

const emit = defineEmits<{
  open: [index: number]
}>()

const selected = defineModel<number[]>('selected', { default: () => [] })

const lb = shallowRef<InstanceType<typeof PrtLightbox> | null>(null)
const lbOpen = ref(false)
const lbIndex = ref(0)
const morphIndex = ref(-1)
const morphStyle = { viewTransitionName: LIGHTBOX_MORPH_NAME }

const min = computed(() => props.itemMin || '14rem')
const gapLen = computed(() => (props.gap === 'dense' ? '0.375rem' : '0.75rem'))
const containerClass = computed(() =>
  props.layout === 'grid' ? 'grid' : 'prt-gallery-masonry',
)
const containerStyle = computed(() =>
  props.layout === 'grid'
    ? {
        gridTemplateColumns:
          'repeat(auto-fill, minmax(min(' + min.value + ', 100%), 1fr))',
        gap: gapLen.value,
      }
    : {
        columnWidth: min.value,
        columnGap: gapLen.value,
        '--prt-gallery-min': min.value,
      },
)

function isSelected(i: number) {
  return (selected.value ?? []).includes(i)
}
function toggle(i: number) {
  const cur = selected.value ?? []
  selected.value = cur.includes(i)
    ? cur.filter((x) => x !== i)
    : [...cur, i]
}
async function openCell(i: number) {
  emit('open', i)
  if (!props.lightbox) return
  // set the morph name on the clicked cell, let it land in the DOM, then open
  morphIndex.value = i
  await nextTick()
  await lb.value?.openAt(i)
  morphIndex.value = -1
}
</script>

<style scoped>
/* Masonry baseline = CSS columns (interop). Forward-compat: when both
   engines ship native masonry (display: grid-lanes — flagged in both today),
   upgrade for free; the block resets the columns properties so they don't
   fight. Never load-bearing — the columns baseline carries v1. */
@supports (display: grid-lanes) {
  .prt-gallery-masonry {
    display: grid-lanes;
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--prt-gallery-min, 14rem), 100%), 1fr)
    );
    columns: unset;
    column-gap: unset;
  }
}
</style>
