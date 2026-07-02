<template>
  <!-- Live sections render directly (the slot model can't carry chunked-fetch
       state), as in form.demo.vue. Each live demo is a bounded scroll panel,
       pre-filled on mount: the sentinel sits below the panel fold, so visiting
       the page loads nothing and shifts nothing. More items load only when the
       user scrolls the panel to its end, and since the panel height is fixed the
       surrounding page never jumps. -->
  <section class="mb-12">
    <div class="mb-6 border-l-2 border-edge-strong pl-3">
      <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
        Live — scroll the panel to load more (list)
      </h2>
    </div>
    <div class="pl-3.5 flex flex-col gap-3 max-w-lg">
      <div class="h-72 overflow-y-auto rounded-surface border border-edge bg-surface-1 px-4">
        <PrtInfiniteScroll
          :autoload="false"
          :loading="listFeed.loading.value"
          :end-reached="listFeed.done.value"
          margin="80px"
          end-label="You have reached the first release"
          @load-more="listFeed.load"
        >
          <PrtListing view="list" dense :items="listFeed.items.value" />
        </PrtInfiniteScroll>
      </div>
      <p class="font-mono text-xs text-ink-faint">
        pre-filled (10 items) so nothing loads or shifts on mount — scroll
        the panel down and the IntersectionObserver sentinel loads 5 more
        (fake 600 ms latency). bounded height = the page never jumps.
        `autoload` is off here; turn it on only when you start empty.
      </p>
    </div>
  </section>

  <section class="mb-12">
    <div class="mb-6 border-l-2 border-edge-strong pl-3">
      <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
        Live — same engine, grid presentation
      </h2>
    </div>
    <div class="pl-3.5 flex flex-col gap-3 max-w-lg">
      <div class="h-96 overflow-y-auto rounded-surface border border-edge bg-surface-1 p-4">
        <PrtInfiniteScroll
          :autoload="false"
          :loading="gridFeed.loading.value"
          :end-reached="gridFeed.done.value"
          margin="80px"
          end-label="That's everything"
          @load-more="gridFeed.load"
        >
          <PrtListing item-min="11rem" :items="gridFeed.items.value" />
        </PrtInfiniteScroll>
      </div>
      <p class="font-mono text-xs text-ink-faint">
        the behavior component wraps anything — here a PrtListing grid in a
        bounded panel. scrollMargin (Cr 120 / Fx 141) lets the one observer
        detect the sentinel inside the clipping scroll container, no
        explicit-root workaround.
      </p>
    </div>
  </section>

  <DemoSection title="End state — #end slot and end-label prop" min="26rem">
    <DemoItem label='end-label prop (default "No more items")'>
      <PrtInfiniteScroll :end-reached="true" end-label="End of archive">
        <p class="py-2 text-sm text-ink-muted">214 of 214 entries shown.</p>
      </PrtInfiniteScroll>
    </DemoItem>
    <DemoItem label="#end slot replaces the default line">
      <PrtInfiniteScroll :end-reached="true">
        <p class="py-2 text-sm text-ink-muted">All deployments listed.</p>
        <template #end>
          <div class="flex justify-center py-4">
            <PrtBtn size="sm" variant="ghost">Back to top</PrtBtn>
          </div>
        </template>
      </PrtInfiniteScroll>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Loading row — default PrtLoader and the #loading slot" min="26rem">
    <DemoItem label="loading=true shows the default loader row">
      <PrtInfiniteScroll :loading="true">
        <p class="py-2 text-sm text-ink-muted">Fetching the next page…</p>
      </PrtInfiniteScroll>
    </DemoItem>
    <DemoItem label="#loading slot — skeleton rows instead">
      <PrtInfiniteScroll :loading="true">
        <p class="py-2 text-sm text-ink-muted">Fetching the next page…</p>
        <template #loading>
          <div class="flex flex-col gap-2 py-2">
            <PrtSkeleton class="h-10" />
            <PrtSkeleton class="h-10" />
          </div>
        </template>
      </PrtInfiniteScroll>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { computed, type ComputedRef, ref, type Ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

interface ChangeEntry {
  id: number
  title: string
  meta: string
}

// release-history register
const CHANGELOG: ChangeEntry[] = Array.from({ length: 25 }, (_, i) => {
  const minor = 25 - i
  return {
    id: minor,
    title: 'v2.' + minor + '.0 — incremental sync, faster cold starts',
    meta: 'released 2026-' + String(((25 - i) % 12) + 1).padStart(2, '0'),
  }
})

interface Feed {
  items: Ref<ChangeEntry[]>
  loading: Ref<boolean>
  done: ComputedRef<boolean>
  load: () => void
}

// PRE-FILLED feed: starts with `seed` items already present so the
// sentinel is below the bounded panel's fold on mount — no auto-load, no
// layout jump. `load` appends a page only when the user scrolls to it.
function boundedFeed(seed: number, page: number, latency: number): Feed {
  const items = ref<ChangeEntry[]>(CHANGELOG.slice(0, seed)) as Ref<ChangeEntry[]>
  const loading = ref(false)
  const done = computed(() => items.value.length >= CHANGELOG.length)
  function load() {
    if (loading.value || done.value) return
    loading.value = true
    window.setTimeout(() => {
      items.value = CHANGELOG.slice(0, items.value.length + page)
      loading.value = false
    }, latency)
  }
  return { items, loading, done, load }
}

const listFeed = boundedFeed(10, 5, 600)
const gridFeed = boundedFeed(9, 6, 600)
</script>
