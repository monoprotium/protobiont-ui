<!--
  PrtSelect
  Fully styled select — both the closed control and the open panel are ours (the
  native <select> popup is unstylable). The panel is a popover=auto listbox on CSS
  anchor positioning: top layer, zero JS layout, light dismiss + Esc for free.
  Focus stays on the trigger (aria-activedescendant; option mousedown prevented),
  so blur reporting and PrtFormField's inputProps work.
  Wrapper-rooted: $attrs land on the trigger button (id/name/data-field/aria/onBlur).
  Selection emits the original option value (numbers stay numbers); option `icon`
  renders in the row and on the trigger.
  Search/clear/async loading live in PrtCombobox.
  Slot contract: none — options render from `options`.
-->
<template>
  <div
    :class="cx('relative w-full', props.class)"
    :style="{ 'anchor-name': anchorName }"
  >
    <button
      :id="id"
      type="button"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-activedescendant="
        isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
      "
      :aria-invalid="error || undefined"
      :popovertarget="listboxId"
      :class="
        selectVariants({
          variant,
          size,
          edges,
          error,
          disabled,
          placeholding: modelValue == null && !!placeholder,
        })
      "
      v-bind="$attrs"
      @keydown="onKeydown"
    >
      <span
        v-if="selected?.icon"
        :class="[selected.icon, 'shrink-0']"
        aria-hidden="true"
      />
      <span class="truncate min-w-0">{{
        selected ? selected.label : (placeholder ?? '')
      }}</span>
    </button>
    <span
      :class="[selectChevronVariants({ size }), isOpen ? 'rotate-180' : '']"
      aria-hidden="true"
    />
    <div
      :id="listboxId"
      ref="panel"
      popover="auto"
      role="listbox"
      class="prt-select-panel"
      :class="selectPanelVariants({ edges })"
      :style="{ 'position-anchor': anchorName }"
      @toggle="onToggle"
    >
      <button
        v-for="(opt, i) in options"
        :id="optionId(i)"
        :key="String(opt.value)"
        type="button"
        role="option"
        :aria-selected="opt.value === modelValue"
        :disabled="opt.disabled"
        :class="
          selectOptionVariants({
            size,
            active: i === activeIndex && !opt.disabled,
            disabled: !!opt.disabled,
          })
        "
        @mousedown.prevent
        @click="choose(opt)"
        @mousemove="activeIndex = i"
      >
        <span v-if="opt.icon" :class="[opt.icon, 'shrink-0']" aria-hidden="true" />
        <span class="truncate min-w-0">{{ opt.label }}</span>
        <span
          v-if="opt.value === modelValue"
          class="i-lucide-check ml-auto shrink-0 text-accent"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtOption } from '../_shared/types'
import type { PrtSelectProps } from './types'
import {
  selectChevronVariants,
  selectOptionVariants,
  selectPanelVariants,
  selectVariants,
} from './variants'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrtSelectProps>(), {
  modelValue: null,
  variant: 'filled',
  size: 'base',
  edges: 'rounded',
  error: false,
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

// per-instance anchor/ids — truly dynamic values (style binding / id
// context, not class construction)
const uid = useId()
const anchorName = `--prt-sel-${uid}`
const listboxId = `prt-sel-${uid}-listbox`
const optionId = (i: number) => `prt-sel-${uid}-opt-${i}`

const panel = shallowRef<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

const selected = computed(() =>
  props.modelValue == null
    ? undefined
    : props.options.find((o) => o.value === props.modelValue),
)

function show() {
  if (props.disabled) return
  const el = panel.value
  if (el?.isConnected && !el.matches(':popover-open')) el.showPopover()
}

function hide() {
  const el = panel.value
  if (el?.isConnected && el.matches(':popover-open')) el.hidePopover()
}

// pointer toggling is DECLARATIVE (popovertarget on the trigger) — a manual
// @click toggle loses the light-dismiss race (pointerdown closes, click
// reopens; the trigger could never close the panel). Keyboard paths call
// show()/choose() directly; their preventDefault stops the synthetic click,
// so popovertarget never double-fires.
// popover state is the source of truth (covers light dismiss + Esc)
function onToggle(event: Event) {
  isOpen.value = (event as { newState?: string }).newState === 'open'
  if (!isOpen.value) return
  const sel = props.options.findIndex(
    (o) => o.value === props.modelValue && !o.disabled,
  )
  activeIndex.value = sel >= 0 ? sel : props.options.findIndex((o) => !o.disabled)
  scrollActive()
}

function move(delta: 1 | -1) {
  let i = activeIndex.value
  do i += delta
  while (i >= 0 && i < props.options.length && props.options[i].disabled)
  if (i >= 0 && i < props.options.length) {
    activeIndex.value = i
    scrollActive()
  }
}

function edge(dir: 1 | -1) {
  const opts = dir === 1 ? props.options : [...props.options].reverse()
  const hit = opts.findIndex((o) => !o.disabled)
  if (hit === -1) return
  activeIndex.value = dir === 1 ? hit : props.options.length - 1 - hit
  scrollActive()
}

function scrollActive() {
  nextTick(() => {
    if (activeIndex.value < 0) return
    document
      .getElementById(optionId(activeIndex.value))
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function choose(opt: PrtOption) {
  if (opt.disabled) return
  emit('update:modelValue', opt.value)
  hide()
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      show()
    }
    return
  }
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home':
      event.preventDefault()
      edge(1)
      break
    case 'End':
      event.preventDefault()
      edge(-1)
      break
    case 'Enter':
    case ' ': {
      event.preventDefault()
      const opt = props.options[activeIndex.value]
      if (opt) choose(opt)
      break
    }
    case 'Tab':
      hide()
      break
  }
}

onBeforeUnmount(hide)
</script>

<style scoped>
/* popover UA resets + anchor placement + @starting-style — the sanctioned
   <style> uses (same block shape as PrtTooltip, the positioning
   substrate). LOOK classes stay in variants.ts. The panel tracks the
   trigger's width via anchor-size(). */
.prt-select-panel {
  position: fixed;
  inset: auto;
  /* UA [popover] defaults are padding:0.25em + border:solid — kill both
     or the full-bleed rows float in a phantom inset */
  padding: 0;
  border: 0;
  margin: 0;
  margin-top: 4px;
  width: anchor-size(width);
  max-height: 16rem;
  position-area: bottom;
  position-try-fallbacks: flip-block;
  opacity: 0;
  transition:
    opacity var(--motion-duration) var(--motion-ease),
    display var(--motion-duration) allow-discrete,
    overlay var(--motion-duration) allow-discrete;
}
.prt-select-panel:popover-open {
  opacity: 1;
  @starting-style {
    opacity: 0;
  }
}
</style>
