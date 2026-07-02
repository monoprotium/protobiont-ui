<!--
  PrtAudioRecorder
  getUserMedia + MediaRecorder lifecycle, decoupled from app glue — output leaves
  through emits and the #actions slot, never hardwired destinations. Output is
  WebM/Opus (or the UA's Ogg/Opus); MediaRecorder makes no MP3, so the extension
  is derived from the actual Blob type, never named '.mp3'. Permission / device
  failures surface as reason codes. Opt-in live level meter is the raw 60fps
  AnalyserNode path. Playback before save reuses PrtAudioPlayer.

  emits: save(blob, meta), complete, error(reason)
-->
<template>
  <div
    ref="rootEl"
    :data-seed="seed ?? undefined"
    :data-state="state"
    :class="cx(compact ? audioRecorderCompactClass : audioRecorderClass, props.class)"
  >
    <div class="flex items-center gap-3">
      <span
        v-if="state === 'recording'"
        class="h-2.5 w-2.5 rounded-full bg-danger"
        aria-hidden="true"
      />
      <span :class="recorderTimeClass">{{ fmt(elapsed) }}</span>
      <span v-if="maxDuration" class="text-xs font-mono text-ink-faint">
        / {{ fmt(maxDuration) }}
      </span>

      <canvas
        v-if="meter && (state === 'recording' || state === 'paused')"
        ref="canvasEl"
        class="h-6 flex-1 rounded-control bg-surface-2"
        aria-hidden="true"
      />
      <span v-else class="flex-1" />

      <PrtBtn
        v-if="state === 'idle' || state === 'requesting'"
        :seed="seed"
        size="sm"
        :loading="state === 'requesting'"
        :aria-label="recordLabel"
        @click="start"
      >
        <span class="i-lucide-mic h-4 w-4" aria-hidden="true" />
      </PrtBtn>

      <template v-if="state === 'recording'">
        <PrtBtn variant="ghost" size="sm" :aria-label="pauseLabel" @click="pause">
          <span class="i-lucide-pause h-4 w-4" aria-hidden="true" />
        </PrtBtn>
        <PrtBtn seed="8" size="sm" :aria-label="stopLabel" @click="stop">
          <span class="i-lucide-square h-4 w-4" aria-hidden="true" />
        </PrtBtn>
      </template>

      <template v-if="state === 'paused'">
        <PrtBtn :seed="seed" size="sm" :aria-label="resumeLabel" @click="resume">
          <span class="i-lucide-play h-4 w-4" aria-hidden="true" />
        </PrtBtn>
        <PrtBtn seed="8" size="sm" :aria-label="stopLabel" @click="stop">
          <span class="i-lucide-square h-4 w-4" aria-hidden="true" />
        </PrtBtn>
      </template>
    </div>

    <!-- stopped → review + save / export / host actions / erase -->
    <template v-if="state === 'stopped' && blobUrl">
      <!-- review = a bare compact strip: no nested box, blends into the recorder
           container; :duration is the exact recorded length (the blob ships none). -->
      <PrtAudioPlayer
        v-if="playback"
        :src="blobUrl"
        :seed="seed"
        :duration="elapsed"
        compact
        bare
      />
      <div class="flex flex-wrap items-center gap-2">
        <PrtBtn :seed="seed" size="sm" @click="save">
          <template #prepend><span class="i-lucide-save h-4 w-4" aria-hidden="true" /></template>
          {{ saveLabel }}
        </PrtBtn>
        <PrtBtn v-if="downloadable" variant="ghost" size="sm" @click="download">
          <template #prepend><span class="i-lucide-download h-4 w-4" aria-hidden="true" /></template>
          {{ exportLabel }}
        </PrtBtn>
        <!-- host-injected actions (transcribe, send to API, pipeline…): the
             recorder lives inside a bigger interface, so it hands the take out
             rather than hardwiring destinations. -->
        <slot name="actions" :blob="recordedBlob" :meta="recordedMeta" :download="download" />
        <PrtBtn variant="ghost" size="sm" @click="erase">
          <template #prepend><span class="i-lucide-trash-2 h-4 w-4" aria-hidden="true" /></template>
          {{ eraseLabel }}
        </PrtBtn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn, useObjectUrl } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { PrtAudioPlayer } from '../audioplayer'
