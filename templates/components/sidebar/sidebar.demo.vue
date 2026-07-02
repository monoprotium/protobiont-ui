<template>
  <DemoSection title="Live — collapse to the icon rail" min="34rem">
    <DemoItem label="v-model drives the rail (modelValue = collapsed); @select tracks the route">
      <div class="h-[26rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <PrtSidebar
          v-model="collapsed"
          :items="nav"
          :active="current"
          label="Workspace"
          @select="current = $event"
        >
          <template #header="{ collapsed: c }">
            <span class="inline-flex items-center gap-2 font-medium text-ink">
              <span class="i-lucide-hexagon text-accent" aria-hidden="true" />
              <span v-if="!c">Protobiont</span>
            </span>
          </template>
          <template #footer>
            <span class="inline-flex items-center gap-2 text-sm text-ink-muted min-w-0">
              <span class="i-lucide-circle-user shrink-0 text-ink-faint" aria-hidden="true" />
              <span class="truncate">admin@docker.localdev</span>
            </span>
          </template>
        </PrtSidebar>
        <main class="flex-1 min-w-0 p-5 overflow-auto">
          <p class="text-sm text-ink-muted">Current route:
            <span class="font-mono text-ink">{{ current }}</span>
          </p>
          <button
            class="mt-3 inline-flex items-center gap-2 h-8 px-3 rounded-control bg-surface-2 text-sm text-ink-muted hover:bg-surface-3 prt-motion-colors"
            @click="collapsed = !collapsed"
          >
            <span class="i-lucide-panel-left" aria-hidden="true" />
            {{ collapsed ? 'Expand' : 'Collapse' }}
          </button>
        </main>
      </div>
    </DemoItem>
    <DemoItem label="the header slot yields { collapsed, toggle } — wire your own control">
      <div class="h-[24rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <PrtSidebar v-model="ex.c2" :items="nav" :active="ex.cur2" @select="ex.cur2 = $event">
          <template #header="{ collapsed: c, toggle }">
            <button
              class="inline-flex items-center gap-2 font-medium text-ink rounded-control px-1 -mx-1 hover:bg-wash prt-motion-colors"
              @click="toggle()"
            >
              <span class="i-lucide-hexagon text-accent" aria-hidden="true" />
              <span v-if="!c">Protobiont</span>
            </button>
          </template>
        </PrtSidebar>
        <main class="flex-1 min-w-0 p-5 text-sm text-ink-faint">Click the brand to toggle the rail.</main>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Nested groups & the active route" min="34rem">
    <DemoItem label="a group auto-opens around its active child; the row gets the accent tick">
      <div class="h-[26rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <PrtSidebar :items="nav" :active="ex.cur3" @select="ex.cur3 = $event" />
        <main class="flex-1 min-w-0 p-5 overflow-auto">
          <p class="text-sm text-ink-muted">Open <span class="font-mono text-ink">Pipelines</span> and pick a child — the parent stays lit while a child is current.</p>
          <p class="mt-3 text-sm text-ink-muted">Current: <span class="font-mono text-ink">{{ ex.cur3 }}</span></p>
        </main>
      </div>
    </DemoItem>
    <DemoItem label="a child set active keeps its group open and highlighted">
      <div class="h-[24rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <PrtSidebar :items="nav" :active="'runs'" />
        <main class="flex-1 min-w-0 p-5 text-sm text-ink-faint">Pipelines · Runs is the current route.</main>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="The collapsed rail — tooltips & group flyouts" min="34rem">
    <DemoItem label='forced rail (:model-value="true"): hover a leaf for its label, click a group for its flyout'>
      <div class="h-[26rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <PrtSidebar :model-value="true" :items="nav" :active="ex.cur4" @select="ex.cur4 = $event">
          <template #header><span class="i-lucide-hexagon text-accent" aria-hidden="true" /></template>
        </PrtSidebar>
        <main class="flex-1 min-w-0 p-5 text-sm text-ink-faint">
          Leaf icons get a PrtTooltip; the Pipelines group opens an anchored flyout
          (the PrtMenu substrate). Current: <span class="font-mono text-ink">{{ ex.cur4 }}</span>
        </main>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Right edge & seeded tint" min="34rem">
    <DemoItem label='side="right" — border, drawer placement and flyout direction all flip'>
      <div class="h-[24rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <main class="flex-1 min-w-0 p-5 text-sm text-ink-faint">A right-docked nav — common for an inspector-style panel.</main>
        <PrtSidebar side="right" :items="nav" :active="ex.cur5" @select="ex.cur5 = $event" />
      </div>
    </DemoItem>
    <DemoItem label="seed tints the active row + the rail tick (cascades from data-seed)">
      <div class="h-[24rem] flex rounded-surface overflow-hidden ring-1 ring-edge bg-surface-0">
        <PrtSidebar seed="4" :items="nav" :active="ex.cur6" @select="ex.cur6 = $event" />
        <main class="flex-1 min-w-0 p-5 text-sm text-ink-faint">The active fill rides the seed cascade — no color prop.</main>
      </div>
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
// each other sidebar demo owns its own collapse/route so they don't mirror the first
const ex = ref<{ c2: boolean; cur2: string | number; cur3: string | number; cur4: string | number; cur5: string | number; cur6: string | number }>({ c2: false, cur2: 'projects', cur3: 'projects', cur4: 'projects', cur5: 'projects', cur6: 'projects' })
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
