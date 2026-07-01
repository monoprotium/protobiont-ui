<!--
  PrtInputNumber
  Slot contract: none.
  Contract: modelValue is `number | null` — empty emits null, NEVER a silent 0.
  Typing is never clamped (the user types the thing they mean); only the
  stepper buttons clamp to min/max. min/max/step pass through to the native
  input (free native floor: ArrowUp/Down, form validation hints).
  Wrapper-rooted control: $attrs land on the NATIVE input (id, name,
  data-field, aria-*, onBlur/onInput from PrtFormField's inputProps).
  Inputs never inject() anything.
-->
<template>
  <div :class="cx(inputNumberVariants({ variant, size, edges, error, disabled }), props.class)">
    <button
      v-if="!hideControls"
      type="button"
      tabindex="-1"
      :class="inputNumberButtonVariants({ size })"
      :disabled="disabled || (min !== undefined && modelValue !== null && modelValue <= min)"
      aria-hidden="true"
      @click="stepBy(-1)"
    >
      <span class="i-lucide-minus" />
    </button>
    <input
      :id="id"
      type="number"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      :class="inputNumberFieldVariants({ controls: !hideControls, size })"
      v-bind="$attrs"
      @input="onInput"
    />
    <button
      v-if="!hideControls"
      type="button"
      tabindex="-1"
      :class="inputNumberButtonVariants({ size })"
      :disabled="disabled || (max !== undefined && modelValue !== null && modelValue >= max)"
      aria-hidden="true"
      @click="stepBy(1)"
    >
      <span class="i-lucide-plus" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtInputNumberProps } from './types'
import {
  inputNumberButtonVariants,
  inputNumberFieldVariants,
  inputNumberVariants,
} from './variants'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrtInputNumberProps>(), {
  modelValue: null,
  step: 1,
  variant: 'filled',
  size: 'base',
  edges: 'rounded',
  hideControls: false,
  error: false,
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

// '' → null; otherwise Number(); NaN → null. No clamping while typing.
function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  if (raw === '') {
    emit('update:modelValue', null)
    return
  }
  const parsed = Number(raw)
  emit('update:modelValue', Number.isNaN(parsed) ? null : parsed)
}

// Stepper clicks DO clamp; a null value steps from 0.
function stepBy(direction: 1 | -1) {
  const next = (props.modelValue ?? 0) + direction * props.step
  const clamped = Math.min(
    props.max ?? Number.POSITIVE_INFINITY,
    Math.max(props.min ?? Number.NEGATIVE_INFINITY, next),
  )
  emit('update:modelValue', clamped)
}
</script>

<style scoped>
/* utilities can't reach the webkit spinner pseudo-elements */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
