<!--
  PrtFab
  Floating Action Button / speed-dial: a fixed main button that fans out actions
  on the Popover API + CSS anchor positioning (the menu/select substrate) — zero
  JS layout, light dismiss + Esc free. Placement is baked in.

  Slot contract:
    default — override the action list (rendered inside the fan-out panel)
  emits: action (id)
-->
<template>
  <div
    :data-seed="seed ?? undefined"
    :class="cx(fabRootVariants({ position }), props.class)"
  >
    <button
      type="button"
      :popovertarget="panelId"
      :style="{ 'anchor-name': anchorName }"
      :aria-label="label"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :class="fabMainVariants({ edges })"
    >
      <span
        :class="[icon, isOpen ? 'rotate-45' : '']"
        class="h-6 w-6 prt-motion"
        aria-hidden="true"
      />
    </button>

    <div
      :id="panelId"
      ref="panel"
      popover="auto"
      :style="{ 'position-anchor': anchorName }"
      :data-direction="direction"
      :class="fabPanelClass"
      @toggle="onToggle"
    >
      <slot>
        <component
          :is="a.href ? 'a' : 'button'"
          v-for="a in actions"
          :key="a.id"
          :type="a.href ? undefined : 'button'"
          :href="a.href"
          :title="a.label"
          :aria-label="a.label"
          :class="fabActionClass"
          @click="choose(a)"
        >
          <span :class="[a.icon, 'h-5 w-5']" aria-hidden="true" />
        </component>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, useId } from 'vue'
import { cx } from '../_shared/cx'
import type { PrtFabAction, PrtFabProps } from './types'
import {
  fabActionClass,
  fabMainVariants,
  fabPanelClass,
  fabRootVariants,
} from './variants'

const props = withDefaults(defineProps<PrtFabProps>(), {
  icon: 'i-lucide-plus',
  direction: 'up',
  position: 'bottom-right',
  edges: 'square',
  label: 'Open actions',
  class: '',
})

const emit = defineEmits<{
  action: [id: string]
}>()

// per-instance anchor/id — truly dynamic values (style/id context, not classes)
const uid = useId()
const anchorName = `--prt-fab-${uid}`
const panelId = `prt-fab-${uid}-panel`

const panel = shallowRef<HTMLElement | null>(null)
const isOpen = ref(false)

function onToggle(event: Event) {
  isOpen.value = (event as { newState?: string }).newState === 'open'
}

function choose(a: PrtFabAction) {
  emit('action', a.id)
  const el = panel.value
  if (el?.matches(':popover-open')) el.hidePopover()
}
</script>

<style scoped>
/* popover UA resets + anchor placement (menu-panel block shape). The panel is
   a transparent flex container; UA [popover] padding/border are zeroed. */
.prt-fab-panel {
  position: fixed;
  inset: auto;
  padding: 0;
  border: 0;
  margin: 0;
  background: transparent;
  opacity: 0;
  transition:
    opacity var(--motion-duration) var(--motion-ease),
    display var(--motion-duration) allow-discrete,
    overlay var(--motion-duration) allow-discrete;
}
.prt-fab-panel:popover-open {
  opacity: 1;
  @starting-style {
    opacity: 0;
  }
}
.prt-fab-panel[data-direction='up'] {
  position-area: top;
  margin-bottom: 8px;
  flex-direction: column-reverse;
  position-try-fallbacks: flip-block;
}
.prt-fab-panel[data-direction='down'] {
  position-area: bottom;
  margin-top: 8px;
  flex-direction: column;
  position-try-fallbacks: flip-block;
}
.prt-fab-panel[data-direction='left'] {
  position-area: left;
  margin-right: 8px;
  flex-direction: row-reverse;
  position-try-fallbacks: flip-inline;
}
.prt-fab-panel[data-direction='right'] {
  position-area: right;
  margin-left: 8px;
  flex-direction: row;
  position-try-fallbacks: flip-inline;
}
</style>
