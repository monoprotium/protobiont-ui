<!--
  PrtListing
  One collection, two switchable presentations — the grid⇄list view toggle
  pattern, not a data table. `view` is a model so the toggle control (which the
  consumer owns and places) is a two-line binding and the choice can persist to a
  store/URL.
  Slot contract:
    item    — { item, index, view } — replaces the default renderer
    actions — { item, index, view } — rides the default renderer
              (row right edge / card footer)
    empty   — rendered when items is empty (compose PrtEmptyState)
-->
<template>
  <ul
    v-if="items.length > 0"
    :class="cx(listingRootVariants({ view, dense }), props.class)"
    :style="rootStyle"
  >
    <li
      v-for="entry in entries"
      :key="entry.key"
      :class="listingItemVariants({ view, dense })"
    >
      <slot name="item" :item="entry.item" :index="entry.index" :view="view">
        <!-- default LIST row: thumbnail · title + meta · chips · actions -->
        <div v-if="view === 'list'" class="flex items-center gap-4">
          <img
            v-if="entry.f.image"
            :src="entry.f.image"
            alt=""
            class="h-12 w-12 shrink-0 rounded-mark bg-surface-2 object-cover"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-ink">{{ entry.f.title }}</p>
            <p
              v-if="entry.f.meta || entry.f.description"
              class="mt-0.5 truncate text-xs"
              :class="entry.f.meta ? 'font-mono text-ink-faint' : 'text-ink-muted'"
            >
              {{ entry.f.meta ?? entry.f.description }}
            </p>
          </div>
          <div v-if="entry.f.tags?.length" class="flex shrink-0 gap-1.5">
            <PrtChip v-for="tag in entry.f.tags" :key="tag" size="sm">{{ tag }}</PrtChip>
          </div>
          <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
            <slot name="actions" :item="entry.item" :index="entry.index" :view="view" />
          </div>
        </div>
        <!-- default GRID card: media top · title · description · chips · actions footer -->
        <PrtCard v-else class="h-full">
          <template v-if="entry.f.image" #image>
            <img
              :src="entry.f.image"
              alt=""
              class="aspect-video w-full bg-surface-2 object-cover"
            />
          </template>
          <template #default>
            <div class="flex flex-col gap-1.5">
              <p class="text-sm font-medium text-ink">{{ entry.f.title }}</p>
              <p
                v-if="entry.f.description"
                class="prt-listing-card-desc line-clamp-2 text-sm text-ink-muted"
              >
                {{ entry.f.description }}
              </p>
              <p v-if="entry.f.meta" class="font-mono text-xs text-ink-faint">
                {{ entry.f.meta }}
              </p>
              <div v-if="entry.f.tags?.length" class="prt-listing-card-tags mt-1 flex flex-wrap gap-1.5">
                <PrtChip v-for="tag in entry.f.tags" :key="tag" size="sm">{{ tag }}</PrtChip>
              </div>
            </div>
          </template>
          <template v-if="$slots.actions" #footer>
            <slot name="actions" :item="entry.item" :index="entry.index" :view="view" />
          </template>
        </PrtCard>
      </slot>
    </li>
  </ul>
  <div v-else :class="cx('w-full', props.class)">
    <slot name="empty" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../_shared/cx'
import { PrtCard } from '../card'
import { PrtChip } from '../chip'
import type { PrtListingItemFields, PrtListingProps, PrtListingView } from './types'
import { listingItemVariants, listingRootVariants } from './variants'

const props = withDefaults(defineProps<PrtListingProps>(), {
  itemKey: 'id',
  itemMin: '16rem',
  dense: false,
  class: '',
})

const view = defineModel<PrtListingView>('view', { default: 'grid' })

const entries = computed(() =>
  props.items.map((item, index) => ({
    item,
    index,
    key: keyOf(item, index),
    f: (item ?? {}) as PrtListingItemFields,
  })),
)

function keyOf(item: unknown, index: number): string | number {
  if (typeof props.itemKey === 'function') return props.itemKey(item)
  const value = (item as Record<string, unknown> | null)?.[props.itemKey]
  return typeof value === 'string' || typeof value === 'number' ? value : index
}

// itemMin/cap ride CSS vars (the truly-dynamic-value channel, never
// generated classes). The cap formula floors track width at an equal
// share of the row so auto-fill can't exceed maxCols; the literal gap
// values MUST match the gap-5/gap-3 rhythm classes in variants.ts.
const rootStyle = computed(() => {
  const style: Record<string, string> = { '--prt-listing-min': props.itemMin }
  if (props.maxCols && props.maxCols > 0) {
    const gap = props.dense ? '0.75rem' : '1.25rem'
    style['--prt-listing-cap'] =
      `calc((100% - ${props.maxCols - 1} * ${gap}) / ${props.maxCols})`
  }
  return style
})
</script>

<style scoped>
/* container-query compaction for the default card renderer — the one
   thing utilities can't express here. The li is the container
   (container-type: inline-size in variants.ts): in very narrow tracks
   the card drops its secondary content instead of wrapping into mush. */
@container (max-width: 13rem) {
  .prt-listing-card-desc,
  .prt-listing-card-tags {
    display: none;
  }
}
</style>
