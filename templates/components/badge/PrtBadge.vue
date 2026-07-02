<!--
  PrtBadge
  Counts and status dots. Inline by default (sidebar/tab counts); set
  `position` for the corner-overlay mode (consumer wrapper must be relative).
  Slot contract:
    default — badge content; overrides `count` (ignored in dot mode)
-->
<template>
  <span
    :data-seed="seed ?? undefined"
    :class="cx(badgeVariants({ tone, size, position, dot, edges: dot ? 'pill' : edges }), props.class)"
  >
    <template v-if="!dot"><slot>{{ display }}</slot></template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtBadgeProps } from './types'
import { badgeVariants } from './variants'

const props = withDefaults(defineProps<PrtBadgeProps>(), {
  max: 99,
  dot: false,
  size: 'base',
  edges: 'rounded',
  class: '',
})

// intent (true state) beats seed (decoration)
const tone = computed(() => props.intent ?? 'seed')

const display = computed(() => {
  if (props.count === undefined) return ''
  return props.count > props.max ? `${props.max}+` : String(props.count)
})
</script>
