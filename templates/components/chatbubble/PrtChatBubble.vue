<!--
  PrtChatBubble
  Chat message bubble with an arrow tail. Seed-driven — sent = seed/accent bubble
  + derived hue-tinted ink, received = surface bubble. The tail color tracks the
  bubble via the shared `--prt-bubble` CSS variable, never runtime class
  construction. Grouping: a continuation (`grouped`) drops its tail and tightens
  spacing.

  Slot contract:
    default — the message body
    meta    — time / delivery status
-->
<template>
  <div :class="cx(chatRowVariants({ side, grouped }), props.class)">
    <div
      :data-seed="seed ?? undefined"
      :data-side="side"
      :data-tail="showTail ? 'true' : 'false'"
      :class="chatBubbleVariants({ side })"
    >
      <slot />
      <div v-if="$slots.meta" :class="chatMetaClass">
        <slot name="meta" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtChatBubbleProps } from './types'
import { chatBubbleVariants, chatMetaClass, chatRowVariants } from './variants'

const props = withDefaults(defineProps<PrtChatBubbleProps>(), {
  side: 'received',
  tail: true,
  grouped: false,
  class: '',
})

// a continuation never shows the tail — only the last of a run does
const showTail = computed(() => props.tail && !props.grouped)
</script>

<style scoped>
/* The bubble bg AND the tail both read --prt-bubble — set once per side, so
   the tail can never drift from the bubble. */
.prt-chat-bubble[data-side='sent'] {
  --prt-bubble: var(--seed, var(--accent));
}
.prt-chat-bubble[data-side='received'] {
  --prt-bubble: var(--surface-2);
}
.prt-chat-bubble {
  background: var(--prt-bubble);
}

/* Square the corner the tail attaches to. A rounded corner there leaves a gap
   between the bubble and the triangle, so the tail reads as DISCONNECTED — only
   that one corner goes sharp; the other three keep `rounded-surface`. */
.prt-chat-bubble[data-side='sent'][data-tail='true'] {
  border-bottom-right-radius: 0;
}
.prt-chat-bubble[data-side='received'][data-tail='true'] {
  border-bottom-left-radius: 0;
}

/* the tail: a small triangle of the bubble color at the bottom outer corner */
.prt-chat-bubble[data-tail='true']::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 10px;
  height: 10px;
  background: var(--prt-bubble);
}
.prt-chat-bubble[data-side='sent'][data-tail='true']::after {
  right: -5px;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}
.prt-chat-bubble[data-side='received'][data-tail='true']::after {
  left: -5px;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}
</style>
