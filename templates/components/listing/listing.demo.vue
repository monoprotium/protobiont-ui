<template>
  <DemoSection title="Live — one collection, two presentations, the toggle is yours" min="40rem">
    <DemoItem label="view is a model — the toolbar control stays consumer-owned">
      <div class="flex flex-col gap-4">
        <div class="flex justify-end gap-1">
          <PrtBtn size="sm" :variant="view === 'grid' ? 'solid' : 'ghost'" aria-label="Grid view" @click="view = 'grid'"><span class="i-lucide-layout-grid" /></PrtBtn>
          <PrtBtn size="sm" :variant="view === 'list' ? 'solid' : 'ghost'" aria-label="List view" @click="view = 'list'"><span class="i-lucide-list" /></PrtBtn>
        </div>
        <PrtListing v-model:view="view" item-min="13rem" :items="[
          { id: 1, title: 'Summarize meeting notes', description: 'Condense a transcript into decisions, owners and deadlines.', tags: ['writing'], meta: 'presets / summarize-v3', image: '/geo-1.svg' },
          { id: 2, title: 'SQL from plain English', description: 'Translate a question into a query against the analytics schema.', tags: ['data'], meta: 'presets / sql-v9', image: '/geo-3.svg' },
          { id: 3, title: 'Refactor to composables', description: 'Extract repeated component logic into a shared composable.', tags: ['code'], meta: 'presets / refactor-v2', image: '/geo-2.svg' },
          { id: 4, title: 'Release-note generator', description: 'Draft release notes from merged PR titles since the last tag.', tags: ['writing', 'git'], meta: 'presets / relnotes-v5', image: '/geo-4.svg' }
        ]" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="itemMin — the one RWD knob (resize the window, no breakpoints)" min="40rem">
    <DemoItem label="narrow minimum: more, tighter columns">
      <PrtListing item-min="10rem" :items="[
          { id: 1, title: 'Summarize meeting notes', description: 'Condense a transcript into decisions, owners and deadlines.', tags: ['writing'], meta: 'presets / summarize-v3', image: '/geo-1.svg' },
          { id: 2, title: 'SQL from plain English', description: 'Translate a question into a query against the analytics schema.', tags: ['data'], meta: 'presets / sql-v9', image: '/geo-3.svg' },
          { id: 3, title: 'Refactor to composables', description: 'Extract repeated component logic into a shared composable.', tags: ['code'], meta: 'presets / refactor-v2', image: '/geo-2.svg' },
          { id: 4, title: 'Release-note generator', description: 'Draft release notes from merged PR titles since the last tag.', tags: ['writing', 'git'], meta: 'presets / relnotes-v5', image: '/geo-4.svg' }
        ]" />
    </DemoItem>
    <DemoItem label="wide minimum + max-cols cap">
      <PrtListing item-min="12rem" :max-cols="2" :items="[
          { id: 1, title: 'Summarize meeting notes', description: 'Condense a transcript into decisions, owners and deadlines.', tags: ['writing'], meta: 'presets / summarize-v3', image: '/geo-1.svg' },
          { id: 2, title: 'SQL from plain English', description: 'Translate a question into a query against the analytics schema.', tags: ['data'], meta: 'presets / sql-v9', image: '/geo-3.svg' },
          { id: 3, title: 'Refactor to composables', description: 'Extract repeated component logic into a shared composable.', tags: ['code'], meta: 'presets / refactor-v2', image: '/geo-2.svg' },
          { id: 4, title: 'Release-note generator', description: 'Draft release notes from merged PR titles since the last tag.', tags: ['writing', 'git'], meta: 'presets / relnotes-v5', image: '/geo-4.svg' }
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Default renderer vs #item override" min="40rem">
    <DemoItem label="loose fields {title, description?, image?, tags?, meta?} render themselves">
      <PrtListing view="list" :items="[
          { id: 1, title: 'Summarize meeting notes', description: 'Condense a transcript into decisions, owners and deadlines.', tags: ['writing'], meta: 'presets / summarize-v3', image: '/geo-1.svg' },
          { id: 2, title: 'SQL from plain English', description: 'Translate a question into a query against the analytics schema.', tags: ['data'], meta: 'presets / sql-v9', image: '/geo-3.svg' },
          { id: 3, title: 'Refactor to composables', description: 'Extract repeated component logic into a shared composable.', tags: ['code'], meta: 'presets / refactor-v2', image: '/geo-2.svg' },
          { id: 4, title: 'Release-note generator', description: 'Draft release notes from merged PR titles since the last tag.', tags: ['writing', 'git'], meta: 'presets / relnotes-v5', image: '/geo-4.svg' }
        ]" />
    </DemoItem>
    <DemoItem label="#item replaces everything — { item, index, view } slot props">
      <PrtListing view="list" :items="[
          { id: 1, title: 'Summarize meeting notes', description: 'Condense a transcript into decisions, owners and deadlines.', tags: ['writing'], meta: 'presets / summarize-v3', image: '/geo-1.svg' },
          { id: 2, title: 'SQL from plain English', description: 'Translate a question into a query against the analytics schema.', tags: ['data'], meta: 'presets / sql-v9', image: '/geo-3.svg' },
          { id: 3, title: 'Refactor to composables', description: 'Extract repeated component logic into a shared composable.', tags: ['code'], meta: 'presets / refactor-v2', image: '/geo-2.svg' },
          { id: 4, title: 'Release-note generator', description: 'Draft release notes from merged PR titles since the last tag.', tags: ['writing', 'git'], meta: 'presets / relnotes-v5', image: '/geo-4.svg' }
        ]">
        <template #item="{ item, view }">
          <div class="flex items-baseline gap-3">
            <span class="font-mono text-xs text-accent">{{ view }}</span>
            <span class="text-sm text-ink">{{ item.title }}</span>
            <span class="ml-auto font-mono text-xs text-ink-faint">{{ item.meta }}</span>
          </div>
        </template>
      </PrtListing>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Dense rhythm · empty state" min="40rem">
    <DemoItem label="dense — tighter gap rhythm in both views">
      <PrtListing dense view="list" :items="[
          { id: 1, title: 'Summarize meeting notes', description: 'Condense a transcript into decisions, owners and deadlines.', tags: ['writing'], meta: 'presets / summarize-v3', image: '/geo-1.svg' },
          { id: 2, title: 'SQL from plain English', description: 'Translate a question into a query against the analytics schema.', tags: ['data'], meta: 'presets / sql-v9', image: '/geo-3.svg' },
          { id: 3, title: 'Refactor to composables', description: 'Extract repeated component logic into a shared composable.', tags: ['code'], meta: 'presets / refactor-v2', image: '/geo-2.svg' },
          { id: 4, title: 'Release-note generator', description: 'Draft release notes from merged PR titles since the last tag.', tags: ['writing', 'git'], meta: 'presets / relnotes-v5', image: '/geo-4.svg' }
        ]" />
    </DemoItem>
    <DemoItem label="#empty composes PrtEmptyState">
      <PrtListing :items="[]">
        <template #empty>
          <PrtEmptyState icon="i-lucide-inbox" title="No presets yet" description="Create a preset to see it listed here.">
            <template #action><PrtBtn size="sm">New preset</PrtBtn></template>
          </PrtEmptyState>
        </template>
      </PrtListing>
    </DemoItem>
  </DemoSection>

  <!-- The composed collection page — the tier's identity benchmark:
       facets filter a live listing, grid⇄list toggles, infinite scroll
       appends. The filter object is plain consumer code (the kit ships NO
       filter engine — boundary doctrine: presentation here, semantics
       app-side). Placeholder data on purpose — this page is about the
       composition, not the catalog. -->
  <section class="mb-12">
    <div class="mb-6 border-l-2 border-edge-strong pl-3">
      <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
        The composed collection page — facets × listing × infinite scroll
      </h2>
    </div>
    <div class="pl-3.5 flex flex-col gap-6 lg:flex-row lg:items-start">
      <!-- the mixed mini-rail: every facet is chrome around an ordinary
           control. ONE external "Clear all" resets the whole filter object
           → every facet drops to count 0 at once (facets own no state). -->
      <aside class="flex w-full shrink-0 flex-col gap-5 lg:w-56">
        <div class="flex items-center justify-between gap-2 border-b border-edge pb-2">
          <span class="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Filters
          </span>
          <PrtBtn v-if="anyActive" size="sm" variant="ghost" @click="resetFilters">
            Clear all
          </PrtBtn>
        </div>
        <PrtFacet label="Category" :count="filter.categories.length" @clear="filter.categories = []">
          <PrtFilterBar v-model="filter.categories" :items="categoryFacet" />
        </PrtFacet>
        <PrtFacet label="Price" :count="priceActive ? 1 : 0" @clear="filter.price = [0, 90]">
          <div class="flex flex-col gap-3 px-1">
            <PrtSlider
              :model-value="filter.price"
              :min="0"
              :max="90"
              :step="5"
              @update:model-value="filter.price = $event as [number, number]"
            />
            <div class="flex items-center gap-2">
              <PrtInputNumber
                :model-value="filter.price[0]"
                size="sm"
                :min="0"
                :max="filter.price[1]"
                @update:model-value="filter.price = [$event ?? 0, filter.price[1]]"
              />
              <span class="text-xs text-ink-faint">to</span>
              <PrtInputNumber
                :model-value="filter.price[1]"
                size="sm"
                :min="filter.price[0]"
                :max="90"
                @update:model-value="filter.price = [filter.price[0], $event ?? 90]"
              />
            </div>
          </div>
        </PrtFacet>
        <PrtFacet label="Availability" :count="filter.inStock ? 1 : 0" @clear="filter.inStock = false">
          <PrtToggle v-model="filter.inStock" label="In stock only" size="sm" />
        </PrtFacet>
      </aside>

      <div class="min-w-0 flex-1 flex flex-col gap-4">
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-xs text-ink-faint tabular-nums">
            {{ filtered.length }} results
          </span>
          <div class="flex gap-1">
            <PrtBtn
              size="sm"
              :variant="collectionView === 'grid' ? 'solid' : 'ghost'"
              aria-label="Grid view"
              @click="collectionView = 'grid'"
            >
              <span class="i-lucide-layout-grid" aria-hidden="true" />
            </PrtBtn>
            <PrtBtn
              size="sm"
              :variant="collectionView === 'list' ? 'solid' : 'ghost'"
              aria-label="List view"
              @click="collectionView = 'list'"
            >
              <span class="i-lucide-list" aria-hidden="true" />
            </PrtBtn>
          </div>
        </div>

        <PrtInfiniteScroll
          :loading="loading"
          :end-reached="shown >= filtered.length"
          :empty="filtered.length === 0"
          end-label="End of catalog"
          @load-more="loadMore"
        >
          <PrtListing v-model:view="collectionView" :items="visible" item-min="14rem">
            <template #empty>
              <PrtEmptyState
                icon="i-lucide-search-x"
                title="No items match"
                description="Try widening the price range or clearing a facet."
              >
                <template #action>
                  <PrtBtn size="sm" @click="resetFilters">Clear filters</PrtBtn>
                </template>
              </PrtEmptyState>
            </template>
          </PrtListing>
        </PrtInfiniteScroll>
      </div>
    </div>
    <p class="pl-3.5 mt-4 max-w-2xl text-xs font-mono text-ink-faint">
      the filter object, predicates and counts are consumer code (copy the
      pattern, not a kit API) — protobiont ships facet presentation only.
      infinite scroll loads 6 at a time with a fake 600 ms latency.
      (PrtListingParams has its own page — it's not crammed in here.)
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'
import type { PrtListingView } from './types'

interface DemoItemShape {
  id: number
  title: string
  description: string
  category: string
  price: number
  inStock: boolean
  tags: string[]
  image: string
}

// placeholder catalog — 12 items, 4 categories (3 each), two-digit prices
// so the price facet fields never overflow. Generic on purpose: this page
// showcases the composition, not a real product line.
const CATEGORIES = ['Category 1', 'Category 2', 'Category 3', 'Category 4']
const PRICES = [29, 45, 18, 62, 37, 71, 24, 55, 84, 33, 48, 15]
const catalog: DemoItemShape[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: 'Placeholder item shown in both the grid and the list view.',
  category: CATEGORIES[i % 4],
  price: PRICES[i],
  inStock: i % 3 !== 0,
  tags: [i % 2 === 0 ? 'new' : 'sale'],
  image: `/geo-${(i % 4) + 1}.svg`,
}))

