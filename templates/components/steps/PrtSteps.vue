<!--
  PrtSteps
  Wizard step indicator — the ROW is the whole component. States derive
  from the v-model index (complete < current < upcoming), never stored;
  navigation buttons and step content belong to the consumer's wizard
  (the form layer carries the actual steps). Marks are square-ish
  rounded-mark chips — tabular numeral, check when complete; the current
  mark is the one accent moment. Horizontal only.
  `clickable` lets completed and the next adjacent step emit on click —
  forward jumps past validation stay impossible by default.
  Slot contract: none — labels are the data model's job.
-->
<template>
  <ol :class="cx('flex w-full items-start', props.class)">
    <li
      v-for="(step, i) in steps"
      :key="i"
      :class="
        i < steps.length - 1
          ? 'min-w-0 flex-1'
          : stepsLastCellVariants({ size })
      "
      :aria-current="i === modelValue ? 'step' : undefined"
    >
      <component
        :is="clickable && canGo(i) ? 'button' : 'div'"
        :type="clickable && canGo(i) ? 'button' : undefined"
        :class="stepsItemVariants({ interactive: clickable && canGo(i) })"
        :title="!showLabels ? step.label : undefined"
        :aria-label="!showLabels ? step.label : undefined"
        @click="go(i)"
      >
        <!-- first mark pins left, last pins right (its cell IS mark-width,
             so the previous cell's connector reaches it like any other) -->
        <span class="flex w-full items-center">
          <span :class="stepsMarkVariants({ size, state: stateOf(i) })">
            <span v-if="stateOf(i) === 'complete'" class="i-lucide-check" aria-hidden="true" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span
            v-if="i < steps.length - 1"
            :class="stepsConnectorVariants({ state: i < modelValue ? 'complete' : 'pending' })"
            aria-hidden="true"
          />
        </span>
        <span
          v-if="showLabels"
          :class="stepsLabelBlockVariants({ pos: posOf(i), size })"
        >
          <span :class="stepsLabelVariants({ size, state: stateOf(i) })">{{
            step.label
          }}</span>
          <span
            v-if="step.description"
            :class="stepsDescriptionVariants({ size, state: stateOf(i) })"
          >{{ step.description }}</span>
        </span>
      </component>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtStepsProps } from './types'
import {
  stepsConnectorVariants,
  stepsDescriptionVariants,
  stepsItemVariants,
  stepsLabelBlockVariants,
  stepsLabelVariants,
  stepsLastCellVariants,
  stepsMarkVariants,
} from './variants'

const props = withDefaults(defineProps<PrtStepsProps>(), {
  clickable: false,
  showLabels: true,
  labelAlign: 'edge',
  size: 'base',
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [step: number]
}>()

// 'center' treats every position as mid — same dot-centered overlay;
// outer labels overhang the box, the consumer provides the side room
function posOf(i: number): 'first' | 'mid' | 'last' {
  if (props.labelAlign === 'center') return 'mid'
  if (i === 0) return 'first'
  return i === props.steps.length - 1 ? 'last' : 'mid'
}

function stateOf(i: number): 'complete' | 'current' | 'upcoming' {
  if (i < props.modelValue) return 'complete'
  if (i === props.modelValue) return 'current'
  return 'upcoming'
}

// completed steps and the one adjacent next step
function canGo(i: number) {
  return i !== props.modelValue && i <= props.modelValue + 1
}

function go(i: number) {
  if (!props.clickable || !canGo(i)) return
  emit('update:modelValue', i)
}
</script>
