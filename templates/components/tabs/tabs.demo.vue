<template>
  <DemoSection title="Live — wired v-model" min="24rem">
    <DemoItem label="click around; the value echoes">
      <div class="flex flex-col gap-2">
        <PrtTabs
          v-model="tab"
          :items="[
            { value: 'overview', label: 'Overview' },
            { value: 'activity', label: 'Activity' },
            { value: 'settings', label: 'Settings' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">tab: {{ tab }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Panels via slots" min="24rem">
    <DemoItem label="#panel-{value} renders under the row">
      <PrtTabs
        v-model="tab"
        :items="[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' },
        ]"
      >
        <template #panel-overview>
          Twelve services, all green. Last deploy 14 minutes ago.
        </template>
        <template #panel-activity>
          3 merges today. The nightly job is two minutes slow.
        </template>
      </PrtTabs>
    </DemoItem>
  </DemoSection>

  <DemoSection title="The whole widget — bar + panels as one surface" min="24rem">
    <DemoItem label="a contained tabs panel; shared min-h keeps the surface steady">
      <div class="border border-edge bg-surface-1">
        <PrtTabs
          v-model="tab"
          class="px-4 pt-1"
          :items="[
            { value: 'overview', label: 'Overview', icon: 'i-lucide-layout-dashboard' },
            { value: 'activity', label: 'Activity', icon: 'i-lucide-git-branch' },
            { value: 'settings', label: 'Settings', icon: 'i-lucide-settings' },
          ]"
        >
          <template #panel-overview>
            <div class="min-h-44 pb-4 text-sm">
              <div class="flex items-center justify-between border-b border-edge py-2.5">
                <span class="text-xs font-mono uppercase tracking-wider text-ink-faint">status</span>
                <PrtBadge intent="success">healthy</PrtBadge>
              </div>
              <div class="flex items-center justify-between border-b border-edge py-2.5">
                <span class="text-xs font-mono uppercase tracking-wider text-ink-faint">services</span>
                <span class="tabular-nums text-ink">12 / 12</span>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <span class="text-xs font-mono uppercase tracking-wider text-ink-faint">last deploy</span>
                <span class="tabular-nums text-ink-muted">14 min ago</span>
              </div>
            </div>
          </template>
          <template #panel-activity>
            <div class="min-h-44 pb-4 text-sm">
              <div class="flex items-baseline gap-3 border-b border-edge py-2.5">
                <span class="shrink-0 text-xs font-mono tabular-nums text-ink-faint">16:41</span>
                <span class="truncate text-ink">merge: rework seed derivation knobs</span>
              </div>
              <div class="flex items-baseline gap-3 border-b border-edge py-2.5">
                <span class="shrink-0 text-xs font-mono tabular-nums text-ink-faint">15:02</span>
                <span class="truncate text-ink">deploy: v2.4.1 to production</span>
              </div>
              <div class="flex items-baseline gap-3 py-2.5">
                <span class="shrink-0 text-xs font-mono tabular-nums text-ink-faint">11:37</span>
                <span class="truncate text-ink-muted">nightly job finished 2 min slow</span>
              </div>
            </div>
          </template>
          <template #panel-settings>
            <div class="min-h-44 pb-4 flex flex-col gap-4">
              <PrtFormField
                v-model="value"
                label="Project name"
                placeholder="my-project"
                helper-text="Lowercase, no spaces."
              />
              <div>
                <PrtBtn size="sm" variant="outline">Save changes</PrtBtn>
              </div>
            </div>
          </template>
        </PrtTabs>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Icons + disabled item" min="24rem">
    <DemoItem label="icon class strings; Billing is locked">
      <PrtTabs
        v-model="tab"
        :items="[
          { value: 'overview', label: 'Overview', icon: 'i-lucide-layout-dashboard' },
          { value: 'members', label: 'Members', icon: 'i-lucide-users' },
          { value: 'billing', label: 'Billing', icon: 'i-lucide-credit-card', disabled: true },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="24rem">
    <DemoItem label="sm">
      <PrtTabs
        v-model="tab"
        size="sm"
        :items="[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' },
        ]"
      />
    </DemoItem>
    <DemoItem label="lg">
      <PrtTabs
        v-model="tab"
        size="lg"
        :items="[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Tabs as pure nav — no panels, you switch the content" min="24rem">
    <DemoItem label="the row is the whole component; routing is yours">
      <div class="flex flex-col gap-3">
        <PrtTabs
          v-model="tab"
          :items="[
            { value: 'overview', label: 'Overview' },
            { value: 'activity', label: 'Activity' },
            { value: 'settings', label: 'Settings' },
          ]"
        />
        <div class="text-sm text-ink-muted">
          <span v-if="tab === 'overview'">Overview pane (your router-view).</span>
          <span v-else-if="tab === 'activity'">Activity pane.</span>
          <span v-else>Settings pane.</span>
        </div>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const tab = ref<string | number>('overview')
</script>
