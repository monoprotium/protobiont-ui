<template>
  <DemoSection title="Live — brand directory without the letter rail" min="26rem">
    <DemoItem label=':rail="false" — grouped sections only; good for short or always-visible lists'>
      <PrtIndexBar :rail="false" :items="[
          'Arturia', 'Ableton', 'Behringer', 'Boss', 'Elektron', 'Eventide',
          'Fender', 'Focusrite', 'Korg', 'Moog', 'Make Noise', 'Mutable Instruments',
          'Native Instruments', 'Nord', 'Roland', 'Roli', 'Sequential', 'Strymon',
          'Teenage Engineering', 'Universal Audio', 'Waldorf', 'Yamaha'
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Live — brand directory with the letter rail" min="26rem">
    <DemoItem label="present letters jump; the scrollspy tracks the active section">
      <PrtIndexBar :items="[
          'Arturia', 'Ableton', 'Behringer', 'Boss', 'Elektron', 'Eventide',
          'Fender', 'Focusrite', 'Korg', 'Moog', 'Make Noise', 'Mutable Instruments',
          'Native Instruments', 'Nord', 'Roland', 'Roli', 'Sequential', 'Strymon',
          'Teenage Engineering', 'Universal Audio', 'Waldorf', 'Yamaha'
        ]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sparse data — displayEmptyLetters" min="26rem">
    <DemoItem label="off (default): only letters with items render sections">
      <PrtIndexBar :items="['Ampex', 'Otari', 'Studer', 'Tascam']" />
    </DemoItem>
    <DemoItem label="on: all 26 sections render; empty letters stay dimmed in the rail">
      <PrtIndexBar display-empty-letters :items="['Ampex', 'Otari', 'Studer', 'Tascam']" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Object items — itemKey + links" min="26rem">
    <DemoItem label="objects with url render as links; itemKey picks the name field">
      <PrtIndexBar
        item-key="vendor"
        :items="[
          { vendor: 'Arturia', url: '#arturia' },
          { vendor: 'Elektron', url: '#elektron' },
          { vendor: 'Erica Synths', url: '#erica' },
          { vendor: 'Strymon', url: '#strymon' }
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="#item and #letter slots" min="26rem">
    <DemoItem label="letter header with count; rich item rows">
      <PrtIndexBar
        item-key="name"
        :items="[
          { name: 'Make Noise', origin: 'Asheville, US' },
          { name: 'Mutable Instruments', origin: 'Paris, FR' },
          { name: 'Erica Synths', origin: 'Riga, LV' }
        ]"
      >
        <template #letter="{ letter, count }">
          <span class="font-mono text-xs uppercase tracking-wider text-accent">{{ letter }}</span>
          <span class="ml-2 font-mono text-xs text-ink-faint tabular-nums">{{ count }}</span>
        </template>
        <template #item="{ item }">
          <span class="text-sm text-ink">{{ item.name }}</span>
          <span class="ml-2 font-mono text-xs text-ink-faint">{{ item.origin }}</span>
        </template>
      </PrtIndexBar>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const count = ref(0)
</script>
