<!--
  PrtAudioPlayer
  Transport on VueUse useMediaControls (reactive playing/currentTime/duration/
  volume/muted, with cleanup); seek + volume on PrtSlider; Media Session for OS
  media keys; opt-in Web-Audio waveform (the raw 60fps path — AnalyserNode →
  canvas → rAF, not reactive). src is a prop, never a hardcoded sample.

  Slot contract:
    controls — replace the default transport row (slot props { playing, toggle })
-->
<template>
  <div
    ref="rootEl"
    :data-seed="seed ?? undefined"
    :class="cx(rootClass, props.class)"
  >
    <audio
      ref="audioEl"
      :src="src"
      :loop="loop"
      :crossorigin="crossorigin"
      preload="metadata"
      class="hidden"
    />

    <div v-if="!compact && (title || artist)" class="flex flex-col">
      <span v-if="title" class="text-sm font-medium text-ink">{{ title }}</span>
      <span v-if="artist" class="text-xs text-ink-muted">{{ artist }}</span>
    </div>

    <!-- SoundCloud-style peak waveform: the decoded track's amplitude drawn
         once, then a played/unplayed split that doubles AS the seek bar
         (click/drag to scrub). Replaces the separate seek slider in this mode,
         so the two controls never fight over currentTime (the seek glitch). -->
    <canvas
      v-if="!compact && waveform"
      ref="canvasEl"
      class="h-16 w-full cursor-pointer touch-none select-none rounded-control"
      role="slider"
      :aria-label="seekLabel"
      :aria-valuemin="0"
      :aria-valuemax="Math.round(displayDuration) || 0"
      :aria-valuenow="Math.round(currentTime)"
      :aria-valuetext="fmt(currentTime) + ' / ' + fmt(displayDuration)"
      tabindex="0"
      @pointerdown="onWavePointerdown"
      @pointermove="onWavePointermove"
      @pointerup="onWavePointerup"
      @keydown="onWaveKeydown"
    />

    <slot name="controls" :playing="playing" :toggle="toggle" :compact="compact">
      <!-- COMPACT: a single slim row (the root IS the flex row). play · wide
           seek · combined time · volume — a web-player bottom bar. -->
      <template v-if="compact">
        <PrtBtn
          v-if="skip"
          variant="ghost"
          size="sm"
          :disabled="!hasPrev"
          :aria-label="prevLabel"
          @click="prev"
        >
          <span class="i-lucide-skip-back h-4 w-4" aria-hidden="true" />
        </PrtBtn>

        <PrtBtn
          variant="ghost"
          size="sm"
          :seed="seed"
          :aria-label="playing ? pauseLabel : playLabel"
          @click="toggle"
        >
          <span
            :class="playing ? 'i-lucide-pause' : 'i-lucide-play'"
            class="h-5 w-5"
            aria-hidden="true"
          />
        </PrtBtn>

        <PrtBtn
          v-if="skip"
          variant="ghost"
          size="sm"
          :disabled="!hasNext"
          :aria-label="nextLabel"
          @click="next"
        >
          <span class="i-lucide-skip-forward h-4 w-4" aria-hidden="true" />
        </PrtBtn>

        <!-- seek GROWS via flex (flex/width don't conflict in cx); min-w keeps
             the track from collapsing to 0 (→ phaseAt ÷0 → NaN) when cramped. -->
        <div class="min-w-16 flex-1">
          <PrtSlider
            :model-value="currentTime"
            :min="0"
            :max="displayDuration || 0"
            :step="0.1"
            :format="fmt"
            @update:model-value="onSeek"
          />
        </div>

        <span :class="cx(audioTimeClass, 'shrink-0 whitespace-nowrap')">
          {{ fmt(currentTime) }} <span class="text-ink-faint">/</span> {{ fmt(displayDuration) }}
        </span>

        <PrtBtn
          variant="ghost"
          size="sm"
          :aria-label="muted || volume === 0 ? unmuteLabel : muteLabel"
          @click="toggleMute"
        >
          <span
            :class="muted || volume === 0 ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
            class="h-5 w-5"
            aria-hidden="true"
          />
        </PrtBtn>
        <div class="w-20 shrink-0">
          <PrtSlider
            :model-value="muted ? 0 : volume"
            :min="0"
            :max="1"
            :step="0.01"
            @update:model-value="onVolume"
          />
        </div>
      </template>

      <!-- DEFAULT (composed two-tier) -->
      <template v-else>
        <!-- Seek owns its own full-width row so the scrub bar is always the
             dominant control. In waveform mode the canvas above IS the seek. -->
        <PrtSlider
          v-if="!waveform"
          class="w-full"
          :model-value="currentTime"
          :min="0"
          :max="displayDuration || 0"
          :step="0.1"
          :format="fmt"
          @update:model-value="onSeek"
        />

        <div class="flex items-center gap-3">
          <PrtBtn
            v-if="skip"
            variant="ghost"
            size="sm"
            :disabled="!hasPrev"
            :aria-label="prevLabel"
            @click="prev"
          >
            <span class="i-lucide-skip-back h-4 w-4" aria-hidden="true" />
          </PrtBtn>

          <PrtBtn
            variant="ghost"
            size="sm"
            :seed="seed"
            :aria-label="playing ? pauseLabel : playLabel"
            @click="toggle"
          >
            <span
              :class="playing ? 'i-lucide-pause' : 'i-lucide-play'"
              class="h-5 w-5"
              aria-hidden="true"
            />
          </PrtBtn>

          <PrtBtn
            v-if="skip"
            variant="ghost"
            size="sm"
            :disabled="!hasNext"
            :aria-label="nextLabel"
            @click="next"
          >
            <span class="i-lucide-skip-forward h-4 w-4" aria-hidden="true" />
          </PrtBtn>

          <span :class="audioTimeClass">
            {{ fmt(currentTime) }} <span class="text-ink-faint">/</span> {{ fmt(displayDuration) }}
          </span>

          <!-- Volume group: secondary, pinned right -->
          <div class="ml-auto flex items-center gap-2">
            <PrtBtn
              variant="ghost"
              size="sm"
              :aria-label="muted || volume === 0 ? unmuteLabel : muteLabel"
              @click="toggleMute"
            >
              <span
                :class="muted || volume === 0 ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
                class="h-5 w-5"
                aria-hidden="true"
              />
            </PrtBtn>
            <!-- Fixed-width WRAPPER, not class="w-N" on the slider: cx is plain
                 clsx (no tailwind-merge), so a width class would just append to
                 the root's baked-in w-full instead of overriding it — the slider
                 would collapse to ~0 and `phaseAt` would divide by zero (NaN). -->
            <div class="w-28">
              <PrtSlider
                :model-value="muted ? 0 : volume"
                :min="0"
                :max="1"
                :step="0.01"
                @update:model-value="onVolume"
              />
            </div>
          </div>
        </div>
      </template>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useEventListener, useMediaControls } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { PrtBtn } from '../btn'
