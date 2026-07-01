<!--
  PrtScrollArea
  Scoped overlay scrollbar (Tier 1): a native overflow viewport with its real bar
  hidden + a token-driven overlay thumb synced from the scroll metrics. The
  controlled answer to Firefox's GTK overlay cursor-repulsion — no native bar to
  hover-expand, deterministic thumb footprint, so the geometry stays stable in
  Chrome and Firefox. Native scroll physics (wheel, momentum, touch, keyboard) are
  never intercepted — the engine only reads scroll and writes scrollTop on a thumb
  drag (no scroll-jacking). The Tier-0 `.prt-scroll*` utilities cover trivial panes;
  reach for PrtScrollArea when the bar must be deterministic.

  The consumer sets the box height/width via `class` (e.g. class="h-80").

  Slot contract:
    default — the scrollable content
-->
<template>
  <component
    :is="tag"
    :class="cx('prt-scroll-area relative overflow-hidden', props.class)"
    :style="rootStyle"
    @pointerenter="setHovered(true)"
    @pointerleave="setHovered(false)"
  >
    <div
      ref="viewport"
      class="prt-scroll-area__viewport h-full w-full overflow-auto"
      :tabindex="0"
      role="group"
      :aria-label="label"
    >
      <div ref="content">
        <slot />
      </div>
    </div>

    <div
      v-if="showY"
      :class="cx(scrollBarVariants({ orientation: 'vertical' }), visible ? 'opacity-100' : 'opacity-0 pointer-events-none')"
      :style="barYStyle"
      aria-hidden="true"
    >
      <div
        :class="scrollThumbVariants({ orientation: 'vertical' })"
        :style="thumbYStyle"
        @pointerdown="onThumbPointerDown($event, 'y')"
      />
    </div>

    <div
      v-if="showX"
      :class="cx(scrollBarVariants({ orientation: 'horizontal' }), visible ? 'opacity-100' : 'opacity-0 pointer-events-none')"
      :style="barXStyle"
      aria-hidden="true"
    >
      <div
        :class="scrollThumbVariants({ orientation: 'horizontal' })"
        :style="thumbXStyle"
        @pointerdown="onThumbPointerDown($event, 'x')"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, shallowRef, type CSSProperties } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtScrollAreaProps } from './types'
import { useScrollbar } from './useScrollbar'
import { scrollBarVariants, scrollThumbVariants } from './variants'

const props = withDefaults(defineProps<PrtScrollAreaProps>(), {
  orientation: 'vertical',
  autoHide: 'never',
  hideDelay: 600,
  size: 'base',
  tag: 'div',
  label: 'Scrollable region',
  class: '',
})

const viewport = shallowRef<HTMLElement | null>(null)
const content = shallowRef<HTMLElement | null>(null)

const { showY, showX, visible, thumbYStyle, thumbXStyle, onThumbPointerDown, setHovered } =
  useScrollbar(viewport, content, {
    orientation: () => props.orientation,
    autoHide: () => props.autoHide,
    hideDelay: () => props.hideDelay,
  })

const sizeMap = { sm: '0.375rem', base: '0.4375rem', lg: '0.5625rem' } as const
const rootStyle = computed<CSSProperties>(() => ({ '--scrollbar-size': sizeMap[props.size] }))

// the bar spans the track; in 'both' mode each bar yields the corner to the other
const barYStyle = computed<CSSProperties>(() => ({
  width: 'var(--scrollbar-size)',
  bottom: showX.value ? 'var(--scrollbar-size)' : '0',
}))
const barXStyle = computed<CSSProperties>(() => ({
  height: 'var(--scrollbar-size)',
  right: showY.value ? 'var(--scrollbar-size)' : '0',
}))
</script>

<style scoped>
/* hide the native bar in BOTH engines — we draw our own overlay thumb.
   <style> is sanctioned here: scrollbar pseudo-elements aren't utilities. */
.prt-scroll-area__viewport {
  scrollbar-width: none; /* Firefox */
}
.prt-scroll-area__viewport::-webkit-scrollbar {
  display: none; /* Chromium */
}
@media (prefers-reduced-motion: reduce) {
  .prt-scroll-area__thumb {
    transition: none;
  }
}
</style>
