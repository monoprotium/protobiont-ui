<template>
  <DemoSection title="Text — the default badge is a label, not a number" min="22rem">
    <DemoItem label="release row">
      <div class="flex items-center gap-2 text-sm text-ink-muted">
        <span>payments-service</span>
        <PrtBadge>BETA</PrtBadge>
        <PrtBadge>v2.4.1</PrtBadge>
      </div>
    </DemoItem>
    <DemoItem label="longer labels stay rectangular">
      <div class="flex flex-wrap items-center gap-2">
        <PrtBadge>IN REVIEW</PrtBadge>
        <PrtBadge>DEPRECATED</PrtBadge>
        <PrtBadge>READ ONLY</PrtBadge>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Intents — true states on semantic tokens; intent beats seed" min="24rem">
    <DemoItem label="state words, not digits">
      <div class="flex flex-wrap items-center gap-2">
        <PrtBadge intent="info">QUEUED</PrtBadge>
        <PrtBadge intent="success">DEPLOYED</PrtBadge>
        <PrtBadge intent="warning">DEGRADED</PrtBadge>
        <PrtBadge intent="danger">FAILED</PrtBadge>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — decoration; quiet surface when unseeded" min="24rem">
    <DemoItem label="category labels, the full rack">
      <div class="flex flex-wrap items-center gap-2">
        <PrtBadge>UNSEEDED</PrtBadge>
        <PrtBadge seed="1">API</PrtBadge>
        <PrtBadge seed="2">INFRA</PrtBadge>
        <PrtBadge seed="3">BACKEND</PrtBadge>
        <PrtBadge seed="4">DESIGN</PrtBadge>
        <PrtBadge seed="5">DATA</PrtBadge>
        <PrtBadge seed="6">DOCS</PrtBadge>
        <PrtBadge seed="7">OPS</PrtBadge>
        <PrtBadge seed="8">GAME</PrtBadge>
        <PrtBadge seed="9">AUDIO</PrtBadge>
        <PrtBadge seed="10">WEB</PrtBadge>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges — rounded (mark radius) is the default; pill is the exception" min="22rem">
    <DemoItem label="rounded (default) / square / pill (opt-in)">
      <div class="flex flex-wrap items-center gap-2">
        <PrtBadge>ROUNDED</PrtBadge>
        <PrtBadge edges="square">SQUARE</PrtBadge>
        <PrtBadge edges="pill">PILL</PrtBadge>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Counts — the edge case, not the default" min="16rem">
    <DemoItem label="sidebar row">
      <div class="flex items-center justify-between text-sm text-ink-muted">
        <span>Inbox</span>
        <PrtBadge :count="12" />
      </div>
    </DemoItem>
    <DemoItem label="overflow clamps at max (99 default)">
      <div class="flex"><PrtBadge :count="120" /></div>
    </DemoItem>
    <DemoItem label="live — count bound to state">
      <div class="flex items-center gap-3">
        <PrtBtn size="sm" variant="outline" @click="count++">notify</PrtBtn>
        <PrtBadge :count="count" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Dot — presence/status; the one legit circle, and small" min="16rem">
    <DemoItem label="status row — all four intents">
      <div class="flex items-center gap-2 text-sm text-ink-muted">
        <PrtBadge dot intent="success" />
        <span>API</span>
        <PrtBadge dot intent="danger" class="ml-3" />
        <span>Worker</span>
        <PrtBadge dot intent="warning" class="ml-3" />
        <span>Queue</span>
        <PrtBadge dot intent="info" class="ml-3" />
        <span>Indexer</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Positioned — corner overlay on a relative wrapper, all four corners" min="12rem">
    <DemoItem label="top-right">
      <div class="flex">
        <span class="relative inline-flex">
          <PrtBtn variant="outline">Button</PrtBtn>
          <PrtBadge intent="success" position="top-right">NEW</PrtBadge>
        </span>
      </div>
    </DemoItem>
    <DemoItem label="top-left">
      <div class="flex">
        <span class="relative inline-flex">
          <PrtBtn variant="outline">Button</PrtBtn>
          <PrtBadge intent="success" position="top-left">NEW</PrtBadge>
        </span>
      </div>
    </DemoItem>
    <DemoItem label="bottom-right">
      <div class="flex">
        <span class="relative inline-flex">
          <PrtBtn variant="outline">Button</PrtBtn>
          <PrtBadge intent="success" position="bottom-right">NEW</PrtBadge>
        </span>
      </div>
    </DemoItem>
    <DemoItem label="bottom-left">
      <div class="flex">
        <span class="relative inline-flex">
          <PrtBtn variant="outline">Button</PrtBtn>
          <PrtBadge intent="success" position="bottom-left">NEW</PrtBadge>
        </span>
      </div>
    </DemoItem>
    <DemoItem label="count on a button">
      <div class="flex">
        <span class="relative inline-flex">
          <PrtBtn variant="outline">Alerts</PrtBtn>
          <PrtBadge :count="3" intent="danger" position="top-right" />
        </span>
      </div>
    </DemoItem>
    <DemoItem label="dot on an avatar">
      <div class="flex">
        <span class="relative inline-flex">
          <PrtAvatar initials="AK" seed="4" />
          <PrtBadge dot intent="success" position="bottom-right" />
        </span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="20rem">
    <DemoItem label="sm / base / lg">
      <div class="flex items-center gap-2">
        <PrtBadge size="sm">DRAFT</PrtBadge>
        <PrtBadge>DRAFT</PrtBadge>
        <PrtBadge size="lg">DRAFT</PrtBadge>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (the file is the shared scope — same behavior as
// the old per-file sandbox). canonical decl strings live in SourcePanel.sandboxDecls.
const count = ref(0)
</script>
