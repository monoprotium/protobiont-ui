<!--
  PrtLightbox
  Web-gallery image viewer on the native <dialog> substrate (useModalDialog):
  scrim, Esc, scroll-lock, focus-trap, top-layer all FREE. Prev/next is a
  PrtCarousel (swipe + the View-Transition thumbnail morph).

  Presentation:
    - DEFAULT = centered + contained on a dimmed scrim (the dialog is transparent,
      the ::backdrop scrim dims the page) — mixed-ratio friendly, conventional.
    - `fullscreen` = edge-to-edge immersive on an opaque surface (photographer /
      art-gallery idiom).
    - `thumbs` rail (bottom or side), `counter` "i / N", click-to-`zoom` the
      active frame (contained ⇄ full-viewport). Single-image degrades cleanly.

  Models: v-model:open (boolean), v-model:index (number).
  Slot contract:
    caption — override the caption (slot props { item, index })
  Expose: openAt(index) — the gallery's click entry; close()
-->
<template>
  <dialog
    ref="el"
    class="prt-lightbox"
    :data-fullscreen="fullscreen ? 'true' : 'false'"
    :class="cx(props.class)"
    closedby="any"
    @keydown="onKeydown"
  >
    <PrtCarousel
      ref="carousel"
      loop
      :dots="false"
      :arrows="false"
      class="h-dvh"
      @select="onSelect"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="relative flex h-dvh items-center justify-center"
        :class="[
          thumbs && thumbsPosition === 'side' ? 'pr-28' : '',
          thumbs && thumbsPosition === 'bottom' ? 'pb-28' : '',
        ]"
        @click.self="close"
      >
        <span
          v-if="!loaded[i]"
          class="i-lucide-loader-circle absolute h-8 w-8 animate-spin text-ink-faint"
          aria-hidden="true"
        />
        <img
          :src="item.src"
          :alt="item.alt"
          loading="lazy"
          decoding="async"
          :class="[
            frameClass(i),
            loaded[i] ? 'opacity-100' : 'opacity-0',
            zoom ? (zoomedIndex === i ? 'cursor-zoom-out' : 'cursor-zoom-in') : '',
            'prt-motion select-none',
          ]"
          :style="morphing && i === index ? morphStyle : undefined"
          @load="loaded[i] = true"
          @click="zoom && toggleZoom(i)"
        />
      </div>
    </PrtCarousel>

    <div
      v-if="showCounter"
      class="pointer-events-none absolute left-4 top-4 z-10 text-sm font-mono tabular-nums text-ink-muted"
    >
      {{ index + 1 }} / {{ items.length }}
    </div>

    <div class="absolute right-4 top-4 z-10 flex items-center gap-1">
      <PrtBtn
        v-if="zoom"
        variant="ghost"
        size="sm"
        :aria-label="zoomLabel"
        @click="toggleZoom(index)"
      >
        <span
          :class="zoomedIndex === index ? 'i-lucide-zoom-out' : 'i-lucide-zoom-in'"
          class="h-5 w-5"
          aria-hidden="true"
        />
      </PrtBtn>
      <PrtBtn variant="ghost" size="sm" :aria-label="closeLabel" @click="close">
        <span class="i-lucide-x h-5 w-5" aria-hidden="true" />
      </PrtBtn>
    </div>

    <template v-if="items.length > 1">
      <PrtBtn
        variant="ghost"
        size="sm"
        class="absolute left-3 top-1/2 z-10 -translate-y-1/2"
        :aria-label="prevLabel"
        @click="carousel?.scrollPrev()"
      >
        <span class="i-lucide-chevron-left h-6 w-6" aria-hidden="true" />
      </PrtBtn>
      <PrtBtn
        variant="ghost"
        size="sm"
        class="absolute top-1/2 z-10 -translate-y-1/2"
        :class="thumbs && thumbsPosition === 'side' ? 'right-28' : 'right-3'"
        :aria-label="nextLabel"
        @click="carousel?.scrollNext()"
      >
        <span class="i-lucide-chevron-right h-6 w-6" aria-hidden="true" />
      </PrtBtn>
    </template>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 pb-4"
    >
      <div
        v-if="$slots.caption || (captions && currentCaption)"
        class="pointer-events-auto rounded-control bg-surface-1 border border-edge"
        :class="lightboxCaptionClass"
      >
        <slot name="caption" :item="items[index]" :index="index">
          {{ currentCaption }}
        </slot>
      </div>
      <div
        v-if="thumbs && thumbsPosition === 'bottom'"
        class="pointer-events-auto flex max-w-[92vw] gap-2 overflow-x-auto px-4 py-1"
      >
        <button
          v-for="(item, i) in items"
          :key="i"
          type="button"
          :class="lightboxThumbVariants({ active: i === index })"
          :aria-label="item.alt"
          @click="goTo(i)"
        >
          <img :src="item.thumb || item.src" alt="" class="h-full w-full object-cover" />
        </button>
      </div>
    </div>

    <div
      v-if="thumbs && thumbsPosition === 'side'"
      class="absolute right-3 top-1/2 z-10 flex max-h-[80dvh] -translate-y-1/2 flex-col gap-2 overflow-y-auto py-1"
    >
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        :class="lightboxThumbVariants({ active: i === index })"
        :aria-label="item.alt"
        @click="goTo(i)"
      >
        <img :src="item.thumb || item.src" alt="" class="h-full w-full object-cover" />
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, shallowRef, watch } from 'vue'
import { PrtBtn } from '../btn'
import { PrtCarousel } from '../carousel'
import { cx } from '../_shared/cx'
import { useModalDialog } from '../_shared/useModalDialog'
import type { PrtLightboxProps } from './types'
import {
  LIGHTBOX_MORPH_NAME,
  lightboxCaptionClass,
  lightboxThumbVariants,
} from './variants'