import { PrtSlider } from '../slider'
import { cx } from '../_shared/cx'
import type { PrtAudioPlayerProps } from './types'
import {
  audioPlayerBareClass,
  audioPlayerBareCompactClass,
  audioPlayerClass,
  audioPlayerCompactClass,
  audioTimeClass,
} from './variants'

const props = withDefaults(defineProps<PrtAudioPlayerProps>(), {
  autoplay: false,
  loop: false,
  waveform: false,
  compact: false,
  bare: false,
  mediaSession: true,
  playLabel: 'Play',
  pauseLabel: 'Pause',
  muteLabel: 'Mute',
  unmuteLabel: 'Unmute',
  seekLabel: 'Seek',
  skip: false,
  hasPrev: true,
  hasNext: true,
  playOnSkip: true,
  prevLabel: 'Previous track',
  nextLabel: 'Next track',
  class: '',
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number]
  prev: []
  next: []
}>()

const rootEl = shallowRef<HTMLElement | null>(null)
const audioEl = shallowRef<HTMLAudioElement | null>(null)
const canvasEl = shallowRef<HTMLCanvasElement | null>(null)

const { playing, currentTime, duration, volume, muted, ended } =
  useMediaControls(audioEl)

const rootClass = computed(() =>
  props.bare
    ? props.compact
      ? audioPlayerBareCompactClass
      : audioPlayerBareClass
    : props.compact
      ? audioPlayerCompactClass
      : audioPlayerClass,
)

// total length for the readout + seek max: prefer the media's own duration, fall
// back to the `duration` prop when the source has none (MediaRecorder blobs
// report Infinity — that was the recorder's 0:00 bug).
const displayDuration = computed(() =>
  Number.isFinite(duration.value) && duration.value > 0
    ? duration.value
    : (props.duration ?? 0),
)

