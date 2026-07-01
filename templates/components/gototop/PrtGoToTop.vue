<!--
  PrtGoToTop
  Drop-and-works: placed FOR you (fixed corner), reveals past a scroll
  threshold, smooth-scrolls to top. VueUse useWindowScroll drives visibility
  (@container scroll-state() is Chrome-only, so JS stays load-bearing).

  Slot contract:
    default — override the button content (default: i-lucide-arrow-up)
-->
<template>
  <Transition
    enter-active-class="prt-motion"
    leave-active-class="prt-motion"
    enter-from-class="opacity-0 scale-90"
    leave-to-class="opacity-0 scale-90"
  >
    <button
      v-if="visible"
      type="button"
      :data-seed="seed ?? undefined"
      :aria-label="label"
      :class="cx(goToTopVariants({ position }), props.class)"
      @click="toTop"
    >
      <slot>
        <span class="i-lucide-arrow-up h-5 w-5" aria-hidden="true" />
      </slot>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtGoToTopProps } from './types'
import { goToTopVariants } from './variants'

const props = withDefaults(defineProps<PrtGoToTopProps>(), {
  threshold: 400,
  position: 'bottom-right',
  label: 'Back to top',
  class: '',
})

const { y } = useWindowScroll()
const visible = computed(() => y.value > props.threshold)

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