const props = withDefaults(defineProps<PrtLightboxProps>(), {
  fullscreen: false,
  thumbs: false,
  thumbsPosition: 'bottom',
  counter: true,
  captions: false,
  zoom: false,
  closeLabel: 'Close',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  zoomLabel: 'Zoom',
  class: '',
})

const open = defineModel<boolean>('open', { default: false })
const index = defineModel<number>('index', { default: 0 })

const el = shallowRef<HTMLDialogElement | null>(null)
const carousel = shallowRef<InstanceType<typeof PrtCarousel> | null>(null)
const morphing = ref(false)
const zoomedIndex = ref(-1)
const loaded = reactive<Record<number, boolean>>({})

const morphStyle = { viewTransitionName: LIGHTBOX_MORPH_NAME }
const currentCaption = computed(() => props.items[index.value]?.caption)
const showCounter = computed(() => props.counter && props.items.length > 1)
const canVT =
  typeof document !== 'undefined' && 'startViewTransition' in document

// the frame sizing: full-viewport when fullscreen or zoomed-in; otherwise
// centered + contained, leaving room for the chrome (thumbs/caption)
function frameClass(i: number) {
  if (props.fullscreen || zoomedIndex.value === i) {
    return 'h-dvh w-screen object-contain'
  }
  const tall =
    props.thumbs && props.thumbsPosition === 'bottom' ? 'max-h-[74dvh]' : 'max-h-[84dvh]'
  const wide =
    props.thumbs && props.thumbsPosition === 'side' ? 'max-w-[78vw]' : 'max-w-[92vw]'
  return tall + ' ' + wide + ' h-auto w-auto object-contain'
}

useModalDialog(el, {
  modelValue: () => open.value,
  emit: (v) => {
    open.value = v
  },
  animatedClose: false,
})

function onSelect(i: number) {
  index.value = i
  zoomedIndex.value = -1 // reset zoom when the frame changes
}

function goTo(i: number) {
  index.value = i
  carousel.value?.scrollTo(i)
  zoomedIndex.value = -1
}

function toggleZoom(i: number) {
  zoomedIndex.value = zoomedIndex.value === i ? -1 : i
}

// the gallery's click handler — morphs the thumbnail into the image
async function openAt(i: number) {
  index.value = i
  if (!canVT) {
    open.value = true
    return
  }
  morphing.value = true
  try {
    // @ts-expect-error startViewTransition not yet in this TS lib.dom
    await document.startViewTransition(async () => {
      open.value = true
      await nextTick()
    }).finished
  } finally {
    morphing.value = false
  }
}

function close() {
  open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') carousel.value?.scrollPrev()
  else if (e.key === 'ArrowRight') carousel.value?.scrollNext()
}

// any open (openAt OR plain v-model:open) reInits embla — its slides were
// display:none inside the closed dialog, so embla measured them at zero
watch(open, async (isOpen) => {
  if (!isOpen) return
  zoomedIndex.value = -1
  await nextTick()
  carousel.value?.reInit()
  carousel.value?.scrollTo(index.value, true)
})

watch(index, (i) => {
  if (open.value && carousel.value && carousel.value.selectedIndex.value !== i) {
    carousel.value.scrollTo(i)
  }
})

defineExpose({ openAt, close })
</script>

<style scoped>
/* <dialog> UA resets. Default: TRANSPARENT dialog — the ::backdrop scrim dims
   the page and the contained image floats centered on it. fullscreen: an opaque
   surface for the immersive idiom. Both axes need explicit size (drawer trap)
   or the dialog renders content-sized. NEVER bg-black. */
.prt-lightbox {
  padding: 0;
  border: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100dvh;
  max-height: 100dvh;
  background: transparent;
  opacity: 0;
  transition:
    opacity var(--motion-duration) var(--motion-ease),
    display var(--motion-duration) allow-discrete,
    overlay var(--motion-duration) allow-discrete;
}
.prt-lightbox[data-fullscreen='true'] {
  background: var(--surface-0);
}
.prt-lightbox[open] {
  opacity: 1;
  @starting-style {
    opacity: 0;
  }
}
.prt-lightbox::backdrop {
  background: var(--scrim);
}
</style>
