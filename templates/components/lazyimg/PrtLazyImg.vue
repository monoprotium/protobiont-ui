<!--
  PrtLazyImg
  The house image primitive: native lazy loading + reserved aspect box (no layout
  shift) + blur-up / skeleton placeholder + fade-in + error state. Uses
  `loading="lazy"`, no JS observer.

  Slot contract:
    error — replaces the default error state. Slot props: { retry: () => void }
-->
<template>
  <div
    :data-seed="seed ?? undefined"
    :style="wrapperStyle"
    :class="cx(lazyImgVariants({ rounded }), props.class)"
  >
    <!-- blur-up: the consumer's tiny inline LQIP, rendered blurred until load -->
    <img
      v-if="placeholder && !errored"
      :src="placeholder"
      alt=""
      aria-hidden="true"
      :class="[
        lazyImgMediaVariants({ fit, reserved: true }),
        'scale-110 blur-md',
        loaded ? 'opacity-0' : 'opacity-100',
      ]"
    />
    <!-- skeleton: seed-tinted shimmer when there is no placeholder -->
    <div
      v-else-if="!loaded && !errored"
      aria-hidden="true"
      class="absolute inset-0 animate-pulse bg-[var(--seed-body,var(--surface-2))]"
    />

    <!-- the real image: native lazy, fades in on load -->
    <img
      v-if="!errored"
      :key="reloadKey"
      :src="src"
      :alt="alt"
      :loading="loadingAttr"
      decoding="async"
      :class="[
        lazyImgMediaVariants({ fit, reserved }),
        loaded ? 'opacity-100' : 'opacity-0',
      ]"
      @load="onLoad"
      @error="onError"
    />

    <!-- error state: quiet, with a retry that re-fetches the source -->
    <div
      v-else
      :class="[
        'flex flex-col items-center justify-center gap-2 p-4 text-center text-ink-faint',
        reserved ? 'absolute inset-0' : 'min-h-32',
      ]"
    >
      <slot name="error" :retry="retry">
        <span class="i-lucide-image-off w-6 h-6" aria-hidden="true" />
        <span class="text-xs">{{ errorText }}</span>
        <button
          type="button"
          class="rounded-control bg-transparent text-xs text-ink-muted underline underline-offset-2 prt-motion-colors prt-ring hover:text-ink"
          @click="retry"
        >
          {{ retryText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtLazyImgProps } from './types'
import { lazyImgMediaVariants, lazyImgVariants } from './variants'

const props = withDefaults(defineProps<PrtLazyImgProps>(), {
  fit: 'cover',
  rounded: 'surface',
  eager: false,
  fill: false,
  errorText: 'Image unavailable',
  retryText: 'Retry',
  class: '',
})

const emit = defineEmits<{
  load: []
  error: []
}>()

const loaded = ref(false)
const errored = ref(false)
// bumping this remounts the <img> so retry re-fetches the same src
const reloadKey = ref(0)

// reserved = the image FILLS the box (absolute + object-fit): either because an
// aspect ratio reserves it, or because the consumer sized the wrapper (`fill`)
const reserved = computed(() => Boolean(props.aspect) || props.fill)
const loadingAttr = computed(() => (props.eager ? 'eager' : 'lazy'))
const wrapperStyle = computed(() =>
  props.aspect ? { aspectRatio: props.aspect } : undefined,
)

// a new source restarts the load lifecycle
watch(
  () => props.src,
  () => {
    loaded.value = false
    errored.value = false
  },
)

function onLoad() {
  loaded.value = true
  emit('load')
}

function onError() {
  errored.value = true
  emit('error')
}

function retry() {
  errored.value = false
  loaded.value = false
  reloadKey.value += 1
}
</script>
