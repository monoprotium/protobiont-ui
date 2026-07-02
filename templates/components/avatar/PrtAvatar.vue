<!--
  PrtAvatar
  Image with initials/icon fallback. The fallback layer renders always and
  the image covers it — no preloading dance: while loading or on error the
  pad shows through (errored images unrender via @error).
  Slot contract: none.
-->
<template>
  <span
    :data-seed="seed ?? undefined"
    :class="cx(avatarVariants({ size, edges }), props.class)"
  >
    <span v-if="initials" class="leading-none">{{ initials }}</span>
    <span v-else :class="[icon, 'w-1/2 h-1/2']" aria-hidden="true" />
    <img
      v-if="src && !errored"
      :src="src"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover"
      @error="errored = true"
    />
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtAvatarProps } from './types'
import { avatarVariants } from './variants'

const props = withDefaults(defineProps<PrtAvatarProps>(), {
  alt: '',
  icon: 'i-lucide-user',
  size: 'base',
  edges: 'rounded',
  class: '',
})

const errored = ref(false)
watch(
  () => props.src,
  () => {
    errored.value = false
  },
)
</script>
