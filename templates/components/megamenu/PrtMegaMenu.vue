<!--
  PrtMegaMenu
  A data-presentation surface for large option sets that don't fit a normal menu
  (category trees, patch/preset browsers, game section navs). The component is the
  whole menubar — nav strip + triggers + panels.
  Positioning: one popover="auto" panel per item in the top layer + CSS anchor
  positioning — zero JS layout, light dismiss + Esc + mutual exclusivity free from
  the platform. Panels anchor to the BAR, not the trigger: position-area bottom +
  anchor-size(width) spans the bar exactly, flush under it — no per-trigger X math.
  Each panel sits adjacent to its trigger in DOM, so Tab flows trigger → panel
  links even though panels render in the top layer. Keyboard is the disclosure
  pattern (aria-expanded + aria-controls; never role="menu" on navigation).
  Slot contract:
    panel-{id} — overrides the rendered panel content for that item (arbitrary
                 content; the data model covers the common case). Providing the
                 slot gives the item a panel even without `groups`. Slot props:
                 { item, close }.
-->
<template>
  <nav
    ref="root"
    :class="cx(megaMenuBarVariants({ align }), props.class)"
    :style="{ 'anchor-name': anchorName }"
    @mouseenter="onBarEnter"
    @mouseleave="onBarLeave"
    @focusout="onFocusout"
  >
    <template v-for="item in items" :key="item.id">
      <a
        v-if="!hasPanel(item)"
        :href="item.href"
        :class="megaMenuTriggerVariants({ edges, open: false })"
        @mouseenter="onPlainEnter"
      >{{ item.label }}</a>
      <template v-else>
        <button
          type="button"
          :class="megaMenuTriggerVariants({ edges, open: openId === item.id })"
          :popovertarget="panelId(item.id)"
          :aria-expanded="openId === item.id"
          :aria-controls="panelId(item.id)"
          @mouseenter="onTriggerEnter(item)"
        >
          <span>{{ item.label }}</span>
          <span
            :class="[
              'i-lucide-chevron-down text-xs text-ink-faint prt-motion',
              openId === item.id ? 'rotate-180' : '',
            ]"
            aria-hidden="true"
          />
        </button>
        <div
          :id="panelId(item.id)"
          :ref="(el) => setPanelRef(item.id, el)"
          popover="auto"
          class="prt-mm-panel"
          :class="megaMenuPanelVariants({ edges })"
          :style="{ 'position-anchor': anchorName }"
          @toggle="onToggle(item.id, $event)"
        >
          <slot :name="`panel-${item.id}`" :item="item" :close="hide">
            <div :class="megaMenuGridClass">
              <div v-for="(group, gi) in item.groups" :key="gi" class="flex flex-col">
                <span v-if="group.label" :class="megaMenuGroupLabelClass">{{
                  group.label
                }}</span>
                <a
                  v-for="link in group.links"
                  :key="link.href"
                  :href="link.href"
                  :class="megaMenuLinkVariants({ linkHover })"
                >
                  <span
                    v-if="link.icon"
                    :class="[link.icon, 'shrink-0 mt-0.5 text-ink-faint']"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 flex flex-col gap-0.5">
                    <span class="truncate">{{ link.label }}</span>
                    <span v-if="link.description" class="text-xs text-ink-faint">{{
                      link.description
                    }}</span>
                  </span>
                </a>
              </div>
            </div>
          </slot>
        </div>
      </template>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, useId, useSlots } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { cx } from '../_shared/cx'
import type { PrtMegaMenuItem, PrtMegaMenuProps } from './types'
import {
  megaMenuBarVariants,
  megaMenuGridClass,
  megaMenuGroupLabelClass,
  megaMenuLinkVariants,
  megaMenuPanelVariants,
  megaMenuTriggerVariants,
} from './variants'

const props = withDefaults(defineProps<PrtMegaMenuProps>(), {
  trigger: 'hover',
  openDelay: 120,
  closeDelay: 300,
  align: 'start',
  linkHover: 'text',
  edges: 'square',
  class: '',
})