function toggle() {
  playing.value = !playing.value
}
function toggleMute() {
  muted.value = !muted.value
}
// prev/next stay decoupled: the player is single-track (one src), these only
// EMIT — the consumer owns the playlist and swaps src (like the recorder's save).
// playOnSkip (default) starts the next track once the consumer's src lands; the
// button click is the user gesture that keeps it inside the autoplay policy.
let pendingPlay = false
function prev() {
  if (!props.hasPrev) return
  pendingPlay = props.playOnSkip
  emit('prev')
}
function next() {
  if (!props.hasNext) return
  pendingPlay = props.playOnSkip
  emit('next')
}
// post-flush so el.src is already swapped, then drive the ELEMENT directly: an
// immediate play() often races the new src's load and gets aborted (track lands
// paused at 0), so we also retry once on `canplay` when the new track is ready.
watch(
  () => props.src,
  () => {
    if (!pendingPlay) return
    pendingPlay = false
    const el = audioEl.value
    if (!el) return
    const start = () => void el.play().catch(() => {})
    el.addEventListener('canplay', start, { once: true })
    start()
  },
  { flush: 'post' },
)
function onSeek(v: number) {
  if (!Number.isFinite(v)) return // guard: slider can emit NaN before metadata loads (max 0)
  currentTime.value = v
}
function onVolume(v: number) {
  if (!Number.isFinite(v)) return // never write NaN into el.volume (it throws)
  volume.value = Math.min(1, Math.max(0, v))
  if (v > 0) muted.value = false
}

// mm:ss — also the slider readout / aria-valuetext
function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return m + ':' + String(sec).padStart(2, '0')
}

// ── events out ──────────────────────────────────────────────────────────────
watch(playing, (p) => emit(p ? 'play' : 'pause'))
watch(currentTime, (t) => emit('timeupdate', t))
watch(ended, (e) => {
  if (e) emit('ended')
})

// ── Media Session (feature-detected, additive — never load-bearing) ──────────
function syncMediaSession() {
  if (!props.mediaSession || typeof navigator === 'undefined') return
  if (!('mediaSession' in navigator)) return
  const ms = navigator.mediaSession
  ms.metadata = new window.MediaMetadata({
    title: props.title ?? '',
    artist: props.artist ?? '',
    artwork: props.artwork ? [{ src: props.artwork }] : [],
  })
  ms.setActionHandler('play', () => {
    playing.value = true
  })
  ms.setActionHandler('pause', () => {
    playing.value = false
  })
  ms.setActionHandler('seekbackward', (d) => {
    currentTime.value = Math.max(0, currentTime.value - (d.seekOffset || 10))
  })
  ms.setActionHandler('seekforward', (d) => {
    currentTime.value = currentTime.value + (d.seekOffset || 10)
  })
  ms.setActionHandler('seekto', (d) => {
    if (d.seekTime != null) currentTime.value = d.seekTime
  })
  // OS prev/next-track keys go through prev()/next() (same playOnSkip behavior);
  // null clears the handler when off / at a boundary
  ms.setActionHandler('previoustrack', props.skip && props.hasPrev ? prev : null)
  ms.setActionHandler('nexttrack', props.skip && props.hasNext ? next : null)
}
watch(
  () => [props.src, props.title, props.artist, props.artwork, props.skip, props.hasPrev, props.hasNext],
  syncMediaSession,
)

// ── Waveform: SoundCloud-style decoded PEAKS → canvas → rAF (NOT reactive) ────
// The whole track is fetched + decoded once into an amplitude profile; the
// canvas draws a played/unplayed split that doubles as the seek bar. The rAF
// loop only animates the progress split while playing — it never touches Vue
// reactivity (the sanctioned raw 60fps exception, CONVENTIONS § Dependencies).
const BUCKETS = 200 // amplitude samples across the width
const FALLBACK_PLAYED = '#1AC973' // identity emerald — canvas literal, never a class
let peaks: Float32Array | null = null
let rafId = 0
let scrubbing = false

function readVar(name: string) {
  const root = rootEl.value
  if (!root) return ''
  return getComputedStyle(root).getPropertyValue(name).trim()
}

