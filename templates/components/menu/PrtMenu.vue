<!--
  PrtMenu
  Dropdown / action menu — the select panel re-aimed at actions instead of a
  value: same substrate (popover=auto + CSS anchor positioning, zero JS layout,
  light dismiss + Esc free), same flat full-bleed panel, same aria-activedescendant
  keyboard model (focus never leaves the trigger). No v-model — a menu has no
  value; selection emits `select` and closes.
  The trigger is the consumer's element: the default slot receives { props } to
  v-bind onto any button (kebab, toolbar icon, avatar…). popovertarget keeps
  pointer toggling declarative; the slot props also carry the anchor-name onto the
  trigger itself, so any element anchors and a stretched wrapper can't skew
  placement.
  role="menu"/"menuitem" is deliberate — this is a true action menu. The
  disclosure-not-menu rule applies to navigation surfaces (megamenu), not here.
  No submenus (nested auto popovers interop fine; the need doesn't exist yet).
  Slot contract:
    default — the trigger. Slot props: { props } → v-bind them onto the
              focusable element.
-->
<template>
  <span class="relative inline-flex" :class="props.class">
    <slot :props="triggerProps" />
    <div
      :id="panelId"
      ref="panel"
      popover="auto"
      role="menu"
      class="prt-menu-panel"
      :class="menuPanelVariants({ edges })"
      :data-placement="placement"
      :style="{ 'position-anchor': anchorName }"
      @toggle="onToggle"
    >
      <div v-for="(group, gi) in groups" :key="gi" :class="gi > 0 ? menuGroupSepClass : ''">
        <span v-if="group.label" :class="menuGroupLabelVariants({ size })">{{
          group.label
        }}</span>
        <button
          v-for="(item, ii) in group.items"
          :id="itemId(offsets[gi] + ii)"
          :key="String(item.value)"
          type="button"
          role="menuitem"
          :disabled="item.disabled"
          :class="
            menuItemVariants({
              size,
              active: offsets[gi] + ii === activeIndex && !item.disabled,
              danger: !!item.danger,
              disabled: !!item.disabled,
            })
          "
          @mousedown.prevent
          @click="choose(item)"
          @mousemove="activeIndex = offsets[gi] + ii"
        >
          <span v-if="item.icon" :class="[item.icon, 'shrink-0']" aria-hidden="true" />
          <span
            class="truncate min-w-0"
            :lang="item.lang"
            :translate="item.lang ? 'no' : undefined"
            >{{ item.label }}</span
          >
        </button>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId } from 'vue'
import type { PrtMenuGroup, PrtMenuItem, PrtMenuProps } from './types'
import {
  menuGroupLabelVariants,
  menuGroupSepClass,
  menuItemVariants,
  menuPanelVariants,
} from './variants'

const props = withDefaults(defineProps<PrtMenuProps>(), {
  placement: 'bottom-start',
  size: 'base',
  edges: 'rounded',
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  select: [value: string | number]
}>()

// per-instance anchor/ids — truly dynamic values (style binding / id
// context, not class construction)
const uid = useId()
const anchorName = `--prt-menu-${uid}`
const panelId = `prt-menu-${uid}-panel`
const itemId = (i: number) => `prt-menu-${uid}-item-${i}`

const panel = shallowRef<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

// flat or grouped input → always groups internally
const groups = computed<PrtMenuGroup[]>(() => {
  const raw = props.items
  if (raw.length === 0) return []
  return 'items' in raw[0]
    ? (raw as PrtMenuGroup[])
    : [{ items: raw as PrtMenuItem[] }]
})

const flat = computed(() => groups.value.flatMap((g) => g.items))

// running global index per group — rows share ONE active index across groups
const offsets = computed(() => {
  const out: number[] = []
  let acc = 0
  for (const group of groups.value) {
    out.push(acc)
    acc += group.items.length
  }
  return out
})

// everything the consumer's trigger element needs, in one v-bind.
// The anchor rides the TRIGGER itself (not the wrapper): a stretched
// wrapper (w-full layouts, the demo cell's width:100% rule) would skew
// every placement that aligns to an anchor edge.
const triggerProps = computed(() => ({
  popovertarget: props.disabled ? undefined : panelId,
  'aria-haspopup': 'menu' as const,
  'aria-expanded': isOpen.value,
  'aria-controls': panelId,
  'aria-activedescendant':
    isOpen.value && activeIndex.value >= 0 ? itemId(activeIndex.value) : undefined,
  style: { 'anchor-name': anchorName },
  onKeydown,
}))

function show() {
  if (props.disabled) return
  const el = panel.value
  if (el?.isConnected && !el.matches(':popover-open')) el.showPopover()
}

function hide() {
  const el = panel.value
  if (el?.isConnected && el.matches(':popover-open')) el.hidePopover()
}

// popover state is the source of truth (covers light dismiss + Esc)
function onToggle(event: Event) {
  isOpen.value = (event as { newState?: string }).newState === 'open'
  if (!isOpen.value) return
  activeIndex.value = flat.value.findIndex((i) => !i.disabled)
  scrollActive()
}

function move(delta: 1 | -1) {
  let i = activeIndex.value
  do i += delta
  while (i >= 0 && i < flat.value.length && flat.value[i].disabled)
  if (i >= 0 && i < flat.value.length) {
    activeIndex.value = i
    scrollActive()
  }
}

function edge(dir: 1 | -1) {
  const items = dir === 1 ? flat.value : [...flat.value].reverse()
  const hit = items.findIndex((i) => !i.disabled)
  if (hit === -1) return
  activeIndex.value = dir === 1 ? hit : flat.value.length - 1 - hit
  scrollActive()
}

function scrollActive() {
  nextTick(() => {
    if (activeIndex.value < 0) return
    document
      .getElementById(itemId(activeIndex.value))
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function choose(item: PrtMenuItem) {
  if (item.disabled) return
  emit('select', item.value)
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
      const item = flat.value[activeIndex.value]
      if (item) choose(item)
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
/* popover UA resets + anchor placement + @starting-style — the
   sanctioned <style> uses (select-panel block shape). LOOK classes stay
   in variants.ts. width: max-content — a menu sizes to its labels. */
.prt-menu-panel {
  position: fixed;
  inset: auto;
  /* UA [popover] defaults are padding:0.25em + border:solid — kill both
     or the full-bleed rows float in a phantom inset (trap registry) */
  padding: 0;
  border: 0;
  margin: 0;
  width: max-content;
  max-height: 16rem;
  opacity: 0;
  transition:
    opacity var(--motion-duration) var(--motion-ease),
    display var(--motion-duration) allow-discrete,
    overlay var(--motion-duration) allow-discrete;
}
.prt-menu-panel:popover-open {
  opacity: 1;
  @starting-style {
    opacity: 0;
  }
}
.prt-menu-panel[data-placement='bottom-start'] {
  position-area: bottom span-right;
  margin-top: 4px;
  position-try-fallbacks: flip-block;
}
.prt-menu-panel[data-placement='bottom-end'] {
  position-area: bottom span-left;
  margin-top: 4px;
  position-try-fallbacks: flip-block;
}
.prt-menu-panel[data-placement='top-start'] {
  position-area: top span-right;
  margin-bottom: 4px;
  position-try-fallbacks: flip-block;
}
.prt-menu-panel[data-placement='top-end'] {
  position-area: top span-left;
  margin-bottom: 4px;
  position-try-fallbacks: flip-block;
}
</style>
