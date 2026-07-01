<!--
  PrtTagsInput
  Token field: chips + an inline input inside ONE field-looking wrapper.
  The wrapper owns the whole field look (inputnumber's recipe: ring via
  focus-within, hover gated on the inner input) — the input is naked.
  modelValue is `string[]`; new arrays are emitted, never mutation.

  Chips are inline markup, NOT PrtChip — deliberate: PrtChip's dismiss ×
  is a tab stop (one per tag would wreck the field's single-tab-stop
  roving model) and a static label component has no business growing
  marked/roving states. Do not extend PrtChip for this.

  Commit gestures: Enter always; comma unless :comma-commits="false";
  blur commits pending text (Tab itself does NOT commit — Tab means
  leave; the commit comes from the blur it causes); paste splits on the
  commit separators when splitPaste (one update:modelValue for the whole
  batch). Empty commits are silent no-ops — no 'empty' reject exists.
  Rejections are reason CODES ('duplicate' | 'max'); the consumer
  renders any message. Duplicate compare is exact, and the
  existing chip flashes so the rejection is visible without a message.
  Commits never fire mid-IME-composition.

  Keyboard: Backspace on empty input is TWO-STEP — first press marks the
  last chip, second deletes it; ANY other key (or blur) un-marks.
  ArrowLeft on empty input roves DOM focus into the chips: Left/Right
  walk, Delete/Backspace removes (focus moves to the neighbor, or back
  to the input when none), typing returns focus to the input.

  Wrapper-rooted: $attrs land on the INPUT (the focusable form element)
  — inputProps/blur reporting work unchanged. Inputs never inject()
  anything. Slot contract: none.
-->
<template>
  <div
    :class="cx(tagsInputVariants({ variant, size, edges, error, disabled }), props.class)"
    @click="focusInput"
  >
    <TransitionGroup
      enter-active-class="prt-motion"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="prt-motion"
      leave-to-class="opacity-0 scale-95"
      move-class="prt-motion"
    >
      <span
        v-for="(item, i) in keyed"
        :key="item.key"
        :ref="setChipRef"
        tabindex="-1"
        :class="
          tagsInputChipVariants({
            size,
            edges,
            marked: i === markedIndex || i === flashIndex,
          })
        "
        @keydown="onChipKeydown(i, $event)"
      >
        <span class="truncate min-w-0">{{ item.tag }}</span>
        <button
          v-if="!disabled"
          type="button"
          tabindex="-1"
          :aria-label="removeLabel"
          class="-mr-0.5 inline-flex items-center justify-center bg-transparent rounded-full hover:bg-wash prt-motion-colors"
          @click.stop="removeAt(i, true)"
        >
          <span class="i-lucide-x w-3 h-3" aria-hidden="true" />
        </button>
      </span>
    </TransitionGroup>
    <input
      :id="id"
      ref="inputEl"
      type="text"
      autocomplete="off"
      :value="pending"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      :class="tagsInputFieldVariants({ size })"
      v-bind="$attrs"
      @input="onInput"
      @keydown="onKeydown"
      @paste="onPaste"
      @blur="onBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUpdate, ref, shallowRef } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { cx } from '../_shared/cx'
import { accept, keyTags, splitPasted } from './accept'
import type { PrtTagsInputProps, PrtTagsInputRejectReason } from './types'
import {
  tagsInputChipVariants,
  tagsInputFieldVariants,
  tagsInputVariants,
} from './variants'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrtTagsInputProps>(), {
  variant: 'filled',
  size: 'base',
  edges: 'rounded',
  error: false,
  disabled: false,
  allowDuplicates: false,
  commaCommits: true,
  splitPaste: true,
  class: '',
  removeLabel: 'Remove',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  add: [tag: string]
  remove: [tag: string, index: number]
  reject: [tag: string, reason: PrtTagsInputRejectReason]
}>()

const inputEl = shallowRef<HTMLInputElement | null>(null)
const pending = ref('')
// two-step backspace: the chip awaiting its second press
const markedIndex = ref(-1)
// brief marked look on the existing chip a duplicate bounced off
const flashIndex = ref(-1)

// TransitionGroup keys: tag string + occurrence counter — plain string
// keys break the moment allowDuplicates puts the same tag in twice
const keyed = computed(() => keyTags(props.modelValue))

