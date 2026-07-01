<!--
  PrtLoadingBar
  Renders the useLoadingBar() singleton state. Mount ONE instance: app root
  for placement="top" (default, fixed viewport top), or placement="local"
  inside a relative container. Drive it from anywhere via useLoadingBar().
  Slot contract: none.
-->
<template>
  <div
    :data-seed="seed ?? undefined"
    :class="[
      cx(loadingBarVariants({ placement, size }), props.class),
      'transition-opacity duration-300',
      visible ? 'opacity-100' : 'opacity-0',
    ]"
    aria-hidden="true"
  >
    <div
      :class="failed ? loadingBarFillErrorClass : loadingBarFillClass"
      :style="{ width: progress + '%' }"
    />
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtLoadingBarProps } from './types'
import { useLoadingBar } from './useLoadingBar'
import {
  loadingBarFillClass,
  loadingBarFillErrorClass,
  loadingBarVariants,
} from './variants'

const props = withDefaults(defineProps<PrtLoadingBarProps>(), {
  placement: 'top',
  size: 'base',
  class: '',
})

const { progress, visible, failed } = useLoadingBar()
</script>
