<template>
  <!-- Live section: useToast() is a composable import, which the slot model
       doesn't extract — so this section renders directly (the sanctioned
       direct-render case). The PrtToaster below is mounted by THIS page; in an
       app it lives at the root, once. -->
  <DemoSection title="Live — useToast() queue + one mounted PrtToaster" min="24rem">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <PrtBtn variant="outline" @click="toast.push({ intent: 'info', message: 'Reindex queued', description: 'Position 3 in queue.' })">info</PrtBtn>
        <PrtBtn variant="outline" @click="toast.push({ intent: 'success', message: 'Deploy finished' })">success</PrtBtn>
        <PrtBtn variant="outline" @click="toast.push({ intent: 'warning', message: 'Token expires in 2 days' })">warning</PrtBtn>
        <PrtBtn variant="outline" @click="toast.push({ intent: 'danger', message: 'Webhook failed', description: 'HTTP 502 from endpoint.' })">danger</PrtBtn>
      </div>
      <div class="flex flex-wrap gap-2">
        <PrtBtn variant="outline" @click="toast.push({ intent: 'success', variant: 'solid', message: 'Deploy finished', description: 'Build 412 is live.' })">solid success</PrtBtn>
        <PrtBtn variant="outline" @click="toast.push({ intent: 'danger', variant: 'solid', message: 'Webhook failed', description: 'HTTP 502 from endpoint.' })">solid danger</PrtBtn>
        <PrtBtn variant="outline" @click="toast.push({ intent: 'warning', variant: 'solid', message: 'Token expires in 2 days' })">solid warning</PrtBtn>
      </div>
      <div class="flex flex-wrap gap-2">
        <PrtBtn variant="outline" @click="toast.push({ message: 'Sticky until dismissed', duration: 0 })">sticky (duration: 0)</PrtBtn>
        <PrtBtn variant="outline" @click="burst()">burst of three</PrtBtn>
      </div>
      <div class="flex items-center gap-3 max-w-xs">
        <PrtSelect
          v-model="position"
          size="sm"
          :options="positions"
        />
        <span class="text-xs text-ink-faint font-mono shrink-0">toaster position</span>
      </div>
      <p class="text-xs text-ink-faint font-mono">
        useToast().push({ intent, variant?, message, description?, duration? }) — one method, no helper matrix
      </p>
    </div>
  </DemoSection>

  <DemoSection title="PrtToast — the presentational piece (floating sibling of PrtNotice)" min="22rem">
    <DemoItem label="success">
      <div class="flex"><PrtToast intent="success" message="Deploy finished" /></div>
    </DemoItem>
    <DemoItem label="with description">
      <div class="flex"><PrtToast intent="danger" message="Webhook failed" description="HTTP 502 from endpoint." /></div>
    </DemoItem>
    <DemoItem label="not dismissible">
      <div class="flex"><PrtToast message="Synced just now" :dismissible="false" /></div>
    </DemoItem>
    <DemoItem label="message via slot">
      <div class="flex">
        <PrtToast intent="info">
          Moved to <span class="font-mono">archive/2026</span>
        </PrtToast>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Solid — the attention-grabber (full intent bg, *-ink pairs)" min="22rem">
    <DemoItem label="success">
      <div class="flex"><PrtToast variant="solid" intent="success" message="Deploy finished" description="Build 412 is live." /></div>
    </DemoItem>
    <DemoItem label="danger">
      <div class="flex"><PrtToast variant="solid" intent="danger" message="Webhook failed" description="HTTP 502 from endpoint." /></div>
    </DemoItem>
    <DemoItem label="warning — dark ink on amber (the amber rule)">
      <div class="flex"><PrtToast variant="solid" intent="warning" message="Token expires in 2 days" /></div>
    </DemoItem>
    <DemoItem label="info">
      <div class="flex"><PrtToast variant="solid" intent="info" message="Reindex queued" description="Position 3 in queue." /></div>
    </DemoItem>
  </DemoSection>

  <PrtToaster :position="position" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@ui/toast'
import type { PrtToasterPosition } from '@ui/toast'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

const toast = useToast()

const position = ref<PrtToasterPosition>('bottom-right')
const positions = (
  [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const
).map((p) => ({ value: p, label: p }))

function burst() {
  toast.push({ intent: 'info', message: 'Build started' })
  toast.push({ intent: 'success', message: 'Cache warmed' })
  toast.push({ intent: 'warning', message: 'Two flaky checks skipped' })
}
</script>