import { PrtBtn } from '../btn'
import { cx } from '../_shared/cx'
import type {
  PrtAudioRecorderMeta,
  PrtAudioRecorderProps,
  PrtRecorderError,
  PrtRecorderState,
} from './types'
import { audioRecorderClass, audioRecorderCompactClass, recorderTimeClass } from './variants'

const props = withDefaults(defineProps<PrtAudioRecorderProps>(), {
  constraints: true,
  meter: false,
  playback: true,
  compact: false,
  downloadable: false,
  downloadName: 'recording',
  recordLabel: 'Record',
  pauseLabel: 'Pause',
  resumeLabel: 'Resume',
  stopLabel: 'Stop',
  saveLabel: 'Save',
  eraseLabel: 'Re-record',
  exportLabel: 'Export',
  class: '',
})

const emit = defineEmits<{
  save: [blob: Blob, meta: { mimeType: string; extension: string; duration: number }]
  complete: []
  error: [reason: PrtRecorderError]
}>()

// container/Opus preference order; first supported wins (UA default if none).
// NEVER an MP3 — MediaRecorder produces none in either engine.
const TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
]

const rootEl = shallowRef<HTMLElement | null>(null)
const canvasEl = shallowRef<HTMLCanvasElement | null>(null)
const state = ref<PrtRecorderState>('idle')
const elapsed = ref(0)
const recordedBlob = shallowRef<Blob | null>(null)
const blobUrl = useObjectUrl(recordedBlob) // auto-revokes on change/unmount

let recorder: MediaRecorder | undefined
let stream: MediaStream | undefined
let chunks: Blob[] = []

// wall-clock timer (no decrement drift); pauses with the recording
let startedAt = 0
let pausedMs = 0
let pauseStart = 0
const timer = useIntervalFn(tick, 200, { immediate: false })

function tick() {
  elapsed.value = (Date.now() - startedAt - pausedMs) / 1000
  if (props.maxDuration && elapsed.value >= props.maxDuration) stop()
}

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return m + ':' + String(sec).padStart(2, '0')
}

function pickType() {
  if (typeof MediaRecorder === 'undefined') return undefined
  return TYPES.find((t) => MediaRecorder.isTypeSupported(t))
}

function mapError(e: unknown): PrtRecorderError {
  const name = (e as DOMException)?.name
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'permission-denied'
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'no-device'
  return 'unsupported'
}

function extensionFor(type: string) {
  if (type.includes('webm')) return 'webm'
  if (type.includes('ogg')) return 'ogg'
  if (type.includes('mp4') || type.includes('m4a')) return 'm4a'
  if (type.includes('wav')) return 'wav'
  return 'webm' // sane default — never 'mp3'
}

async function start() {
  if (state.value === 'recording' || state.value === 'requesting') return
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === 'undefined'
  ) {
    emit('error', 'unsupported')
    return
  }
  state.value = 'requesting'
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: props.constraints })
  } catch (e) {
    state.value = 'idle'
    emit('error', mapError(e))
    return
  }
  const mimeType = pickType()
  chunks = []
  recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  recorder.ondataavailable = (ev) => {
    if (ev.data.size) chunks.push(ev.data)
  }
  recorder.onstop = onStop
  recorder.start()
  recordedBlob.value = null
  elapsed.value = 0
  startedAt = Date.now()
  pausedMs = 0
  state.value = 'recording'
  timer.resume()
  if (props.meter) startMeter()
}

