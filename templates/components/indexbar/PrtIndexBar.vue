<!--
  PrtIndexBar
  A–Z directory: first-letter grouping + localeCompare sort (string-or-object
  items, itemKey, displayEmptyLetters, link items) plus the letter rail — a sticky
  strip where present letters jump-scroll to their section and a scrollspy (one
  IntersectionObserver over the section headers) tracks the active letter. Anchors
  + IO, since the CSS scroll-marker family isn't in stable Firefox. Programmatic
  jumps gate scrollspy updates until `scrollend` so intermediate sections don't
  flicker the active letter.
  Vertical only. No TransitionGroup — directory items don't churn outside demos.
  Slot contract:
    item   — { item }
    letter — { letter, count }
-->
<template>
  <div :class="cx('relative flex items-start gap-6', props.class)">
    <div class="flex min-w-0 flex-1 flex-col gap-6">
      <section
        v-for="group in groups"
        :key="group.letter"
        :ref="(el) => setSectionEl(group.letter, el)"
      >
        <div class="mb-2 border-b border-edge pb-1.5">
          <slot name="letter" :letter="group.letter" :count="group.items.length">
            <span :class="indexBarLetterVariants()">{{ group.letter }}</span>
          </slot>
        </div>
        <ul class="m-0 flex list-none flex-col p-0">
          <li v-for="(item, i) in group.items" :key="i">
            <a
              v-if="urlOf(item)"
              :href="urlOf(item)"
              class="block py-1 text-sm text-ink-muted no-underline hover:text-ink prt-motion-colors"
            >
              <slot name="item" :item="item">{{ nameOf(item) }}</slot>
            </a>
            <div v-else class="py-1 text-sm text-ink-muted">
              <slot name="item" :item="item">{{ nameOf(item) }}</slot>
            </div>
          </li>
        </ul>
      </section>
    </div>
    <nav v-if="rail" class="sticky top-3 flex shrink-0 flex-col items-center">
      <component
        :is="entry.present ? 'button' : 'span'"
        v-for="entry in railLetters"
        :key="entry.letter"
        :type="entry.present ? 'button' : undefined"
        :class="
          indexBarRailLetterVariants({
            state: entry.present
              ? entry.letter === activeLetter
                ? 'active'
                : 'present'
              : 'absent',
          })
        "
        @click="entry.present && jumpTo(entry.letter)"
      >
        {{ entry.letter }}
      </component>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  type ComponentPublicInstance,
  computed,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'
import {
  useEventListener,
  useIntersectionObserver,
  useTimeoutFn,
} from '@vueuse/core'
import { cx } from '../_shared/cx'
import type { PrtIndexBarItem, PrtIndexBarProps } from './types'
import { indexBarLetterVariants, indexBarRailLetterVariants } from './variants'

const props = withDefaults(defineProps<PrtIndexBarProps>(), {
  itemKey: 'name',
  displayEmptyLetters: false,
  rail: true,
  class: '',
})

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function isObject(item: PrtIndexBarItem): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null
}

function nameOf(item: PrtIndexBarItem): string {
  if (isObject(item)) return String(item[props.itemKey] ?? '')
  return item
}

function urlOf(item: PrtIndexBarItem): string | undefined {
  return isObject(item) && typeof item.url === 'string' ? item.url : undefined
}

// the grouping/sorting brain — uppercase first
// letter, per-group localeCompare sort, optional empty A–Z groups
const groups = computed(() => {
  const map = new Map<string, PrtIndexBarItem[]>()
  if (props.displayEmptyLetters) for (const letter of ALPHABET) map.set(letter, [])
  for (const item of props.items) {
    const letter = nameOf(item).charAt(0).toUpperCase()
    if (!letter) continue
    if (!map.has(letter)) map.set(letter, [])
    map.get(letter)?.push(item)
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => nameOf(a).localeCompare(nameOf(b), props.locale))
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, props.locale))
    .map(([letter, items]) => ({ letter, items }))
})

const railLetters = computed(() => {
  const present = new Set(
    groups.value.filter((g) => g.items.length > 0).map((g) => g.letter),
  )
  const all = [...new Set([...ALPHABET, ...groups.value.map((g) => g.letter)])]
  return all
    .sort((a, b) => a.localeCompare(b, props.locale))
    .map((letter) => ({ letter, present: present.has(letter) }))
})

// --- the rail: jump + scrollspy ---

const activeLetter = ref('')
const sectionEls = new Map<string, HTMLElement>()
const intersecting = new Set<string>()
// the live observed set — re-armed (not per-render) on groups/rail change so
// useIntersectionObserver re-observes; VueUse owns disconnect + SSR guard.
const spyTargets = shallowRef<HTMLElement[]>([])
// gate spy updates during programmatic scroll — clicking a letter
// scrolls THROUGH intermediate sections and would flicker the active one
let suppressSpy = false

function setSectionEl(
  letter: string,
  el: Element | ComponentPublicInstance | null,
) {
  if (el instanceof HTMLElement) {
    el.dataset.prtLetter = letter
    sectionEls.set(letter, el)
  } else sectionEls.delete(letter)
}

function onSpy(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    const letter = (entry.target as HTMLElement).dataset.prtLetter ?? ''
    if (entry.isIntersecting) intersecting.add(letter)
    else intersecting.delete(letter)
  }
  if (suppressSpy) return
  const first = groups.value.find((g) => intersecting.has(g.letter))
  if (first) activeLetter.value = first.letter
}

// the active band: a section is "current" while it crosses the upper quarter
// of the viewport. One observer over every section header; re-armed by
// swapping spyTargets (VueUse re-observes the new set, disconnects the old).
useIntersectionObserver(spyTargets, onSpy, { rootMargin: '0px 0px -70% 0px' })

function armSpy() {
  intersecting.clear()
  spyTargets.value = props.rail
    ? groups.value
        .map((g) => sectionEls.get(g.letter))
        .filter((el): el is HTMLElement => !!el)
    : []
}

// scroll events don't bubble but DO capture — one window listener covers the
// page and nested scroll containers; releaseSpy is idempotent so an always-on
// listener matches the old open-only-during-jump semantics. The timer is the
// no-scroll fallback (no scrollend fires → release after 1200ms).
useEventListener(window, 'scrollend', () => releaseSpy(), { capture: true })
const { start: startRelease, stop: stopRelease } = useTimeoutFn(
  () => releaseSpy(),
  1200,
  { immediate: false },
)

function jumpTo(letter: string) {
  const el = sectionEls.get(letter)
  if (!el) return
  activeLetter.value = letter
  suppressSpy = true
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  startRelease()
}

function releaseSpy() {
  suppressSpy = false
  stopRelease()
}

watch([groups, () => props.rail], () => nextTick(armSpy))
onMounted(armSpy)
</script>
