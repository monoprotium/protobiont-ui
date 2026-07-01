<!--
  PrtTextarea
  Slot contract: none — bare textarea element. Compose labels/help via
  PrtFormField (slot usage with v-bind="inputProps").
-->
<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :aria-invalid="error || undefined"
    :class="cx(textareaVariants({ variant, size, edges, error, disabled }), props.class)"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtTextareaProps } from './types'
import { textareaVariants } from './variants'

const props = withDefaults(defineProps<PrtTextareaProps>(), {
  modelValue: '',
  rows: 4,
  variant: 'filled',
  size: 'base',
  edges: 'rounded',
  error: false,
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>
