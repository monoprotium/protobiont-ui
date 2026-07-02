<!--
  PrtTransitionMask — splashscreen Mode B (in-app transition mask).
  An in-app overlay for the WAIT during a heavy route navigation. Drive it from
  v-model (router beforeEach → true, afterEach → false); it debounces fast
  navigations (delayMs), enforces a minimum display (minMs), and force-dismisses
  on a failsafe. Dismiss is a Vue <Transition> opacity fade (will-change +
  contain isolate the layer) — JS-managed display, NOT pure-CSS allow-discrete
  (FF Bug 1882408). reduced-motion collapses to instant.

  Same-document View Transitions smooth the FINAL cross-fade; wire them in the
  router (see README) — they FREEZE the DOM during the callback, so they can't
  replace this mask (which covers the wait).

  a11y: role=status + aria-busy + aria-live=polite, NO focus trap (passive).

  Adjust the PrtLoader import to your componentDir.
  Slots: brand (default geometric mark) · indicator (default PrtLoader)
  emits: update:modelValue · dismissed · error({ reason })
-->
<template>
  <Transition name="prt-mask" @after-leave="emit('dismissed')">
    <div
      v-if="visible"
      class="prt-mask"
      role="status"
      aria-busy="true"
      aria-live="polite"
      :data-seed="seed ?? undefined"
    >
      <div class="prt-mask__brand">
        <slot name="brand">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="10" y="10" width="28" height="28" stroke="currentColor" stroke-width="1.5" />
            <rect x="20" y="20" width="8" height="8" fill="currentColor" />
          </svg>
        </slot>
        <slot name="indicator"><PrtLoader /></slot>
        <span class="sr-only">{{ label }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
// adjust to your componentDir (prt init default: src/components/ui)
import { PrtLoader } from '@/components/ui/loader'
import type { PrtSeed } from '@/components/ui/_shared/types'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    seed?: PrtSeed
    /** debounce before showing — skips the flash on fast navigations */
    delayMs?: number
    /** minimum display once shown */
    minMs?: number
    /** hard ceiling */
    failsafeMs?: number
    label?: string
  }>(),
  { delayMs: 200, minMs: 400, failsafeMs: 8000, label: 'Loading…' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  dismissed: []
  error: [payload: { reason: 'failsafe-timeout' }]
}>()

const visible = ref(false)
let shownAt = 0
let showTimer: ReturnType<typeof setTimeout> | undefined
let failsafe: ReturnType<typeof setTimeout> | undefined

function clearTimers() {
  if (showTimer) clearTimeout(showTimer)
  if (failsafe) clearTimeout(failsafe)
  showTimer = undefined
  failsafe = undefined
}

function show() {
  if (visible.value) return
  visible.value = true
  shownAt = performance.now()
  failsafe = setTimeout(() => {
    emit('error', { reason: 'failsafe-timeout' })
    hide(true)
  }, props.failsafeMs)
}

function hide(force = false) {
  const elapsed = performance.now() - shownAt
  const wait = force ? 0 : Math.max(0, props.minMs - elapsed)
  setTimeout(() => {
    visible.value = false
    clearTimers()
    if (props.modelValue) emit('update:modelValue', false)
  }, wait)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      // debounce: only show if still requested after delayMs
      showTimer = setTimeout(show, props.delayMs)
    } else {
      if (showTimer) clearTimeout(showTimer)
      showTimer = undefined
      if (visible.value) hide()
    }
  },
  { immediate: true },
)

onBeforeUnmount(clearTimers)
</script>

<style scoped>
.prt-mask {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--seed-wash, var(--surface-0));
  color: var(--ink);
  /* isolate the compositor layer for a jank-free fade */
  will-change: opacity;
  contain: strict;
}
.prt-mask__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
/* JS-managed display via <Transition>; pure opacity (no allow-discrete) */
.prt-mask-enter-active,
.prt-mask-leave-active {
  transition: opacity 280ms cubic-bezier(0.2, 0, 0, 1);
}
.prt-mask-enter-from,
.prt-mask-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .prt-mask-enter-active,
  .prt-mask-leave-active {
    transition: none;
  }
}
</style>
