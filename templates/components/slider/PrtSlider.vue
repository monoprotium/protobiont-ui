<!--
  PrtSlider
  DAW-grade fader, fully custom on Pointer Events — native <input type=range>
  is disqualified (no relative drag, no tapers, no multi-thumb; CSS Forms
  ::slider-* parts unshipped). All behavior lives in _shared/useValueEngine
  (phase/value split, tapers, Shift-fine 0.1×, detents, pointer capture,
  keyboard, wheel-off-by-default); this component is the LINEAR renderer only.
  A future PrtKnob consumes the same engine with a rotary renderer — point
  knob work at the engine.

  Drag perf: the engine writes --prt-slider-phase (and -b) straight onto the
  root element (style.setProperty, rAF cadence — no Vue reactivity in the
  pointermove path); the scoped block below turns the vars into compositor-only
  transforms. v-model echoes at rAF cadence.

  modelValue shape IS the contract: number = single thumb, [number, number] =
  dual range (always emitted [lo, hi], fresh arrays). No error prop on
  purpose — you cannot type a wrong value into a fader.
  Slot contract: none.
-->
<template>
  <div
    ref="host"
    :role="isDual ? 'group' : undefined"
    :class="cx(sliderRootVariants({ orientation, size, disabled }), props.class)"
    @pointerdown="onTrackPointerdown"
  >
    <div ref="track" :class="sliderTrackVariants({ orientation, size, edges })">
      <div :class="[sliderFillClass, fillGeoClass]" />
      <span
        v-for="t in ticks"
        :key="t"
        :class="sliderTickVariants({ orientation })"
        :style="tickStyle(t)"
        aria-hidden="true"
      />
    </div>
    <div
      v-for="(v, i) in values"
      :key="i"
      :class="[
        sliderThumbPosVariants({ orientation }),
        posGeoClasses[i],
        top === i ? 'z-2' : 'z-1',
      ]"
    >
      <span
        :ref="(el) => setThumbRef(el, i)"
        :class="sliderThumbVariants({ orientation, size, edges, disabled })"
        v-bind="thumbAria(i)"
        @pointerdown="onThumbPointerdown($event, i)"
        @keydown="onThumbKeydown($event, i)"
        @dblclick="onThumbDblclick($event, i)"
      />
      <span
        v-if="readout && dragging === i"
        :class="sliderReadoutVariants({ orientation })"
        aria-hidden="true"
        >{{ format ? format(v) : v }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { cx } from '../_shared/cx'
import { useValueEngine } from '../_shared/useValueEngine'
import type { PrtSliderProps } from './types'
import {
  sliderFillClass,
  sliderReadoutVariants,
  sliderRootVariants,
  sliderThumbPosVariants,
  sliderThumbVariants,
  sliderTickVariants,
  sliderTrackVariants,
} from './variants'

const props = withDefaults(defineProps<PrtSliderProps>(), {
  min: 0,
  max: 100,
  taper: 'linear',
  orientation: 'horizontal',
  interactionMode: 'absolute',
  trackClick: 'jump',
  sensitivity: 200,
  wheel: false,
  readout: false,
  collision: 'clamp',
  size: 'base',
  edges: 'rounded',
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  // commit — drag release, keyboard step, wheel notch, reset
  change: [value: number | [number, number]]
  start: []
  end: []
}>()

const host = shallowRef<HTMLElement | null>(null)
const track = shallowRef<HTMLElement | null>(null)

const isDual = computed(() => Array.isArray(props.modelValue))
const values = computed<number[]>(() =>
  Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue],
)

const thumbEls: (HTMLElement | null)[] = []
function setThumbRef(el: Element | ComponentPublicInstance | null, i: number) {
  thumbEls[i] = (el as HTMLElement | null) ?? null
}

const clamp01 = (p: number) => Math.min(1, Math.max(0, p))

// the geometry adapter — the ONLY thing the renderer feeds the engine
// (a rotary renderer would supply angle-free vertical-drag deltas here)
const geometry = {
  phaseAt(event: PointerEvent): number {
    const r = track.value?.getBoundingClientRect()
    if (!r) return 0
    return props.orientation === 'vertical'
      ? clamp01((r.bottom - event.clientY) / r.height)
      : clamp01((event.clientX - r.left) / r.width)
  },
  pixelDelta(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return props.orientation === 'vertical' ? a.y - b.y : b.x - a.x
  },
}

function shaped(vals: number[]): number | [number, number] {
  return isDual.value ? [vals[0], vals[1]] : vals[0]
}

const {
  dragging,
  top,
  phaseOf,
  thumbAria,
  onThumbPointerdown,
  onThumbKeydown,
  onThumbDblclick,
  onTrackPointerdown,
} = useValueEngine(host, geometry, {
  values: () => values.value,
  min: () => props.min,
  max: () => props.max,
  step: () => props.step,
  defaultValue: () => props.defaultValue,
  taper: () => props.taper,
  interactionMode: () => props.interactionMode,
  trackClick: () => props.trackClick,
  sensitivity: () => props.sensitivity,
  fineScale: () => 0.1,
  detents: () => props.detents,
  wheel: () => props.wheel,
  collision: () => props.collision,
  vertical: () => props.orientation === 'vertical',
  disabled: () => props.disabled,
  format: () => props.format,
  onInput: (vals) => emit('update:modelValue', shaped(vals)),
  onChange: (vals) => emit('change', shaped(vals)),
  onStart: () => emit('start'),
  onEnd: () => emit('end'),
  focusThumb: (i) => thumbEls[i]?.focus(),
})

// literal lookup tables — geometry classes are complete strings in source
const fillGeoClass = computed(() => {
  if (props.orientation === 'vertical')
    return isDual.value ? 'prt-slider-fill-v-dual' : 'prt-slider-fill-v'
  return isDual.value ? 'prt-slider-fill-h-dual' : 'prt-slider-fill-h'
})
const posGeoClasses = computed(() =>
  props.orientation === 'vertical'
    ? ['prt-slider-pos-v', 'prt-slider-pos-v-b']
    : ['prt-slider-pos-h', 'prt-slider-pos-h-b'],
)

// tick offset is a truly dynamic value — style binding, never a class
function tickStyle(value: number) {
  const pct = phaseOf(value) * 100 + '%'
  return props.orientation === 'vertical' ? { bottom: pct } : { left: pct }
}
</script>

<style scoped>
/* Phase-driven geometry — the drag fast path. The engine writes the
   --prt-slider-phase vars via style.setProperty; these rules turn them
   into compositor-only transforms (no layout, holds 120 Hz+). LOOK
   classes stay in variants.ts. */
.prt-slider-pos-h {
  transform: translateX(calc(var(--prt-slider-phase, 0) * 100%));
  will-change: transform;
}
.prt-slider-pos-h-b {
  transform: translateX(calc(var(--prt-slider-phase-b, 0) * 100%));
  will-change: transform;
}
.prt-slider-pos-v {
  transform: translateY(calc(var(--prt-slider-phase, 0) * -100%));
  will-change: transform;
}
.prt-slider-pos-v-b {
  transform: translateY(calc(var(--prt-slider-phase-b, 0) * -100%));
  will-change: transform;
}
.prt-slider-fill-h {
  inset: 0;
  transform-origin: left center;
  transform: scaleX(var(--prt-slider-phase, 0));
  will-change: transform;
}
.prt-slider-fill-h-dual {
  inset: 0;
  transform-origin: left center;
  transform: translateX(calc(var(--prt-slider-phase, 0) * 100%))
    scaleX(calc(var(--prt-slider-phase-b, 0) - var(--prt-slider-phase, 0)));
  will-change: transform;
}
.prt-slider-fill-v {
  inset: 0;
  transform-origin: center bottom;
  transform: scaleY(var(--prt-slider-phase, 0));
  will-change: transform;
}
.prt-slider-fill-v-dual {
  inset: 0;
  transform-origin: center bottom;
  transform: translateY(calc(var(--prt-slider-phase, 0) * -100%))
    scaleY(calc(var(--prt-slider-phase-b, 0) - var(--prt-slider-phase, 0)));
  will-change: transform;
}
</style>

<style>
/* UNscoped on purpose (copied components stay self-contained; precedent:
   the dialog/drawer scroll-lock rule): the vertical default height rides
   :where() so its specificity is ZERO — any consumer height utility on
   `class` wins without a fight (cx does no conflict resolution). */
:where(.prt-slider-v) {
  height: 12rem;
}
</style>
