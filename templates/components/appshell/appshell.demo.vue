<template>
  <DemoSection title="The full frame" min="34rem">
    <DemoItem label="header + sidebar + main + footer — collapse the rail, main re-offsets">
      <PrtAppShell
        class="rounded-surface overflow-hidden ring-1 ring-edge"
        style="--prt-appshell-h: 28rem"
      >
        <template #header>
          <div class="flex items-center justify-between h-14 px-4 border-b border-edge">
            <span class="inline-flex items-center gap-2 font-medium text-ink">
              <span class="i-lucide-hexagon text-accent" aria-hidden="true" />
              Protobiont
            </span>
            <button
              class="inline-flex items-center gap-2 h-8 px-3 rounded-control text-sm text-ink-muted hover:bg-wash prt-motion-colors"
              @click="collapsed = !collapsed"
            >
              <span class="i-lucide-panel-left" aria-hidden="true" /> Rail
            </button>
          </div>
        </template>

        <template #sidebar>
          <PrtSidebar
            v-model="collapsed"
            :items="nav"
            :active="current"
            @select="current = $event"
          />
        </template>

        <section class="p-6">
          <h1 class="text-lg font-medium text-ink">{{ current }}</h1>
          <p class="mt-2 text-sm text-ink-muted max-w-prose">
            Main is the only scroll container. The sidebar carries its own width; this
            frame just positions the regions — it owns no collapse state.
          </p>
        </section>

        <template #footer>
          <div class="h-9 px-4 flex items-center text-xs font-mono text-ink-faint border-t border-edge">
            protobiont-ui · build 58
          </div>
        </template>
      </PrtAppShell>
    </DemoItem>
  </DemoSection>

  <DemoSection title="With a right aside" min="34rem">
    <DemoItem label="an #aside inspector — its auto track appears only when the slot is filled">
      <PrtAppShell
        class="rounded-surface overflow-hidden ring-1 ring-edge"
        style="--prt-appshell-h: 26rem"
      >
        <template #sidebar>
          <PrtSidebar v-model="collapsed" :items="nav" :active="current" @select="current = $event" />
        </template>

        <section class="p-6 text-sm text-ink-muted">
          A three-column desktop layout: nav, content, and a detail rail.
        </section>

        <template #aside>
          <div class="w-64 h-full p-4 border-l border-edge">
            <h2 class="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-ink-faint">Details</h2>
            <p class="mt-2 text-sm text-ink-muted">Inspector content for <span class="font-mono text-ink">{{ current }}</span>.</p>
          </div>
        </template>
      </PrtAppShell>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Optional regions collapse cleanly" min="34rem">
    <DemoItem label="no #sidebar slot — its auto track is 0, main spans full width, no jump">
      <PrtAppShell
        class="rounded-surface overflow-hidden ring-1 ring-edge"
        style="--prt-appshell-h: 20rem"
      >
        <template #header>
          <div class="flex items-center h-14 px-4 border-b border-edge font-medium text-ink">Docs</div>
        </template>
        <article class="p-6 text-sm text-ink-muted max-w-prose">
          A header + main shell — no sidebar, no footer. The empty grid tracks collapse
          to zero, so this is the same frame doing less.
        </article>
      </PrtAppShell>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const collapsed = ref(false)
const current = ref<string | number>('projects')
const nav = [
  { label: 'Workspace', items: [
    { value: 'overview', label: 'Overview', icon: 'i-lucide-layout-dashboard' },
    { value: 'projects', label: 'Projects', icon: 'i-lucide-folder-kanban', badge: '12' },
    { value: 'analytics', label: 'Analytics', icon: 'i-lucide-chart-line' },
  ] },
  { label: 'Build', items: [
    { value: 'pipelines', label: 'Pipelines', icon: 'i-lucide-git-branch', children: [
      { value: 'runs', label: 'Runs' },
      { value: 'schedules', label: 'Schedules' },
      { value: 'caches', label: 'Caches' },
    ] },
    { value: 'artifacts', label: 'Artifacts', icon: 'i-lucide-package' },
    { value: 'registry', label: 'Registry', icon: 'i-lucide-container' },
  ] },
  { label: 'Account', items: [
    { value: 'settings', label: 'Settings', icon: 'i-lucide-settings' },
    { value: 'billing', label: 'Billing', icon: 'i-lucide-credit-card' },
  ] },
]
</script>