const filter = reactive({
  categories: [] as string[],
  price: [0, 90] as [number, number],
  inStock: false,
})

const priceActive = computed(() => filter.price[0] > 0 || filter.price[1] < 90)

// one source of truth → one button clears every facet at once
const anyActive = computed(
  () => filter.categories.length > 0 || priceActive.value || filter.inStock,
)

// facet counts: the APP computes them (the kit only renders `count`)
const categoryFacet = computed(() =>
  CATEGORIES.map((c) => ({
    value: c,
    label: c,
    count: catalog.filter((p) => p.category === c).length,
  })),
)

const filtered = computed(() =>
  catalog.filter(
    (p) =>
      (filter.categories.length === 0 || filter.categories.includes(p.category)) &&
      p.price >= filter.price[0] &&
      p.price <= filter.price[1] &&
      (!filter.inStock || p.inStock),
  ),
)

const collectionView = ref<PrtListingView>('grid')
const shown = ref(6)
const loading = ref(false)

const visible = computed(() => filtered.value.slice(0, shown.value))

function loadMore() {
  loading.value = true
  window.setTimeout(() => {
    shown.value += 6
    loading.value = false
  }, 600)
}

function resetFilters() {
  filter.categories = []
  filter.price = [0, 90]
  filter.inStock = false
}

// filters changed → restart the scroll window
watch(filtered, () => {
  shown.value = 6
})

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const view = ref<'grid' | 'list'>('grid')
</script>
