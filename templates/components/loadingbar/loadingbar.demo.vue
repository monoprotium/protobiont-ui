<template>
  <!-- Live section: useLoadingBar() is a composable import, which the slot model
       doesn't extract — the sanctioned direct-render case. The local-placement
       instance below keeps the demo inside its panel; in an app you mount
       ONE <PrtLoadingBar /> at root (fixed viewport top by default). -->
  <DemoSection title="Live — useLoadingBar() lifecycle: simulated async" min="28rem">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <PrtBtn variant="outline" @click="bar.start()">start (trickle)</PrtBtn>
        <PrtBtn variant="outline" @click="bar.finish()">finish</PrtBtn>
        <PrtBtn variant="outline" @click="bar.error()">error</PrtBtn>
        <PrtBtn variant="outline" @click="simulate()">simulate request (2.5s)</PrtBtn>
      </div>
      <p class="text-xs text-ink-faint font-mono">
        progress: {{ Math.round(bar.progress.value) }}% — start() trickles toward 90 with
        shrinking steps; finish() snaps to 100 and fades; error() completes in danger;
        set(n) for real progress. left alone, it auto-finishes after 10s — a bar stuck
        at 90 reads broken. every mounted instance renders the same singleton (look up:
        the fixed top bar runs too)
      </p>
      <div class="relative h-24 bg-surface-1 border border-edge rounded-surface overflow-hidden">
        <PrtLoadingBar placement="local" />
        <div class="p-4 text-sm text-ink-muted">page content…</div>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="Mounting — once, at app root" min="22rem">
    <DemoItem label="default: fixed viewport top — hit start and look up">
      <PrtLoadingBar />
    </DemoItem>
    <DemoItem label='embedded: placement="local" in a relative container'>
      <div class="relative h-16 bg-surface-1 border border-edge rounded-surface overflow-hidden">
        <PrtLoadingBar placement="local" seed="4" />
        <div class="p-4 text-sm text-ink-muted">seeded, local</div>
      </div>
    </DemoItem>
    <DemoItem label="sm — hairline">
      <div class="relative h-16 bg-surface-1 border border-edge rounded-surface overflow-hidden">
        <PrtLoadingBar placement="local" size="sm" />
        <div class="p-4 text-sm text-ink-muted">size="sm"</div>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { useLoadingBar } from '@ui/loadingbar'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

const bar = useLoadingBar()

function simulate() {
  bar.start()
  setTimeout(() => bar.finish(), 2500)
}
</script>
