<template>
  <DemoSection title="Vertical — the four alignments" min="26rem">
    <DemoItem label="start — line left, items right (default)">
      <PrtTimeline :items="[
          { title: 'v1.0 — first public build', description: 'CLI init/add/list, twelve components, the seed rack.' },
          { title: 'v1.4 — overlay tier', description: 'Native-dialog substrate, megamenu, drawer, tabs.' },
          { title: 'v2.0 — form layer', description: 'Standard Schema validation, display gating, field anatomy.' },
          { title: 'v2.3 — collection kit', description: 'Listing view model, facets, infinite scroll, this timeline.' }
        ]" />
    </DemoItem>
    <DemoItem label="end — line right, items left">
      <PrtTimeline align="end" :items="[
          { title: 'v1.0 — first public build', description: 'CLI init/add/list, twelve components, the seed rack.' },
          { title: 'v1.4 — overlay tier', description: 'Native-dialog substrate, megamenu, drawer, tabs.' },
          { title: 'v2.0 — form layer', description: 'Standard Schema validation, display gating, field anatomy.' },
          { title: 'v2.3 — collection kit', description: 'Listing view model, facets, infinite scroll, this timeline.' }
        ]" />
    </DemoItem>
    <DemoItem label="alternate — center line, first item LEFT">
      <PrtTimeline align="alternate" :items="[
          { title: 'v1.0 — first public build', description: 'CLI init/add/list, twelve components, the seed rack.' },
          { title: 'v1.4 — overlay tier', description: 'Native-dialog substrate, megamenu, drawer, tabs.' },
          { title: 'v2.0 — form layer', description: 'Standard Schema validation, display gating, field anatomy.' },
          { title: 'v2.3 — collection kit', description: 'Listing view model, facets, infinite scroll, this timeline.' }
        ]" />
    </DemoItem>
    <DemoItem label="alternate-reverse — first item RIGHT">
      <PrtTimeline align="alternate-reverse" :items="[
          { title: 'v1.0 — first public build', description: 'CLI init/add/list, twelve components, the seed rack.' },
          { title: 'v1.4 — overlay tier', description: 'Native-dialog substrate, megamenu, drawer, tabs.' },
          { title: 'v2.0 — form layer', description: 'Standard Schema validation, display gating, field anatomy.' },
          { title: 'v2.3 — collection kit', description: 'Listing view model, facets, infinite scroll, this timeline.' }
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Mark alignment — center (default) vs title line" min="26rem">
    <DemoItem label="center (default): mark sits at the card's vertical middle, like horizontal">
      <PrtTimeline :items="[
          { title: 'v1.0 — first public build', description: 'CLI init/add/list, twelve components, the seed rack. A longer note so the card runs multiple lines and the mark alignment reads clearly.' },
          { title: 'v2.0 — form layer', description: 'Standard Schema validation, display gating, field anatomy.' }
        ]" />
    </DemoItem>
    <DemoItem label='markAlign="title": mark pins to the heading line (better for tall, uneven cards)'>
      <PrtTimeline mark-align="title" :items="[
          { title: 'v1.0 — first public build', description: 'CLI init/add/list, twelve components, the seed rack. A longer note so the card runs multiple lines and the mark alignment reads clearly.' },
          { title: 'v2.0 — form layer', description: 'Standard Schema validation, display gating, field anatomy.' }
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Horizontal — the four alignments" min="40rem">
    <DemoItem label="start — line top, items below">
      <PrtTimeline orientation="horizontal" :items="[
          { title: 'Prototype', description: 'Breadboard build.' },
          { title: 'EVT', description: 'First enclosure run.' },
          { title: 'DVT', description: 'Audio path frozen.' },
          { title: 'Production', description: 'Mass run starts.' }
        ]" />
    </DemoItem>
    <DemoItem label="end — line bottom, items above">
      <PrtTimeline orientation="horizontal" align="end" :items="[
          { title: 'Prototype', description: 'Breadboard build.' },
          { title: 'EVT', description: 'First enclosure run.' },
          { title: 'DVT', description: 'Audio path frozen.' },
          { title: 'Production', description: 'Mass run starts.' }
        ]" />
    </DemoItem>
    <DemoItem label="alternate — center line, first item TOP">
      <PrtTimeline orientation="horizontal" align="alternate" :items="[
          { title: 'Prototype', description: 'Breadboard build.' },
          { title: 'EVT', description: 'First enclosure run.' },
          { title: 'DVT', description: 'Audio path frozen.' },
          { title: 'Production', description: 'Mass run starts.' }
        ]" />
    </DemoItem>
    <DemoItem label="alternate-reverse — first item BOTTOM">
      <PrtTimeline orientation="horizontal" align="alternate-reverse" :items="[
          { title: 'Prototype', description: 'Breadboard build.' },
          { title: 'EVT', description: 'First enclosure run.' },
          { title: 'DVT', description: 'Audio path frozen.' },
          { title: 'Production', description: 'Mass run starts.' }
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeded marks — per-item plucks from the rack" min="26rem">
    <DemoItem label="seed: per-item mark color via the rack">
      <PrtTimeline
        :items="[
          { title: 'Incident opened', description: 'Latency p99 above threshold.', seed: '8' },
          { title: 'Mitigation deployed', description: 'Cache layer bypassed.', seed: '9' },
          { title: 'Resolved', description: 'Error budget recovering.', seed: '7' }
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="#item — rich content, uneven heights" min="40rem">
    <DemoItem label="the grid engine handles uneven cards (fixed w-64 is dead)">
      <PrtTimeline orientation="horizontal" align="alternate" :items="[
          { title: 'Prototype', description: 'Breadboard build.' },
          { title: 'EVT', description: 'First enclosure run.' },
          { title: 'DVT', description: 'Audio path frozen.' },
          { title: 'Production', description: 'Mass run starts.' }
        ]">
        <template #item="{ item, index }">
          <div class="rounded-none border border-edge bg-surface-2 px-4 py-3">
            <p class="font-mono text-xs text-ink-faint">phase {{ index + 1 }}</p>
            <p class="mt-1 text-sm font-medium text-ink">{{ item.title }}</p>
            <p v-if="index % 2 === 0" class="mt-1 text-sm text-ink-muted">{{ item.description }} Longer annotation to prove uneven heights keep the line centered.</p>
          </div>
        </template>
      </PrtTimeline>
    </DemoItem>
  </DemoSection>

  <DemoSection title="#mark — custom marks" min="26rem">
    <DemoItem label="icon mark on the punched gap">
      <PrtTimeline
        :items="[
          { title: 'Repository created', description: 'Initial commit, license, CI.' },
          { title: 'First release tagged', description: 'Changelog automation wired.' }
        ]"
      >
        <template #mark>
          <span class="flex h-5 w-5 items-center justify-center rounded-mark border-2 border-surface-0 bg-surface-2">
            <span class="i-lucide-git-commit-horizontal text-xs text-accent" />
          </span>
        </template>
      </PrtTimeline>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const view = ref<'grid' | 'list'>('grid')
</script>
