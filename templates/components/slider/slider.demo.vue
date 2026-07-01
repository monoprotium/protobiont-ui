<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="drag, arrows, Home/End — watch it echo">
      <div class="flex flex-col gap-2">
        <PrtSlider v-model="level" />
        <span class="text-xs font-mono text-ink-faint">level: {{ level }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="DAW fader strip — relative drag, dB taper, 0 dB detent" min="19rem">
    <DemoItem label="vertical · relative · wheel on · dbl-click = unity · shift = fine">
      <div class="flex items-end gap-8">
        <div v-for="(name, i) in ['Kick', 'Snare', 'Bass', 'Lead Vox']" :key="name"
          class="flex flex-col items-center gap-3">
          <PrtSlider
            v-model="gains[i]"
            orientation="vertical"
            interaction-mode="relative"
            taper="db"
            :min="-60"
            :max="6"
            :default-value="0"
            :detents="[0]"
            :sensitivity="300"
            wheel
            readout
            :format="(v) => (v <= -60 ? '−∞' : v.toFixed(1)) + ' dB'"
          />
          <span class="text-xs font-mono uppercase text-ink-faint">{{ name }}</span>
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Price range — dual thumb, step 10" min="19rem">
    <DemoItem label="array model = dual; emits fresh [lo, hi], clamp collision">
      <div class="flex flex-col gap-2">
        <PrtSlider v-model="range" :min="0" :max="1000" :step="10" readout
          :format="(v) => '€' + v" />
        <span class="text-xs font-mono text-ink-faint">€{{ range[0] }} – €{{ range[1] }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Log taper — 20 Hz to 20 kHz" min="19rem">
    <DemoItem label="arrows step in phase, uniform across the decades">
      <div class="flex flex-col gap-2">
        <PrtSlider v-model="freq" taper="log" :min="20" :max="20000" readout
          :format="(v) => v >= 1000 ? (v / 1000).toFixed(1) + ' kHz' : Math.round(v) + ' Hz'" />
        <span class="text-xs font-mono text-ink-faint">cutoff: {{ freq >= 1000 ? (freq / 1000).toFixed(1) + ' kHz' : Math.round(freq) + ' Hz' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Ticks + snap" min="19rem">
    <DemoItem label="step 25 with marks at the stops">
      <PrtSlider v-model="level" :step="25" :ticks="[0, 25, 50, 75, 100]" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Relative drag (horizontal)" min="19rem">
    <DemoItem label="no jump on grab — deltas accumulate; track press still jumps">
      <PrtSlider v-model="level" interaction-mode="relative" :sensitivity="300" readout />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Collision — dual thumb crossing policy" min="19rem">
    <DemoItem label="clamp (default): thumbs stop at each other">
      <PrtSlider v-model="range" :max="1000" collision="clamp" />
    </DemoItem>
    <DemoItem label="push: dragging through shoves the other thumb">
      <PrtSlider v-model="range" :max="1000" collision="push" />
    </DemoItem>
    <DemoItem label="swap: thumbs cross and trade places">
      <PrtSlider v-model="range" :max="1000" collision="swap" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <PrtSlider v-model="level" size="sm" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtSlider v-model="level" size="lg" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges" min="19rem">
    <DemoItem label="square">
      <PrtSlider v-model="level" edges="square" />
    </DemoItem>
    <DemoItem label="rounded (default)">
      <PrtSlider v-model="level" edges="rounded" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Vertical" min="19rem">
    <DemoItem label="default 12rem tall — any height utility on class wins">
      <div class="flex gap-10">
        <PrtSlider v-model="level" orientation="vertical" />
        <PrtSlider v-model="level" orientation="vertical" class="h-32" size="lg" />
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="disabled">
      <PrtSlider :model-value="40" disabled />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const level = ref(35)
const range = ref<[number, number]>([120, 480])
const gains = ref([0, -7.5, -3, -12])
const freq = ref(640)
</script>
