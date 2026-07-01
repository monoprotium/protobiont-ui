<!--
  PrtSticky
  Drop it around a header/toolbar and forget it: position: sticky PLUS the
  stuck-state styling baked in (a hairline + raise the moment it pins). No
  wiring — the whole value is "drop it, don't think".

  Stuck detection is a zero-height VueUse useIntersectionObserver sentinel
  (@container scroll-state(stuck) is Chrome-only, no Firefox — so the JS
  sentinel is load-bearing, not the CSS). `stuck` is exposed (slot prop +
  data-stuck attr) for any extra styling the consumer wants.

  Slot contract:
    default — the sticky content (slot prop { stuck })
-->
<template>
  <div ref="sentinel" aria-hidden="true" class="h-0" />
  <div
    :data-stuck="stuck ? 'true' : 'false'"
    :style="{ '--prt-sticky-top': topValue, '--prt-sticky-z': String(z) }"
    :class="cx(stickyClass, props.class)"
  >
    <slot :stuck="stuck" />
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { computed, onMounted, ref, shallowRef } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtStickyProps } from './types'
import { stickyClass } from './variants'

const props = withDefaults(defineProps<PrtStickyProps>(), {
  top: '0px',
  z: 30,
  class: '',
})

const sentinel = shallowRef<HTMLElement | null>(null)
const stuck = ref(false)
// IO root — null = viewport (page scroll); resolved to the nearest scroll
// ancestor on mount so a sticky inside a scrollable panel works too
const root = shallowRef<HTMLElement | null>(null)

const topValue = computed(() =>
  typeof props.top === 'number' ? props.top + 'px' : props.top,
)

// the sentinel sits just above the sticky element; once it scrolls out of view
// past the top, the element is pinned. rootMargin offsets by the sticky `top`.
const rootMargin = computed(() => {
  const t = typeof props.top === 'number' ? props.top : Number.parseFloat(props.top) || 0
  return '-' + t + 'px 0px 0px 0px'
})

function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null
  while (p) {
    const oy = getComputedStyle(p).overflowY
    if (oy === 'auto' || oy === 'scroll') return p
    p = p.parentElement
  }
  return null // viewport
}

onMounted(() => {
  root.value = findScrollParent(sentinel.value)
})

useIntersectionObserver(
  sentinel,
  ([entry]) => {
    stuck.value = !entry.isIntersecting
  },
  { root, rootMargin: rootMargin.value, threshold: 0 },
)
</script>

<style scoped>
.prt-sticky {
  position: sticky;
  top: var(--prt-sticky-top, 0px);
  z-index: var(--prt-sticky-z, 30);
  /* reserve the hairline + a zero shadow at rest, so pinning only FADES color/
     shadow in — no width jump, no layout shift, nothing to flash. */
  border-bottom: 1px solid transparent;
  box-shadow: 0 0 0 0 transparent;
  /* targeted transition (NOT transition-all): only the stuck chrome animates,
     never scroll/pin-driven layout — that was the flashing-line glitch. */
  transition:
    background-color var(--motion-duration) var(--motion-ease),
    border-color var(--motion-duration) var(--motion-ease),
    box-shadow var(--motion-duration) var(--motion-ease);
}
/* baked stuck-state chrome — the whole reason this is a component.
   A header pins at the TOP, so it casts a downward-only drop shadow (NOT
   var(--shadow-raise), whose `0 0 0 1px var(--edge)` ring would also draw a
   hairline above the bar); the bottom hairline is the border-bottom color. */
.prt-sticky[data-stuck='true'] {
  background: var(--surface-1);
  border-bottom-color: var(--edge);
  box-shadow: 0 4px 8px -2px rgb(0 0 0 / 0.35);
}
</style>
