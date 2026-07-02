<!--
  PrtCarousel
  An embla-carousel-vue shell — embla owns motion/loop/drag/autoplay; we own the
  look (seed surfaces, square dots, ghost arrows) and the slot contract. Content is
  arbitrary, not image-only: card carousels, DAW racks, anything.

  Slide width is consumer CSS via the `--prt-carousel-slide` hook (default 100% =
  one per view; set e.g. `style="--prt-carousel-slide: 33.333%"` or a responsive
  media query for multi-per-view). embla owns `slidesToScroll`.

  Slot contract:
    default     — the slides; each direct child becomes one slide
    arrow-prev  — override the prev control (slot props { scroll, disabled })
    arrow-next  — override the next control (slot props { scroll, disabled })
-->
<template>
  <div :data-seed="seed ?? undefined" :class="cx('relative', props.class)">
    <div ref="emblaRef" class="overflow-hidden">
      <div class="prt-carousel__container flex">
        <slot />
      </div>
    </div>

    <template v-if="arrows">
      <slot name="arrow-prev" :scroll="scrollPrev" :disabled="!canPrev">
        <PrtBtn
          variant="ghost"
          size="sm"
          :seed="seed"
          :disabled="!canPrev"
          :aria-label="prevLabel"
          class="absolute left-2 top-1/2 -translate-y-1/2"
          @click="scrollPrev"
        >
          <span class="i-lucide-chevron-left h-5 w-5" aria-hidden="true" />
        </PrtBtn>
      </slot>
      <slot name="arrow-next" :scroll="scrollNext" :disabled="!canNext">
        <PrtBtn
          variant="ghost"
          size="sm"
          :seed="seed"
          :disabled="!canNext"
          :aria-label="nextLabel"
          class="absolute right-2 top-1/2 -translate-y-1/2"
          @click="scrollNext"
        >
          <span class="i-lucide-chevron-right h-5 w-5" aria-hidden="true" />
        </PrtBtn>
      </slot>
    </template>

    <div
      v-if="dots && snaps.length > 1"
      class="mt-3 flex items-center justify-center gap-1.5"
    >
      <button
        v-for="(_, i) in snaps"
        :key="i"
        type="button"
        :class="carouselDotVariants({ shape: dotShape, active: i === selectedIndex })"
        :aria-current="i === selectedIndex ? 'true' : undefined"
        :aria-label="dotLabel + ' ' + (i + 1)"
        @click="scrollTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import { usePreferredReducedMotion } from '@vueuse/core'
import { ref, watch } from 'vue'
import { PrtBtn } from '../btn'
import { cx } from '../_shared/cx'
import type { PrtCarouselProps } from './types'
import { carouselDotVariants } from './variants'

const props = withDefaults(defineProps<PrtCarouselProps>(), {
  loop: false,
  align: 'start',
  slidesToScroll: 1,
  dragFree: false,
  autoplay: false,
  autoplayDelay: 4000,
  arrows: true,
  dots: true,
  dotShape: 'square',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  dotLabel: 'Go to slide',
  class: '',
})

const emit = defineEmits<{
  select: [index: number]
  settle: []
}>()

const reduced = usePreferredReducedMotion()

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    loop: props.loop,
    align: props.align,
    slidesToScroll: props.slidesToScroll,
    dragFree: props.dragFree,
  },
  props.autoplay && reduced.value !== 'reduce'
    ? [
        Autoplay({
          delay: props.autoplayDelay,
          stopOnMouseEnter: true,
          stopOnInteraction: false,
          stopOnFocusIn: true,
        }),
      ]
    : [],
)

const selectedIndex = ref(0)
const snaps = ref<number[]>([])
const canPrev = ref(false)
const canNext = ref(false)

function scrollPrev() {
  emblaApi.value?.scrollPrev()
}
function scrollNext() {
  emblaApi.value?.scrollNext()
}
function scrollTo(i: number, jump = false) {
  emblaApi.value?.scrollTo(i, jump)
}
function reInit() {
  emblaApi.value?.reInit()
}

watch(emblaApi, (api) => {
  if (!api) return

  const sync = () => {
    selectedIndex.value = api.selectedScrollSnap()
    canPrev.value = api.canScrollPrev()
    canNext.value = api.canScrollNext()
  }
  const onSelect = () => {
    sync()
    emit('select', selectedIndex.value)
  }

  snaps.value = api.scrollSnapList()
  api.on('select', onSelect)
  api.on('settle', () => emit('settle'))
  api.on('reInit', () => {
    snaps.value = api.scrollSnapList()
    sync()
  })
  sync()
})

defineExpose({ scrollTo, scrollPrev, scrollNext, reInit, selectedIndex })
</script>

<style scoped>
/* each slotted slide: do not shrink; width comes from the css hook (default 100%) */
.prt-carousel__container > :slotted(*) {
  flex: 0 0 var(--prt-carousel-slide, 100%);
  min-width: 0;
}
</style>
