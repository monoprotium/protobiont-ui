<!--
  PrtInfiniteScroll
  The load-more engine — a behavior component: one default slot wrapping anything
  (canonically a PrtListing), an IntersectionObserver sentinel after it, a guarded
  `load-more` emit. No layouts (the listing's job), no fixed-height container: real
  pages scroll the page, an embedded scroll area is the consumer's div, and
  rootMargin + scrollMargin cover both with one observer.
  Lifecycle contract: emit → consumer sets `loading` true → appends items → flips
  `loading` false → the sentinel is re-checked on nextTick (short first pages
  re-emit until the viewport fills); `endReached` disconnects. Sync consumers that
  never touch `loading` re-arm on nextTick after each emit.
  Slot contract:
    default — the content
    loading — replaces the default PrtLoader row (shown while `loading`)
    end     — replaces the default endLabel line (shown when `endReached`)
-->
<template>
  <div :class="cx('w-full', props.class)">
    <slot />
    <div ref="sentinel" class="h-px w-full" aria-hidden="true" />
    <div v-if="loading">
      <slot name="loading">
        <div :class="infiniteScrollLoadingVariants()">
          <PrtLoader />
        </div>
      </slot>
    </div>
    <div v-else-if="endReached">
      <slot name="end">
        <p :class="infiniteScrollEndVariants()">{{ endLabel }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { cx } from '../_shared/cx'
import { PrtLoader } from '../loader'
import type { PrtInfiniteScrollProps } from './types'
import {
  infiniteScrollEndVariants,
  infiniteScrollLoadingVariants,
} from './variants'

const props = withDefaults(defineProps<PrtInfiniteScrollProps>(), {
  loading: false,
  endReached: false,
  margin: '200px',
  autoload: true,
  empty: false,
  endLabel: 'No more items',
  class: '',
})

const emit = defineEmits<{
  'load-more': []
}>()

const sentinel = shallowRef<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let intersecting = false
// true between an emit and the consumer's loading false-flip (or the
// nextTick re-arm for sync consumers) — the double-emit guard
let pending = false

function maybeLoad() {
  if (pending || props.loading || props.endReached) return
  if (props.empty && !props.autoload) return
  pending = true
  emit('load-more')
  // sync consumers never flip `loading` — re-arm once their append
  // has rendered; async consumers are handled by the loading watcher
  nextTick(() => {
    if (!props.loading) {
      pending = false
      recheck()
    }
  })
}

function onIntersect(entries: IntersectionObserverEntry[]) {
  intersecting = entries[entries.length - 1]?.isIntersecting ?? false
  if (intersecting) maybeLoad()
}

// force a fresh intersection evaluation (IO only fires on CHANGES —
// a still-visible sentinel after an append would otherwise stay silent)
function recheck() {
  if (!observer || !sentinel.value) return
  observer.unobserve(sentinel.value)
  observer.observe(sentinel.value)
}

function setup() {
  teardown()
  if (!sentinel.value || props.endReached) return
  // scrollMargin (Cr 120 / Fx 141) expands clipping scroll containers the
  // same way rootMargin expands the viewport — not in TS lib.dom yet
  observer = new IntersectionObserver(onIntersect, {
    rootMargin: props.margin,
    scrollMargin: props.margin,
  } as IntersectionObserverInit)
  observer.observe(sentinel.value)
}

function teardown() {
  observer?.disconnect()
  observer = null
  intersecting = false
}

watch(
  () => props.loading,
  (now, was) => {
    if (was && !now) {
      pending = false
      // the consumer may flip `loading` before items render — re-check
      // on nextTick so the observer sees the settled layout
      nextTick(recheck)
    }
  },
)

watch(
  () => props.endReached,
  (ended) => {
    pending = false
    if (ended) teardown()
    else nextTick(setup)
  },
)

watch(
  () => props.margin,
  () => nextTick(setup),
)

onMounted(() => {
  setup()
  if (props.autoload && props.empty) maybeLoad()
})

onBeforeUnmount(teardown)
</script>