// per-instance anchor/ids — truly dynamic values (style binding / id
// context, not class construction)
const uid = useId()
const anchorName = `--prt-mm-${uid}`
const panelId = (id: string) => `prt-mm-${uid}-panel-${id}`

const root = shallowRef<HTMLElement | null>(null)
const panels = new Map<string, HTMLElement>()
const openId = ref<string | null>(null)

// a panel exists when the item has groups OR a #panel-{id} slot — slot
// override never needs dummy groups
const slots = useSlots()
function hasPanel(item: PrtMegaMenuItem) {
  return !!item.groups?.length || !!slots[`panel-${item.id}`]
}

function setPanelRef(id: string, el: unknown) {
  if (el instanceof HTMLElement) panels.set(id, el)
  else panels.delete(id)
}

function show(id: string) {
  const el = panels.get(id)
  // showing one auto popover closes any open sibling — exclusivity is free
  if (el?.isConnected && !el.matches(':popover-open')) el.showPopover()
}

function hide() {
  if (!openId.value) return
  const el = panels.get(openId.value)
  if (el?.isConnected && el.matches(':popover-open')) el.hidePopover()
}

// popover state is the source of truth for openId (covers light dismiss +
// Esc + auto exclusivity); timers only ever call show/hide, never touch it
function onToggle(id: string, event: Event) {
  const open = (event as { newState?: string }).newState === 'open'
  if (open) openId.value = id
  else if (openId.value === id) openId.value = null
}

// Hover machinery. Pointer toggling stays DECLARATIVE (popovertarget on
// the trigger — the select lesson: manual click toggles lose the
// light-dismiss race); hover only ever adds show/hide around it. The two
// hover-intent timers are VueUse-owned: start() resets, delays are read
// reactively at start, and both auto-stop on unmount.
const openTimer = useTimeoutFn(
  (id: string) => show(id),
  () => props.openDelay,
  { immediate: false },
)
const closeTimer = useTimeoutFn(() => hide(), () => props.closeDelay, {
  immediate: false,
})

function onTriggerEnter(item: PrtMegaMenuItem) {
  if (props.trigger !== 'hover') return
  openTimer.start(item.id)
}

function onPlainEnter() {
  // a grazed trigger must not pop its panel while the pointer rests on a
  // plain link — but an already-open panel stays (still inside the bar)
  openTimer.stop()
}

function onBarEnter() {
  closeTimer.stop()
}

function onBarLeave() {
  if (props.trigger !== 'hover') return
  openTimer.stop()
  closeTimer.start()
}

function onFocusout(event: FocusEvent) {
  // Tab-out of an open panel doesn't light-dismiss (a focus change isn't a
  // click). Panels are DOM children of the bar even while rendered in the
  // top layer, so containment of relatedTarget covers bar + panels; null
  // relatedTarget is left to light dismiss (it already handles clicks).
  const next = event.relatedTarget as Node | null
  if (next && root.value && !root.value.contains(next)) hide()
}

onBeforeUnmount(() => {
  hide()
})
</script>

<style scoped>
/* popover UA resets + anchor placement + @starting-style — the sanctioned
   <style> uses (same block shape as PrtSelect, the panel precedent).
   LOOK classes stay in variants.ts. */
.prt-mm-panel {
  position: fixed;
  inset: auto;
  /* UA [popover] defaults are padding:0.25em + border:solid — kill both
     or the full-bleed surface floats in a phantom inset (trap registry) */
  padding: 0;
  border: 0;
  margin: 0;
  /* anchored to the BAR (a real box — never give the bar display:contents),
     flush under it, spanning it exactly: no per-trigger X math */
  position-area: bottom;
  position-try-fallbacks: flip-block;
  width: anchor-size(width);
  /* position-area makes the region below the bar the containing block, so
     100% clamps a tall panel to the remaining viewport space */
  max-height: 100%;
  opacity: 0;
  transition:
    opacity var(--motion-duration) var(--motion-ease),
    display var(--motion-duration) allow-discrete,
    overlay var(--motion-duration) allow-discrete;
}
.prt-mm-panel:popover-open {
  opacity: 1;
  @starting-style {
    opacity: 0;
  }
}
</style>
