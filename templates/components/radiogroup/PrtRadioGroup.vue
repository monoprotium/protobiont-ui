<!--
  PrtRadioGroup
  Slot contract: #meta (scoped, slot prop { option }) — rendered per option in
  `variant="card"` only, pushed to the trailing edge (delivery date + price,
  method name + logo). `list` (default) has no slots. The legend comes from
  `label`. Ships the GROUP only — no standalone PrtRadio.
  The GROUP is the unit: $attrs land on the FIELDSET (with PrtFormField use
  the label-less wrapper pattern and v-bind="inputProps" on this component —
  the field name arrives as the `name` prop and all radios share it).
  Inputs never inject() anything.
  Emits the ORIGINAL option value — string | number preserved.
-->
<template>
  <fieldset
    :data-seed="seed ?? undefined"
    :disabled="disabled"
    :class="cx(radioGroupVariants({ disabled }), props.class)"
    v-bind="$attrs"
  >
    <legend v-if="label" :class="radioGroupLegendVariants({ error })">
      {{ label }}
    </legend>
    <div :class="radioGroupOptionsVariants({ inline: variant === 'card' ? false : inline })">
      <label
        v-for="opt in options"
        :key="String(opt.value)"
        :class="
          radioOptionVariants({
            variant,
            checked: opt.value === modelValue,
            disabled: disabled || opt.disabled,
          })
        "
      >
        <input
          type="radio"
          class="sr-only peer"
          :name="groupName"
          :value="String(opt.value)"
          :checked="opt.value === modelValue"
          :disabled="opt.disabled"
          @change="emit('update:modelValue', opt.value)"
        />
        <span
          :class="radioDotVariants({ size, checked: opt.value === modelValue, error })"
          aria-hidden="true"
        >
          <span v-if="opt.value === modelValue" :class="radioMarkVariants({ size })" />
        </span>
        <span v-if="opt.icon" :class="[opt.icon, 'shrink-0 text-ink-muted']" aria-hidden="true" />
        <span :class="radioLabelVariants({ size })">{{ opt.label }}</span>
        <span v-if="variant === 'card' && $slots.meta" class="ml-auto ps-3">
          <slot name="meta" :option="opt" />
        </span>
      </label>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtRadioGroupProps } from './types'
import {
  radioDotVariants,
  radioGroupLegendVariants,
  radioGroupOptionsVariants,
  radioGroupVariants,
  radioLabelVariants,
  radioMarkVariants,
  radioOptionVariants,
} from './variants'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrtRadioGroupProps>(), {
  variant: 'list',
  size: 'base',
  inline: false,
  error: false,
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// shared native name = keyboard navigation + exclusivity for free
const generatedName = useId()
const groupName = computed(() => props.name ?? generatedName)
</script>