// roving focus targets — rebuilt every render
const chipEls = shallowRef<HTMLElement[]>([])
onBeforeUpdate(() => {
  chipEls.value = []
})
function setChipRef(el: unknown) {
  if (el) chipEls.value.push(el as HTMLElement)
}

function focusInput() {
  if (!props.disabled) inputEl.value?.focus()
}

// the duplicate-bounce flash: VueUse owns the timer (start() resets a pending
// flash, auto-stops on unmount). Roving focus below stays raw — it's custom
// keyboard logic, not a browser-API wrapper.
const flashTimer = useTimeoutFn(
  () => {
    flashIndex.value = -1
  },
  600,
  { immediate: false },
)

function flash(i: number) {
  flashIndex.value = i
  flashTimer.start()
}

// imperative shell around the pure `accept` decision: pushes into the
// accumulator on 'ok' (so max/duplicate apply per piece against the running
// list) and fires the reject/flash side-effects. Returns whether admitted.
function admit(tag: string, into: string[]): boolean {
  const verdict = accept(tag, into, { max: props.max, allowDuplicates: props.allowDuplicates })
  switch (verdict) {
    case 'ok':
      into.push(tag)
      return true
    case 'duplicate':
      flash(into.indexOf(tag))
      emit('reject', tag, 'duplicate')
      return false
    case 'max':
      emit('reject', tag, 'max')
      return false
    default: // 'empty' — silent no-op
      return false
  }
}

// rejection keeps the text in the input — the user edits, not retypes
function commitPending() {
  const tag = pending.value.trim()
  if (tag === '') {
    pending.value = ''
    return
  }
  const next = [...props.modelValue]
  if (admit(tag, next)) {
    emit('update:modelValue', next)
    emit('add', tag)
    pending.value = ''
  }
}

function removeAt(index: number, refocusInput: boolean) {
  const tag = props.modelValue[index]
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  )
  emit('remove', tag, index)
  markedIndex.value = -1
  flashIndex.value = -1
  if (refocusInput) focusInput()
}

function onInput(event: Event) {
  pending.value = (event.target as HTMLInputElement).value
  markedIndex.value = -1
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || (event.key === ',' && props.commaCommits)) {
    if (event.isComposing) return
    event.preventDefault()
    commitPending()
    return
  }
  if (event.key === 'Backspace' && pending.value === '') {
    const last = props.modelValue.length - 1
    if (last < 0) return
    event.preventDefault()
    if (markedIndex.value === last) removeAt(last, true)
    else markedIndex.value = last
    return
  }
  if (
    event.key === 'ArrowLeft' &&
    pending.value === '' &&
    props.modelValue.length > 0
  ) {
    event.preventDefault()
    markedIndex.value = -1
    chipEls.value[props.modelValue.length - 1]?.focus()
    return
  }
  // ANY other key un-marks — sticky marks delete the wrong chip later
  markedIndex.value = -1
}

function onChipKeydown(i: number, event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      if (i > 0) chipEls.value[i - 1]?.focus()
      break
    case 'ArrowRight':
      event.preventDefault()
      if (i < props.modelValue.length - 1) chipEls.value[i + 1]?.focus()
      else focusInput()
      break
    case 'Backspace':
    case 'Delete': {
      event.preventDefault()
      const lastAfter = props.modelValue.length - 2
      removeAt(i, false)
      nextTick(() => {
        const target = Math.min(i, lastAfter)
        if (target >= 0) chipEls.value[target]?.focus()
        else focusInput()
      })
      break
    }
    default:
      // typing returns focus to the input; focus moves during keydown,
      // so the keystroke's text insertion lands in the input itself
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        focusInput()
      }
  }
}

function onPaste(event: ClipboardEvent) {
  if (!props.splitPaste || props.disabled) return
  const text = event.clipboardData?.getData('text') ?? ''
  const pieces = splitPasted(text, props.commaCommits)
  if (pieces === null) return // no separator — plain paste, let it type
  event.preventDefault()
  const next = [...props.modelValue]
  const added: string[] = []
  for (const tag of pieces) {
    if (admit(tag, next)) added.push(tag)
  }
  if (added.length > 0) {
    emit('update:modelValue', next) // ONE emit for the whole batch
    for (const tag of added) emit('add', tag)
  }
}

// blur commits pending text (blur ≠ Tab semantics)
function onBlur() {
  markedIndex.value = -1
  commitPending()
}
</script>
