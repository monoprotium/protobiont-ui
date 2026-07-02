<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="right (default) — Esc / scrim / X all slide it out">
      <div>
        <PrtBtn @click="show = true">Open drawer</PrtBtn>
        <PrtDrawer v-model="show">
          <template #title>Track inspector</template>
          Gain, pan, sends — the side panel pattern. Body scrolls; the
          header stays.
        </PrtDrawer>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Placements" min="19rem">
    <DemoItem label="left">
      <div>
        <PrtBtn size="sm" @click="ex.left = true">left</PrtBtn>
        <PrtDrawer v-model="ex.left" placement="left">
          <template #title>Navigation</template>
          Slides from the left edge.
        </PrtDrawer>
      </div>
    </DemoItem>
    <DemoItem label="bottom">
      <div>
        <PrtBtn size="sm" @click="ex.bottom = true">bottom</PrtBtn>
        <PrtDrawer v-model="ex.bottom" placement="bottom">
          <template #title>Console</template>
          Slides up from the bottom edge — log/console territory.
        </PrtDrawer>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <div>
        <PrtBtn size="sm" @click="ex.sm = true">sm</PrtBtn>
        <PrtDrawer v-model="ex.sm" size="sm">
          <template #title>Narrow</template>
          A quick-glance panel.
        </PrtDrawer>
      </div>
    </DemoItem>
    <DemoItem label="lg">
      <div>
        <PrtBtn size="sm" @click="ex.lg = true">lg</PrtBtn>
        <PrtDrawer v-model="ex.lg" size="lg">
          <template #title>Wide</template>
          Room for a form or a detail view.
        </PrtDrawer>
      </div>
    </DemoItem>
    <DemoItem label="xl — the working-panel scale">
      <div>
        <PrtBtn size="sm" @click="ex.xl = true">xl</PrtBtn>
        <PrtDrawer v-model="ex.xl" size="xl">
          <template #title>Inspector</template>
          A real edit form fits — two columns of fields, not an option strip.
          2xl goes wider still.
        </PrtDrawer>
      </div>
    </DemoItem>
    <DemoItem label='width="44rem" — exact custom width, overrides size'>
      <div>
        <PrtBtn size="sm" @click="ex.custom = true">custom</PrtBtn>
        <PrtDrawer v-model="ex.custom" width="44rem">
          <template #title>Custom width</template>
          Any CSS length — side placements only; a bottom sheet is always
          viewport-wide.
        </PrtDrawer>
      </div>
    </DemoItem>
    <DemoItem label="full">
      <div>
        <PrtBtn size="sm" @click="ex.full = true">full</PrtBtn>
        <PrtDrawer v-model="ex.full" size="full">
          <template #title>Takeover</template>
          Full-width sheet — mobile-style takeover.
        </PrtDrawer>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Live form inside" min="19rem">
    <DemoItem label="inputs stay wired — type, close, reopen: state is yours">
      <div class="flex flex-col gap-2">
        <PrtBtn @click="ex.form = true">Edit profile</PrtBtn>
        <PrtDrawer v-model="ex.form">
          <template #title>Edit profile</template>
          <div class="flex flex-col gap-3">
            <PrtInput v-model="value" placeholder="Display name" />
            <PrtBtn seed="7" full-width @click="ex.form = false">Save</PrtBtn>
          </div>
        </PrtDrawer>
        <span class="text-xs font-mono text-ink-faint">name: {{ value || '—' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Non-dismissible" min="19rem">
    <DemoItem label=':dismissible="false" — scrim clicks pass; Esc still closes'>
      <div>
        <PrtBtn @click="ex.guarded = true">Open guarded drawer</PrtBtn>
        <PrtDrawer v-model="ex.guarded" :dismissible="false">
          <template #title>Import in progress</template>
          Close it explicitly — the scrim won't.
        </PrtDrawer>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const show = ref(false)
// each drawer demo owns its own open flag so one trigger opens only its drawer
const ex = ref<Record<string, boolean>>({ left: false, bottom: false, sm: false, lg: false, xl: false, custom: false, full: false, form: false, guarded: false })
</script>
