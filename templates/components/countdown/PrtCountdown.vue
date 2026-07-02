<!--
  PrtCountdown
  Two modes. Date-countdown: pass `to` (a target instant) — ticks toward it from
  mount. Interactive timer: pass `duration` (seconds) — start/pause/reset, default
  render is a mm:ss / h:mm:ss clock. Both recompute parts from the wall-clock delta
  each second, never a decremented counter (that drifts); VueUse useIntervalFn
  drives the tick with auto-cleanup.

  Slot contract:
    default — render the time. slot props:
      { days, hours, minutes, seconds, clock, done, running, start, pause, reset, toggle }
  emits: change (parts every tick), end (once, at zero)
  exposes: start(seconds?), pause(), reset(seconds?), toggle(), running
-->
<template>
  <div :data-seed="seed ?? undefined" :class="cx(countdownRootClass, props.class)">
    <time :datetime="iso" :class="countdownRowClass">
      <slot
        :days="parts.days"
        :hours="parts.hours"
        :minutes="parts.minutes"
        :seconds="parts.seconds"
        :clock="clock"
        :done="done"
        :running="running"
        :start="start"
        :pause="pause"
        :reset="reset"
        :toggle="toggle"
      >
        <!-- duration timer → a single clock; date countdown → unit blocks -->
        <span v-if="isDuration" :class="countdownClockClass">{{ clock }}</span>
        <template v-else>
          <span v-for="unit in units" :key="unit.key" class="flex flex-col items-center">
            <span :class="countdownNumClass">{{ pad(unit.value) }}</span>
            <span :class="countdownLabelClass">{{ unit.label }}</span>
          </span>
        </template>
      </slot>
    </time>

    <div v-if="controls && isDuration" :class="countdownControlsClass">
      <PrtBtn :seed="seed" size="sm" @click="toggle">
        <template #prepend>
          <span :class="running ? 'i-lucide-pause' : 'i-lucide-play'" class="h-4 w-4" aria-hidden="true" />
        </template>
        {{ startBtnLabel }}
      </PrtBtn>
      <PrtBtn variant="ghost" size="sm" @click="reset()">
        <template #prepend><span class="i-lucide-rotate-ccw h-4 w-4" aria-hidden="true" /></template>
        {{ resetLabel }}
      </PrtBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import { PrtBtn } from '../btn'
import { cx } from '../_shared/cx'
import type { PrtCountdownProps } from './types'
import {
  countdownClockClass,
  countdownControlsClass,
  countdownLabelClass,
  countdownNumClass,
  countdownRootClass,
  countdownRowClass,
} from './variants'

const props = withDefaults(defineProps<PrtCountdownProps>(), {
  controls: false,
  unitLabels: () => ({
    days: 'days',
    hours: 'hrs',
    minutes: 'min',
    seconds: 'sec',
  }),
  startLabel: 'Start',
  pauseLabel: 'Pause',
  resumeLabel: 'Resume',
  resetLabel: 'Reset',
  class: '',
})

const emit = defineEmits<{
  change: [parts: { days: number; hours: number; minutes: number; seconds: number }]
  end: []
}>()

const isDuration = computed(() => props.duration != null)
const fullMs = computed(() => Math.max(0, props.duration ?? 0) * 1000)
const fixedTargetMs = computed(() => new Date(props.to ?? Number.NaN).getTime())

const now = ref(Date.now())
const running = ref(false)
let endAt = 0 // absolute instant we count to while running (duration mode)
const pausedRemaining = ref(fullMs.value) // ms left while stopped (duration mode)

// remaining ms: date mode = target − now; duration mode = endAt − now (running)
// or the frozen remainder (stopped)
const remainingMs = computed(() => {
  if (!isDuration.value) return Math.max(0, fixedTargetMs.value - now.value)
  return running.value ? Math.max(0, endAt - now.value) : pausedRemaining.value
})

const parts = computed(() => {
  const r = Math.floor(remainingMs.value / 1000)
  return {
    days: Math.floor(r / 86400),
    hours: Math.floor((r % 86400) / 3600),
    minutes: Math.floor((r % 3600) / 60),
    seconds: r % 60,
  }
})
const done = computed(() => remainingMs.value <= 0)

// compact clock that drops empty leading units (m:ss → h:mm:ss → d:hh:mm:ss)
const clock = computed(() => {
  const { days, hours, minutes, seconds } = parts.value
  if (days > 0) return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`
  return `${minutes}:${pad(seconds)}`
})

const iso = computed(() => {
  const t = isDuration.value ? (running.value ? endAt : 0) : fixedTargetMs.value
  return Number.isFinite(t) && t > 0 ? new Date(t).toISOString() : undefined
})

const units = computed(() => [
  { key: 'days', value: parts.value.days, label: props.unitLabels.days },
  { key: 'hours', value: parts.value.hours, label: props.unitLabels.hours },
  { key: 'minutes', value: parts.value.minutes, label: props.unitLabels.minutes },
  { key: 'seconds', value: parts.value.seconds, label: props.unitLabels.seconds },
])

const startBtnLabel = computed(() => {
  if (running.value) return props.pauseLabel
  // a partially-elapsed timer resumes; a full/zeroed one starts
  if (pausedRemaining.value > 0 && pausedRemaining.value < fullMs.value) return props.resumeLabel
  return props.startLabel
})

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function tick() {
  now.value = Date.now()
  emit('change', parts.value)
  if (done.value) {
    timer.pause()
    running.value = false
    if (isDuration.value) pausedRemaining.value = 0
    emit('end')
  }
}

// Date mode is a live clock to a fixed instant → auto-start the tick at creation
// (useIntervalFn's `immediate` runs `resume()` when `isClient`). Duration mode is
// created stopped and resumed by start() on a user action.
//
// NB: `dateAutoRun` deliberately does NOT consult `props.autostart`. `autostart`
// is a Boolean prop, and Vue casts an ABSENT Boolean prop to `false` (not
// undefined) — so `props.autostart ?? true` is `false` when the prop is omitted,
// which froze every date countdown (immediate:false → never started). A date
// countdown is inherently live, so it always auto-starts; `autostart` only opts a
// DURATION timer in (there, absent → false is exactly the wanted default).
const dateAutoRun = props.duration == null
const timer = useIntervalFn(tick, 1000, { immediate: dateAutoRun })

// ── interactive controls (duration mode) ─────────────────────────────────────
function start(seconds?: number) {
  if (!isDuration.value) return
  if (seconds != null) pausedRemaining.value = Math.max(0, seconds) * 1000
  if (running.value || pausedRemaining.value <= 0) return
  now.value = Date.now()
  endAt = now.value + pausedRemaining.value
  running.value = true
  timer.resume()
}
function pause() {
  if (!isDuration.value || !running.value) return
  pausedRemaining.value = Math.max(0, endAt - Date.now())
  running.value = false
  timer.pause()
}
function toggle() {
  running.value ? pause() : start()
}
function reset(seconds?: number) {
  timer.pause()
  running.value = false
  pausedRemaining.value = Math.max(0, seconds ?? props.duration ?? 0) * 1000
  now.value = Date.now()
  emit('change', parts.value)
}

defineExpose({ start, pause, reset, toggle, running })

// duration-mode autostart (opt-in) — date mode already auto-started via immediate
if (isDuration.value && props.autostart) start()
</script>
