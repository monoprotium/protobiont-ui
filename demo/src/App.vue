<template>
  <div class="min-h-screen bg-surface-0 text-ink flex">
    <!-- sidebar -->
    <aside
      class="w-60 shrink-0 border-r border-edge bg-surface-1 px-4 py-5 flex flex-col gap-6 sticky top-0 h-screen overflow-y-auto"
    >
      <div class="flex items-start justify-between gap-2">
        <RouterLink to="/" class="block">
          <span class="font-light tracking-[0.2em] uppercase text-ink">Protobiont</span>
          <span class="block text-xs font-mono text-ink-faint mt-1">ui</span>
        </RouterLink>
        <button
          type="button"
          class="inline-flex items-center justify-center h-7 w-7 shrink-0 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors prt-ring"
          :aria-label="mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggle"
        >
          <span :class="mode === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" aria-hidden="true" />
        </button>
      </div>

      <nav class="flex flex-col gap-5 text-sm">
        <div>
          <p class="text-xs font-mono uppercase tracking-wider text-ink-faint mb-2">
            system
          </p>
          <RouterLink
            to="/seeds"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Seeds
          </RouterLink>
          <RouterLink
            to="/ink"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Ink
          </RouterLink>
          <RouterLink
            to="/arbitrary"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Arbitrary seeds
          </RouterLink>
          <RouterLink
            to="/theming"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Theming
          </RouterLink>
          <RouterLink
            to="/icons"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Icons
          </RouterLink>
          <RouterLink
            to="/elevation"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Elevation
          </RouterLink>
        </div>
        <div>
          <p class="text-xs font-mono uppercase tracking-wider text-ink-faint mb-2">
            examples
          </p>
          <RouterLink
            to="/forms"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Forms
          </RouterLink>
          <RouterLink
            to="/scrollbar"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Scrollbar
          </RouterLink>
          <RouterLink
            to="/splash"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Splashscreen
          </RouterLink>
          <RouterLink
            to="/checkout"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            Checkout
          </RouterLink>
        </div>
        <div v-for="group in groups" :key="group.category">
          <p class="text-xs font-mono uppercase tracking-wider text-ink-faint mb-2">
            {{ group.category }}
          </p>
          <RouterLink
            v-for="entry in group.entries"
            :key="entry.name"
            :to="`/c/${entry.folder}`"
            class="block px-2 py-1 rounded-control text-ink-muted hover:bg-wash hover:text-ink prt-motion-colors"
            active-class="bg-wash text-accent"
          >
            {{ entry.name }}
          </RouterLink>
        </div>
      </nav>

    </aside>

    <main class="flex-1 min-w-0">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMode } from '@ui/_shared/useMode'
import { gallery } from './router'

const { mode, toggle } = useMode()

const groups = computed(() =>
  ['base', 'composite', 'recipe']
    .map((category) => ({
      category,
      entries: gallery.filter((e) => e.category === category),
    }))
    .filter((g) => g.entries.length > 0),
)
</script>