// Fetch + decode the full track once, downsample to a peak profile, draw.
async function buildPeaks() {
  if (!props.waveform || typeof window === 'undefined') return
  peaks = null
  drawWaveform() // baseline while decoding
  try {
    const res = await fetch(props.src, { mode: 'cors' })
    const buf = await res.arrayBuffer()
    // OfflineAudioContext decodes WITHOUT starting realtime output — no
    // "AudioContext prevented from starting" autoplay-policy warning, no graph.
    const Offline =
      window.OfflineAudioContext || (window as any).webkitOfflineAudioContext
    if (!Offline) return
    const audio = await new Offline(1, 1, 44100).decodeAudioData(buf)
    const ch = audio.getChannelData(0)
    const block = Math.max(1, Math.floor(ch.length / BUCKETS))
    const out = new Float32Array(BUCKETS)
    let max = 0
    for (let i = 0; i < BUCKETS; i++) {
      let peak = 0
      const start = i * block
      for (let j = 0; j < block; j++) {
        const v = Math.abs(ch[start + j] || 0)
        if (v > peak) peak = v
      }
      out[i] = peak
      if (peak > max) max = peak
    }
    if (max > 0) for (let i = 0; i < BUCKETS; i++) out[i] /= max // normalize to fill
    peaks = out
  } catch {
    peaks = null // CORS/format failure → flat baseline, never throws into the app
  }
  drawWaveform()
}

function drawWaveform() {
  const c = canvasEl.value
  if (!c) return
  const g = c.getContext('2d')
  if (!g) return
  const dpr = window.devicePixelRatio || 1
  const w = c.clientWidth
  const h = c.clientHeight
  c.width = w * dpr
  c.height = h * dpr
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, w, h)

  const played = readVar('--seed') || readVar('--accent') || FALLBACK_PLAYED
  const idle = readVar('--ink-faint') || 'rgba(255,255,255,0.18)'
  const progress = displayDuration.value ? currentTime.value / displayDuration.value : 0
  const slot = w / BUCKETS
  const barW = Math.max(1, slot * 0.6)
  const mid = h / 2
  const minBar = 2

  for (let i = 0; i < BUCKETS; i++) {
    const amp = peaks ? peaks[i] : 0
    const barH = Math.max(minBar, amp * (h - minBar))
    g.fillStyle = (i + 0.5) / BUCKETS <= progress ? played : idle
    g.fillRect(i * slot + (slot - barW) / 2, mid - barH / 2, barW, barH)
  }
}

// progress animation: rAF while playing, single redraw on pause/seek
function loop() {
  drawWaveform()
  rafId = requestAnimationFrame(loop)
}
function startLoop() {
  if (!rafId) loop()
}
function stopLoop() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

// ── Waveform-as-seek: pointer + keyboard scrubbing on the canvas ─────────────
function seekAt(e: PointerEvent) {
  const c = canvasEl.value
  if (!c || !displayDuration.value) return
  const r = c.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  currentTime.value = ratio * displayDuration.value
}
function onWavePointerdown(e: PointerEvent) {
  scrubbing = true
  canvasEl.value?.setPointerCapture?.(e.pointerId)
  seekAt(e)
}
function onWavePointermove(e: PointerEvent) {
  if (scrubbing) seekAt(e)
}
function onWavePointerup() {
  scrubbing = false
}
function onWaveKeydown(e: KeyboardEvent) {
  const d = displayDuration.value || 0
  if (e.key === 'ArrowLeft') currentTime.value = Math.max(0, currentTime.value - 5)
  else if (e.key === 'ArrowRight') currentTime.value = Math.min(d, currentTime.value + 5)
  else if (e.key === 'Home') currentTime.value = 0
  else if (e.key === 'End') currentTime.value = d
  else return
  e.preventDefault()
}

watch(playing, (p) => {
  if (!props.waveform) return
  if (p) startLoop()
  else {
    stopLoop()
    drawWaveform()
  }
})
watch(currentTime, () => {
  if (props.waveform && !rafId) drawWaveform() // seek/skip while paused
})
watch(
  () => [props.src, props.waveform],
  () => {
    if (props.waveform) void buildPeaks()
  },
)
useEventListener('resize', () => {
  if (props.waveform) drawWaveform()
})

onMounted(() => {
  syncMediaSession()
  if (props.waveform) void buildPeaks()
  if (props.autoplay) playing.value = true
})

onBeforeUnmount(() => {
  stopLoop()
})
</script>
