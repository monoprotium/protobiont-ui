<!--
  PrtTimeline
  orientation × align = the full 8-layout matrix, one template per orientation
  with literal placement-class lookups.
  Vertical: flex rows, the line an absolute hairline in a fixed gutter.
  Horizontal: CSS grid — one explicit column per item (count rides a per-instance
  CSS var), three rows (above / line / below); content-sized, no canvas heights,
  honest wrapping. Many items → the consumer scrolls, nothing shrinks.
  DOM order stays chronological in every layout — alternation is pure grid/flex
  placement. `reading-flow: grid-order` rides along as progressive enhancement
  (Chromium smooths visual tab order; Firefox ignores it and falls back to the
  chronological DOM order). No JS detection.
  Two-sided-with-no-alternation isn't a layout (it was a duplicate-render bug);
  genuine two-sided content would be a separate data-shape feature.
  Slot contract:
    item — { item, index } — replaces the default title/description card
    mark — { item, index } — replaces the default square mark
-->
<template>
  <!-- vertical -->
  <div
    v-if="orientation === 'vertical'"
    :class="cx('relative flex w-full flex-col gap-6', props.class)"
  >
    <div :class="timelineLineVertical[align]" aria-hidden="true" />
    <template v-if="align === 'start' || align === 'end'">
      <div v-for="(item, i) in items" :key="i" :class="timelineRowVertical[align]">
        <span :class="timelineMarkPosVertical[markAlign][align]">
          <slot name="mark" :item="item" :index="i">
            <span :class="timelineMarkVariants()" :data-seed="item.seed ?? undefined" />
          </slot>
        </span>
        <slot name="item" :item="item" :index="i">
          <div :class="timelineCardVariants()">
            <p class="text-sm font-medium text-ink">{{ item.title }}</p>
            <p v-if="item.description" class="mt-1 text-sm text-ink-muted">
              {{ item.description }}
            </p>
          </div>
        </slot>
      </div>
    </template>
    <template v-else>
      <div v-for="(item, i) in items" :key="i" :class="timelineAltRow">
        <div :class="timelineAltSide[sideOf(i)]">
          <slot name="item" :item="item" :index="i">
            <div :class="timelineCardVariants()">
              <p class="text-sm font-medium text-ink">{{ item.title }}</p>
              <p v-if="item.description" class="mt-1 text-sm text-ink-muted">
                {{ item.description }}
              </p>
            </div>
          </slot>
        </div>
        <span :class="timelineAltMark[markAlign]">
          <slot name="mark" :item="item" :index="i">
            <span :class="timelineMarkVariants()" :data-seed="item.seed ?? undefined" />
          </slot>
        </span>
      </div>
    </template>
  </div>

  <!-- horizontal -->
  <div
    v-else
    :class="
      cx(
        'relative grid w-full gap-x-6 grid-cols-[repeat(var(--prt-tl-cols),minmax(9rem,1fr))] [reading-flow:grid-order]',
        props.class,
      )
    "
    :style="{ '--prt-tl-cols': String(items.length) }"
  >
    <div
      class="col-span-full row-start-2 h-px w-full self-center bg-edge"
      aria-hidden="true"
    />
    <template v-for="(item, i) in items" :key="i">
      <div
        :class="timelineHContent[rowOf(i)]"
        :style="{ gridColumnStart: i + 1 }"
      >
        <slot name="item" :item="item" :index="i">
          <div :class="timelineCardVariants()">
            <p class="text-sm font-medium text-ink">{{ item.title }}</p>
            <p v-if="item.description" class="mt-1 text-sm text-ink-muted">
              {{ item.description }}
            </p>
          </div>
        </slot>
      </div>
      <span :class="timelineHMark" :style="{ gridColumnStart: i + 1 }">
        <slot name="mark" :item="item" :index="i">
          <span :class="timelineMarkVariants()" :data-seed="item.seed ?? undefined" />
        </slot>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtTimelineProps } from './types'
import {
  timelineAltMark,
  timelineAltRow,
  timelineAltSide,
  timelineCardVariants,
  timelineHContent,
  timelineHMark,
  timelineLineVertical,
  timelineMarkPosVertical,
  timelineMarkVariants,
  timelineRowVertical,
} from './variants'

const props = withDefaults(defineProps<PrtTimelineProps>(), {
  orientation: 'vertical',
  align: 'start',
  markAlign: 'center',
  class: '',
})

// vertical alternate parity: 'alternate' starts LEFT, '-reverse' starts RIGHT
function sideOf(index: number): 'left' | 'right' {
  const startsLeft = props.align === 'alternate'
  return (index % 2 === 0) === startsLeft ? 'left' : 'right'
}

// horizontal placement: start = below the line, end = above; alternate starts TOP
function rowOf(index: number): 'above' | 'below' {
  if (props.align === 'start') return 'below'
  if (props.align === 'end') return 'above'
  const startsTop = props.align === 'alternate'
  return (index % 2 === 0) === startsTop ? 'above' : 'below'
}
</script>
