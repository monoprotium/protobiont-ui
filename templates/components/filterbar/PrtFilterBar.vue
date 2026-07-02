<!--
  PrtFilterBar
  Checkbox facet over {value, label, disabled?, count?} items — array v-model with
  toggle semantics. Checked state is computed from modelValue per item; there is
  no local mirror. Filter semantics (predicates, URL/store sync, counts) are always
  the app's; this component is facet presentation.
  Out of scope: single-select (PrtRadioGroup's job), filter-state management beyond
  v-model, multiple groups in one bar (compose those).
  Slot contract:
    item   — { item } — label area inside each checkbox
    append — after the item list
  Exposed: selectAll(), clearAll() — programmatic; the header clear is the
  discoverable path.
-->
<template>
  <div :class="cx('w-full', props.class)">
    <div v-if="label" class="mb-2 flex items-center justify-between gap-2">
      <span class="font-mono text-xs uppercase tracking-wider text-ink-muted">
        {{ label }}
      </span>
      <button
        v-if="showClear"
        type="button"
        :class="filterBarClearVariants({ hidden: modelValue.length === 0 })"
        @click="clearAll"
      >
        {{ clearLabel }}
      </button>
    </div>
    <div :class="filterBarListVariants({ direction })">
      <PrtCheckbox
        v-for="item in items"
        :key="item.value"
        :model-value="modelValue.includes(item.value)"
        :size="size"
        :disabled="disabled || item.disabled"
        @update:model-value="toggle(item)"
      >
        <slot name="item" :item="item">{{ item.label }}</slot>
        <span v-if="item.count != null" :class="filterBarCountVariants()">
          {{ item.count }}
        </span>
      </PrtCheckbox>
    </div>
    <slot name="append" />
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import { PrtCheckbox } from '../checkbox'
import type { PrtFilterBarProps, PrtFilterItem } from './types'
import {
  filterBarClearVariants,
  filterBarCountVariants,
  filterBarListVariants,
} from './variants'

const props = withDefaults(defineProps<PrtFilterBarProps>(), {
  modelValue: () => [],
  direction: 'vertical',
  disabled: false,
  clearLabel: 'Clear',
  showClear: true,
  size: 'base',
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function toggle(item: PrtFilterItem) {
  const next = props.modelValue.includes(item.value)
    ? props.modelValue.filter((v) => v !== item.value)
    : [...props.modelValue, item.value]
  emit('update:modelValue', next)
}

// selects every enabled item; already-selected disabled items are kept (selectAll skips disabled)
function selectAll() {
  emit(
    'update:modelValue',
    props.items
      .filter((i) => !i.disabled || props.modelValue.includes(i.value))
      .map((i) => i.value),
  )
}

function clearAll() {
  emit('update:modelValue', [])
}

defineExpose({ selectAll, clearAll })
</script>
