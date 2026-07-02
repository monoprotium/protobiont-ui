<template>
  <DemoSection title="Live — kebab trigger, the card-menu classic" min="19rem">
    <DemoItem label="groups + a danger item; the action echoes below">
      <div class="flex flex-col gap-2">
        <PrtMenu
          :items="[
            { label: 'Actions', items: [
              { label: 'Duplicate', value: 'duplicate', icon: 'i-lucide-copy' },
              { label: 'Rename', value: 'rename', icon: 'i-lucide-pencil' },
            ]},
            { items: [
              { label: 'Delete', value: 'delete', icon: 'i-lucide-trash-2', danger: true },
            ]},
          ]"
          @select="value = String($event)"
        >
          <template #default="{ props: trigger }">
            <button
              v-bind="trigger"
              class="inline-flex items-center justify-center h-8 w-8 rounded-control bg-transparent text-ink-muted hover:text-ink hover:bg-wash cursor-pointer prt-motion-colors"
            >
              <span class="i-lucide-ellipsis-vertical" aria-hidden="true" />
              <span class="sr-only">Card actions</span>
            </button>
          </template>
        </PrtMenu>
        <span class="text-xs font-mono text-ink-faint">last action: {{ value || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Button trigger — flat items" min="19rem">
    <DemoItem label="any element triggers; v-bind the slot props">
      <PrtMenu
        :items="[
          { label: 'Export as WAV', value: 'wav' },
          { label: 'Export as FLAC', value: 'flac' },
          { label: 'Export stems', value: 'stems', disabled: true },
        ]"
        @select="value = String($event)"
      >
        <template #default="{ props: trigger }">
          <PrtBtn v-bind="trigger" variant="outline">
            Export
            <span class="i-lucide-chevron-down text-xs" aria-hidden="true" />
          </PrtBtn>
        </template>
      </PrtMenu>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Placements" min="19rem">
    <DemoItem label="top-start — opens upward">
      <PrtMenu
        placement="top-start"
        :items="[
          { label: 'Copy link', value: 'copy' },
          { label: 'Open in new tab', value: 'open' },
        ]"
        @select="value = String($event)"
      >
        <template #default="{ props: trigger }">
          <PrtBtn v-bind="trigger" variant="ghost">Share</PrtBtn>
        </template>
      </PrtMenu>
    </DemoItem>
    <DemoItem label="bottom-end — right-aligns under the trigger">
      <PrtMenu
        placement="bottom-end"
        :items="[
          { label: 'Profile', value: 'profile', icon: 'i-lucide-user' },
          { label: 'Sign out', value: 'signout', icon: 'i-lucide-log-out' },
        ]"
        @select="value = String($event)"
      >
        <template #default="{ props: trigger }">
          <PrtBtn v-bind="trigger" variant="ghost">Account</PrtBtn>
        </template>
      </PrtMenu>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Square edges" min="19rem">
    <DemoItem label='edges="square" on panel rows too'>
      <PrtMenu
        edges="square"
        :items="[
          { label: 'Cut', value: 'cut' },
          { label: 'Copy', value: 'copy' },
          { label: 'Paste', value: 'paste' },
        ]"
        @select="value = String($event)"
      >
        <template #default="{ props: trigger }">
          <PrtBtn v-bind="trigger" variant="outline" edges="square">Edit</PrtBtn>
        </template>
      </PrtMenu>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Disabled" min="19rem">
    <DemoItem label="no popovertarget while disabled — the trigger goes inert">
      <PrtMenu
        disabled
        :items="[{ label: 'Unavailable', value: 'x' }]"
      >
        <template #default="{ props: trigger }">
          <PrtBtn v-bind="trigger" variant="outline" disabled>Locked menu</PrtBtn>
        </template>
      </PrtMenu>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const open = ref(true)
const tab = ref<string | number>('overview')
</script>
