import { useEventListener, useResizeObserver } from '@vueuse/core'
import { computed, ref, type CSSProperties, type Ref } from 'vue'
import type { PrtScrollAreaAutoHide, PrtScrollAreaOrientation } from './types'

// Headless scrollbar engine for PrtScrollArea. The pattern (Radix/reka-ui
// lineage): keep a NATIVE overflow viewport with its real bar hidden, and draw
// a token-driven overlay thumb whose geometry is synced FROM the scroll
// metrics. We only ever READ scroll position and WRITE scrollTop/Left on a
// thumb drag — never intercept wheel/touch/keyboard (no scroll-jacking), so
// momentum, trackpad inertia, keyboard paging and touch stay native. This also
// kills Firefox's GTK overlay cursor-repulsion: there is no native bar to
// hover-expand, and our thumb's footprint never changes on pointer-approach.
//
// Perf: dims (clientH/scrollH) are read in ResizeObserver, NOT in the scroll
// hot path; the scroll handler reads only scrollTop/Left and is rAF-coalesced +
// passive, so it never forces a synchronous layout. The thumb moves via
// `transform` (compositor), never `top`.

const MIN_THUMB = 24 // px — keep the thumb grabbable on very long content

interface UseScrollbarOptions {
  orientation: () => PrtScrollAreaOrientation
  autoHide: () => PrtScrollAreaAutoHide
  hideDelay: () => number
}

export function useScrollbar(
  viewport: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
  options: UseScrollbarOptions,
) {
  // cached geometry — written by ResizeObserver + the scroll handler
  const clientH = ref(0)
  const scrollH = ref(0)
  const clientW = ref(0)
  const scrollW = ref(0)
  const top = ref(0)
  const left = ref(0)

  const hovered = ref(false)
  const scrolling = ref(false)
  const dragging = ref(false)

  let raf = 0
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  function measure() {
    const v = viewport.value
    if (!v) return
    clientH.value = v.clientHeight
    scrollH.value = v.scrollHeight
    clientW.value = v.clientWidth
    scrollW.value = v.scrollWidth
    top.value = v.scrollTop
    left.value = v.scrollLeft
  }

  // re-measure on viewport resize AND content growth (virtualized/async content)
  useResizeObserver(viewport, measure)
  useResizeObserver(content, measure)

  // scroll hot path: read only scrollTop/Left, rAF-coalesced, passive
  useEventListener(
    viewport,
    'scroll',
    () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const v = viewport.value
        if (!v) return
        top.value = v.scrollTop
        left.value = v.scrollLeft
      })
      if (options.autoHide() === 'scroll') {
        scrolling.value = true
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => {
          scrolling.value = false
        }, options.hideDelay())
      }
    },
    { passive: true },
  )

  const overflowY = computed(() => scrollH.value - clientH.value > 1)
  const overflowX = computed(() => scrollW.value - clientW.value > 1)
  const showY = computed(() => options.orientation() !== 'horizontal' && overflowY.value)
  const showX = computed(() => options.orientation() !== 'vertical' && overflowX.value)

  const visible = computed(() => {
    const mode = options.autoHide()
    if (mode === 'hover') return hovered.value || dragging.value
    if (mode === 'scroll') return scrolling.value || dragging.value
    return true
  })

  const thumbH = computed(() =>
    scrollH.value > 0
      ? Math.max(MIN_THUMB, (clientH.value * clientH.value) / scrollH.value)
      : 0,
  )
  const thumbW = computed(() =>
    scrollW.value > 0
      ? Math.max(MIN_THUMB, (clientW.value * clientW.value) / scrollW.value)
      : 0,
  )

  const thumbYStyle = computed<CSSProperties>(() => {
    const maxScroll = scrollH.value - clientH.value
    const offset =
      maxScroll > 0 ? (top.value / maxScroll) * (clientH.value - thumbH.value) : 0
    return { height: `${thumbH.value}px`, transform: `translateY(${offset}px)` }
  })
  const thumbXStyle = computed<CSSProperties>(() => {
    const maxScroll = scrollW.value - clientW.value
    const offset =
      maxScroll > 0 ? (left.value / maxScroll) * (clientW.value - thumbW.value) : 0
    return { width: `${thumbW.value}px`, transform: `translateX(${offset}px)` }
  })

  // drag-to-scroll: writes scrollTop/Left ONLY; the native scroll event then
  // redraws the thumb (single source of truth). 1:1 with the cursor.
  let startPointer = 0
  let startScroll = 0
  let axis: 'y' | 'x' = 'y'

  function onThumbPointerDown(e: PointerEvent, which: 'y' | 'x') {
    if (e.button !== 0) return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    axis = which
    dragging.value = true
    startPointer = which === 'y' ? e.clientY : e.clientX
    startScroll = which === 'y' ? top.value : left.value
  }

  useEventListener(window, 'pointermove', (e: PointerEvent) => {
    if (!dragging.value) return
    const v = viewport.value
    if (!v) return
    if (axis === 'y') {
      const range = clientH.value - thumbH.value
      const delta = e.clientY - startPointer
      v.scrollTop =
        range > 0 ? startScroll + (delta / range) * (scrollH.value - clientH.value) : startScroll
    } else {
      const range = clientW.value - thumbW.value
      const delta = e.clientX - startPointer
      v.scrollLeft =
        range > 0 ? startScroll + (delta / range) * (scrollW.value - clientW.value) : startScroll
    }
  })
  useEventListener(window, 'pointerup', () => {
    dragging.value = false
  })

  function setHovered(v: boolean) {
    hovered.value = v
  }

  return {
    showY,
    showX,
    visible,
    thumbYStyle,
    thumbXStyle,
    onThumbPointerDown,
    setHovered,
  }
}