function pause() {
  if (state.value !== 'recording') return
  recorder?.pause()
  pauseStart = Date.now()
  timer.pause()
  state.value = 'paused'
}

function resume() {
  if (state.value !== 'paused') return
  recorder?.resume()
  pausedMs += Date.now() - pauseStart
  timer.resume()
  state.value = 'recording'
}

function stop() {
  if (state.value !== 'recording' && state.value !== 'paused') return
  recorder?.stop() // → onStop
}

function onStop() {
  timer.pause()
  stopMeter()
  // trust the Blob's type, not the requested mimeType (FF may differ)
  const type = chunks[0]?.type || recorder?.mimeType || 'audio/webm'
  recordedBlob.value = new Blob(chunks, { type })
  state.value = 'stopped'
  releaseStream()
  emit('complete')
}

function erase() {
  recordedBlob.value = null
  chunks = []
  elapsed.value = 0
  state.value = 'idle'
}

// the take's metadata, exposed to save() AND the #actions slot (host pipelines)
const recordedMeta = computed<PrtAudioRecorderMeta | null>(() => {
  const blob = recordedBlob.value
  if (!blob) return null
  return { mimeType: blob.type, extension: extensionFor(blob.type), duration: elapsed.value }
})

function save() {
  if (recordedBlob.value && recordedMeta.value) emit('save', recordedBlob.value, recordedMeta.value)
}

// built-in export — download the take with its REAL extension (never .mp3)
function download() {
  const blob = recordedBlob.value
  const url = blobUrl.value
  if (!blob || !url) return
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.downloadName}.${extensionFor(blob.type)}`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function releaseStream() {
  stream?.getTracks().forEach((t) => t.stop())
  stream = undefined
}

// ── live level meter: raw AnalyserNode → canvas → rAF (NOT reactive) ─────────
let meterCtx: AudioContext | undefined
let meterAnalyser: AnalyserNode | undefined
let meterBins: Uint8Array | undefined
let meterRaf = 0

function startMeter() {
  if (typeof window === 'undefined' || !stream) return
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return
  meterCtx = new Ctor()
  const src = meterCtx.createMediaStreamSource(stream)
  meterAnalyser = meterCtx.createAnalyser()
  meterAnalyser.fftSize = 256
  src.connect(meterAnalyser)
  meterBins = new Uint8Array(meterAnalyser.fftSize)
  drawMeter()
}

function drawMeter() {
  const color =
    getComputedStyle(rootEl.value ?? document.body)
      .getPropertyValue('--seed')
      .trim() ||
    getComputedStyle(rootEl.value ?? document.body)
      .getPropertyValue('--accent')
      .trim() ||
    '#1AC973' // identity emerald fallback (canvas value, not a class)
  const loop = () => {
    const c = canvasEl.value
    if (!c || !meterAnalyser || !meterBins) {
      meterRaf = 0
      return
    }
    meterRaf = requestAnimationFrame(loop)
    const w = (c.width = c.clientWidth)
    const h = (c.height = c.clientHeight)
    meterAnalyser.getByteTimeDomainData(meterBins)
    let sum = 0
    for (let i = 0; i < meterBins.length; i++) {
      const x = (meterBins[i] - 128) / 128
      sum += x * x
    }
    const level = Math.min(1, Math.sqrt(sum / meterBins.length) * 3)
    const g = c.getContext('2d')
    if (!g) return
    g.clearRect(0, 0, w, h)
    g.fillStyle = color
    g.fillRect(0, 0, w * level, h)
  }
  loop()
}

function stopMeter() {
  if (meterRaf) cancelAnimationFrame(meterRaf)
  meterRaf = 0
  void meterCtx?.close()
  meterCtx = undefined
}

onBeforeUnmount(() => {
  stopMeter()
  releaseStream()
  if (recorder && state.value !== 'stopped' && state.value !== 'idle') {
    try {
      recorder.stop()
    } catch {
      // already stopped
    }
  }
})
</script>
