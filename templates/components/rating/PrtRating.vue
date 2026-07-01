<!--
  PrtRating
  Discrete rating control — integer steps only (display of 3.7★ is a
  readonly + future `precise?` question; not built). The default mark is
  the kit's abstract square; a star arrives via `icon`.

  Semantics: radiogroup of `max` radios; arrows move ±1 (never to 0 —
  clearing is the re-click, when `clearable`). Hover previews the fill
  up to the hovered mark WITHOUT writing modelValue (display layer
  only). `readonly` renders plain spans — no buttons, no focus, full
  ink; only `disabled` mutes.
  Slot contract: none.
-->
<template>
  <div
    :data-seed="seed ?? undefined"
    :role="readonly ? undefined : 'radiogroup'"
    :aria-label="label"
    :class="cx(ratingVariants({ size, disabled }), props.class)"
    @pointerleave="hoverCount = 0"
  >
    <template v-if="readonly">
      <span
        v-for="i in max"
        :key="i"
        :class="markClass(i)"
        aria-hidden="true"
      />
    </template>
    <template v-else>
      <button
        v-for="i in max"
        :key="i"
        :ref="setBtnRef"
        type="button"
        role="radio"
        :aria-checked="i === modelValue"
        :aria-label="String(i)"
        :tabindex="tabIndexFor(i)"
        :disabled="disabled"
        :class="ratingButtonVariants()"
        @click="onPick(i)"
        @pointerenter="onHover(i)"
        @keydown="onKeydown"
      >
        <span :class="markClass(i)" aria-hidden="true" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUpdate, ref, shallowRef } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtRatingProps } from './types'
import {
  ratingButtonVariants,
  ratingMarkVariants,
  ratingVariants,
} from './variants'

const props = withDefaults(defineProps<PrtRatingProps>(), {
  max: 5,
  size: 'base',
  readonly: false,
  disabled: false,
  clearable: true,
  class: '',
  label: 'Rating',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// hover preview is its own ref — it must NEVER write modelValue
const hoverCount = ref(0)
const fillCount = computed(() =>
  hoverCount.value > 0 ? hoverCount.value : props.modelValue,
)

function markClass(i: number) {
  const filled = i <= fillCount.value
  return props.icon
    ? [props.icon, ratingMarkVariants({ shape: 'icon', size: props.size, filled })]
    : ratingMarkVariants({ shape: 'mark', size: props.size, filled })
}

const btnEls = shallowRef<HTMLButtonElement[]>([])
onBeforeUpdate(() => {
  btnEls.value = []
})
function setBtnRef(el: unknown) {
  if (el) btnEls.value.push(el as HTMLButtonElement)
}

// one tab stop: the checked radio, or the first when nothing is set
function tabIndexFor(i: number): number {
  const stop = props.modelValue >= 1 ? props.modelValue : 1
  return i === stop ? 0 : -1
}

function onPick(i: number) {
  if (props.disabled) return
  emit('update:modelValue', props.clearable && i === props.modelValue ? 0 : i)
}

function onHover(i: number) {
  if (props.disabled) return
  hoverCount.value = i
}

// arrows select ±1 (radio semantics) and move focus with the value;
// clamped to 1..max — arrows never clear
function onKeydown(event: KeyboardEvent) {
  let next: number
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = Math.min(props.modelValue + 1, props.max)
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next = Math.max(props.modelValue - 1, 1)
      break
    default:
      return
  }
  event.preventDefault()
  if (next !== props.modelValue) emit('update:modelValue', next)
  nextTick(() => btnEls.value[next - 1]?.focus())
}
</script>
