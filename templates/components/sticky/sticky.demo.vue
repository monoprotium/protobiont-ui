<template>
  <DemoSection title="Drop-in sticky header — scroll the panel; the bar gains a hairline on pin" min="26rem">
    <DemoItem label="PrtSticky inside a scrollable panel (auto-detects the scroll root)">
      <div class="h-56 overflow-y-auto rounded-surface border border-edge">
        <PrtSticky :top="0">
          <div class="flex items-center justify-between px-4 py-3">
            <span class="font-medium text-ink">Presets</span>
            <span class="text-xs font-mono text-ink-faint">42 items</span>
          </div>
        </PrtSticky>
        <div class="space-y-3 p-4 text-sm text-ink-muted">
          <p>Patches are stored as plain text; the arpeggiator syncs to MIDI clock and survives tempo changes. Scroll to pin the header.</p><p>Patches are stored as plain text; the arpeggiator syncs to MIDI clock and survives tempo changes. Scroll to pin the header.</p><p>Patches are stored as plain text; the arpeggiator syncs to MIDI clock and survives tempo changes. Scroll to pin the header.</p><p>Patches are stored as plain text; the arpeggiator syncs to MIDI clock and survives tempo changes. Scroll to pin the header.</p><p>Patches are stored as plain text; the arpeggiator syncs to MIDI clock and survives tempo changes. Scroll to pin the header.</p><p>Patches are stored as plain text; the arpeggiator syncs to MIDI clock and survives tempo changes. Scroll to pin the header.</p>
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Scoped sticky — each header pins within its section, releases at its end" min="26rem">
    <DemoItem label="group headers: each PrtSticky is bounded by its <section> (stacked sticky)">
      <div class="h-72 overflow-y-auto rounded-surface border border-edge">
        <section>
          <PrtSticky :top="0">
            <div class="bg-surface-1 px-4 py-2 text-xs font-mono uppercase tracking-wide text-ink-muted">Oscillators</div>
          </PrtSticky>
          <ul class="divide-y divide-edge">
            <li class="px-4 py-3 text-sm text-ink-muted">Saw</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Square</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Sine</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Triangle</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Noise</li>
          </ul>
        </section>
        <section>
          <PrtSticky :top="0">
            <div class="bg-surface-1 px-4 py-2 text-xs font-mono uppercase tracking-wide text-ink-muted">Filters</div>
          </PrtSticky>
          <ul class="divide-y divide-edge">
            <li class="px-4 py-3 text-sm text-ink-muted">Ladder</li>
            <li class="px-4 py-3 text-sm text-ink-muted">State-variable</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Comb</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Formant</li>
          </ul>
        </section>
        <section>
          <PrtSticky :top="0">
            <div class="bg-surface-1 px-4 py-2 text-xs font-mono uppercase tracking-wide text-ink-muted">Effects</div>
          </PrtSticky>
          <ul class="divide-y divide-edge">
            <li class="px-4 py-3 text-sm text-ink-muted">Reverb</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Delay</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Chorus</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Bitcrush</li>
            <li class="px-4 py-3 text-sm text-ink-muted">Drive</li>
          </ul>
        </section>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
