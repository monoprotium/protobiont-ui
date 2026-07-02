<!--
  PrtSkeleton
  Slot contract: none — a skeleton is a void. Compose shapes for structure.
-->
<template>
  <div :class="cx(skeletonVariants({ shape }), props.class)" aria-hidden="true" />
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtSkeletonProps } from './types'
import { skeletonVariants } from './variants'

const props = withDefaults(defineProps<PrtSkeletonProps>(), {
  shape: 'line',
  class: '',
})
</script>
