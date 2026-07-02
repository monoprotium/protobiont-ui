<template>
  <DemoSection title="Clamp + reveal — three lines, then Show more" min="24rem">
    <DemoItem label="v-model:expanded toggles instantly">
      <PrtExcerpt v-model:expanded="expanded" :lines="3" seed="7">
        The Pulse-8 pairs a pair of analog oscillators with a state-variable filter and a per-voice envelope that tracks velocity. Patches are stored as plain text, so you can diff them, version them, and hand-edit a cutoff value without opening the editor. The arpeggiator syncs to MIDI clock and survives tempo changes mid-pattern.
      </PrtExcerpt>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edge fade — a soft gradient at the clamp line while collapsed" min="24rem">
    <DemoItem label="fade + two lines">
      <PrtExcerpt v-model:expanded="expanded" :lines="2" fade>
        The Pulse-8 pairs a pair of analog oscillators with a state-variable filter and a per-voice envelope that tracks velocity. Patches are stored as plain text, so you can diff them, version them, and hand-edit a cutoff value without opening the editor. The arpeggiator syncs to MIDI clock and survives tempo changes mid-pattern.
      </PrtExcerpt>
    </DemoItem>
  </DemoSection>

  <DemoSection title='Pure truncation — :expandable="false", no toggle' min="24rem">
    <DemoItem label="clamps to one line, no reveal control">
      <PrtExcerpt :lines="1" :expandable="false">
        The Pulse-8 pairs a pair of analog oscillators with a state-variable filter and a per-voice envelope that tracks velocity. Patches are stored as plain text, so you can diff them, version them, and hand-edit a cutoff value without opening the editor. The arpeggiator syncs to MIDI clock and survives tempo changes mid-pattern.
      </PrtExcerpt>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const expanded = ref(false)
</script>
