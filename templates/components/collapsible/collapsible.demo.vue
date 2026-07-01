<template>
  <DemoSection title="Live — wired v-model" min="24rem">
    <DemoItem label="starts open (sandbox open=true); toggle it">
      <div class="flex flex-col gap-2">
        <PrtCollapsible v-model="open" label="Build settings">
          Target, output dir, env file — the usual suspects. The region
          animates to its real height, no max-height hacks.
        </PrtCollapsible>
        <span class="text-xs font-mono text-ink-faint">open: {{ open }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom trigger slot" min="24rem">
    <DemoItem label="#trigger gets { open } — compose your own row content">
      <PrtCollapsible v-model="open">
        <template #trigger="{ open: isOpen }">
          <span class="inline-flex items-center gap-2">
            <span class="i-lucide-folder text-ink-faint" aria-hidden="true" />
            <span>artifacts/</span>
            <span class="text-xs font-mono text-ink-faint">{{ isOpen ? '14 files' : '…' }}</span>
          </span>
        </template>
        dist/, coverage/, two stray .map files and a forgotten .DS_Store.
      </PrtCollapsible>
    </DemoItem>
  </DemoSection>

  <DemoSection title="States & edges" min="24rem">
    <DemoItem label="disabled">
      <PrtCollapsible :model-value="false" disabled label="Locked section" />
    </DemoItem>
    <DemoItem label="radius belongs to the GROUP — wrapper clips, filled bars stay square">
      <div class="rounded-surface overflow-hidden bg-surface-1">
        <PrtCollapsible v-model="open" variant="filled" label="What is a seed?">
          A pad from the rack — decorative color as a deliberate pluck.
        </PrtCollapsible>
        <PrtCollapsible v-model="show" variant="filled" label="Why square rows?">
          A full-width bar over a hairline is a square shape; rounding
          every bar is the bug.
        </PrtCollapsible>
        <PrtCollapsible v-model="expanded" variant="filled" label="Where does radius live?">
          On this wrapper: rounded-surface + overflow-hidden. Only the top
          corners of the first row and the bottom corners of the last row
          get clipped — inner rows never round.
        </PrtCollapsible>
      </div>
    </DemoItem>
    <DemoItem label="sizes — sm">
      <PrtCollapsible v-model="open" size="sm" label="Compact row">
        Dense-list scale.
      </PrtCollapsible>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Accordion — composed, not built in" min="24rem">
    <DemoItem label="three collapsibles + one piece of consumer state = exclusivity">
      <div class="flex flex-col">
        <PrtCollapsible
          :model-value="choice === 'general'"
          label="General"
          @update:model-value="choice = $event ? 'general' : ''"
        >
          Project name, visibility, default branch.
        </PrtCollapsible>
        <PrtCollapsible
          :model-value="choice === 'members'"
          label="Members"
          @update:model-value="choice = $event ? 'members' : ''"
        >
          Four humans, two bots. The bots file better issues.
        </PrtCollapsible>
        <PrtCollapsible
          :model-value="choice === 'danger'"
          label="Danger zone"
          @update:model-value="choice = $event ? 'danger' : ''"
        >
          Transfer, archive, delete — gated behind a dialog each.
        </PrtCollapsible>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Accordion — multiple open" min="24rem">
    <DemoItem label="independent v-models = multi-open; no exclusivity state at all">
      <div class="flex flex-col">
        <PrtCollapsible v-model="open" label="Routing">
          Master bus, two sends, sidechain off.
        </PrtCollapsible>
        <PrtCollapsible v-model="show" label="Effects">
          Tape saturation into a short plate.
        </PrtCollapsible>
        <PrtCollapsible v-model="expanded" label="Automation">
          Filter cutoff rides the second chorus.
        </PrtCollapsible>
      </div>
    </DemoItem>
    <DemoItem label="colored bars — seed marks via the trigger slot">
      <div class="flex flex-col">
        <PrtCollapsible v-model="open">
          <template #trigger>
            <span class="inline-flex items-center gap-2">
              <span data-seed="4" class="h-3.5 w-1 rounded-mark bg-[var(--seed,var(--surface-3))]" aria-hidden="true" />
              <span>Drums</span>
            </span>
          </template>
          Kick, snare, two overheads. 92 bpm.
        </PrtCollapsible>
        <PrtCollapsible v-model="show">
          <template #trigger>
            <span class="inline-flex items-center gap-2">
              <span data-seed="7" class="h-3.5 w-1 rounded-mark bg-[var(--seed,var(--surface-3))]" aria-hidden="true" />
              <span>Bass</span>
            </span>
          </template>
          DI + amp blend, mono below 120 Hz.
        </PrtCollapsible>
        <PrtCollapsible v-model="expanded">
          <template #trigger>
            <span class="inline-flex items-center gap-2">
              <span data-seed="2" class="h-3.5 w-1 rounded-mark bg-[var(--seed,var(--surface-3))]" aria-hidden="true" />
              <span>Synth lead</span>
            </span>
          </template>
          Mono legato, glide 40 ms, detuned saws.
        </PrtCollapsible>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const choice = ref<string | number>('')
const open = ref(true)
const show = ref(false)
const expanded = ref(false)
const files = ref<any[]>([])
</script>
