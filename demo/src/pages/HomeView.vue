<template>
  <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Components
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        {{ filtered.length }} / {{ gallery.length }} · pick a component
      </p>
    </div>

    <input
      v-model="query"
      type="text"
      placeholder="filter…"
      class="mb-8 w-64 h-8 px-3 text-sm rounded-control bg-surface-2 border border-transparent text-ink placeholder:text-ink-faint outline-none focus-visible:border-accent prt-motion-colors"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <RouterLink
        v-for="entry in filtered"
        :key="entry.name"
        :to="`/c/${entry.folder}`"
        class="block bg-surface-1 border border-edge rounded-surface px-4 py-3 hover:border-edge-strong prt-motion-colors min-w-0"
      >
        <div class="flex items-baseline gap-2">
          <span class="text-ink font-medium truncate">{{ entry.name }}</span>
          <span class="text-xs font-mono text-ink-faint uppercase shrink-0">{{ entry.category }}</span>
        </div>
        <p class="mt-1 text-xs text-ink-faint line-clamp-2">
          {{ entry.description || '—' }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { gallery } from '../router'

const query = ref('')

const filtered = computed(() =>
  gallery.filter((e) =>
    e.name.toLowerCase().includes(query.value.toLowerCase()),
  ),
)
</script>
