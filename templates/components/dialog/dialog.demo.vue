<template>
  <DemoSection title="Live — wired v-model" min="19rem">
    <DemoItem label="open, then Esc / outside click / X — all close it">
      <div>
        <PrtBtn @click="show = true">Open dialog</PrtBtn>
        <PrtDialog v-model="show">
          <template #title>Rename project</template>
          Pick something the future you still understands.
          <template #actions>
            <PrtBtn variant="ghost" @click="show = false">Cancel</PrtBtn>
            <PrtBtn seed="7" @click="show = false">Save</PrtBtn>
          </template>
        </PrtDialog>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Confirm — a preset, not a component" min="19rem">
    <DemoItem label="destructive confirm: danger speaks in the action row">
      <div>
        <PrtBtn variant="outline" @click="ex.confirm = true">Delete workspace…</PrtBtn>
        <PrtDialog v-model="ex.confirm" size="sm">
          <template #title>Delete workspace?</template>
          This removes the workspace and its 14 boards. There is no undo.
          <template #actions>
            <PrtBtn variant="ghost" @click="ex.confirm = false">Keep it</PrtBtn>
            <PrtBtn seed="8" @click="ex.confirm = false">Delete</PrtBtn>
          </template>
        </PrtDialog>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="19rem">
    <DemoItem label="sm">
      <div>
        <PrtBtn size="sm" @click="ex.sm = true">sm</PrtBtn>
        <PrtDialog v-model="ex.sm" size="sm">
          <template #title>Small</template>
          Compact confirm-scale width.
        </PrtDialog>
      </div>
    </DemoItem>
    <DemoItem label="lg">
      <div>
        <PrtBtn size="sm" @click="ex.lg = true">lg</PrtBtn>
        <PrtDialog v-model="ex.lg" size="lg">
          <template #title>Large</template>
          Room for two columns of settings before "full" is needed.
        </PrtDialog>
      </div>
    </DemoItem>
    <DemoItem label="xl — the advanced-form scale">
      <div>
        <PrtBtn size="sm" @click="ex.xl = true">xl</PrtBtn>
        <PrtDialog v-model="ex.xl" size="xl">
          <template #title>Extra large</template>
          A three-column field grid fits here — the entity-editor scale,
          without going full.
        </PrtDialog>
      </div>
    </DemoItem>
    <DemoItem label="2xl — the big entity editor">
      <div>
        <PrtBtn size="sm" @click="ex.x2l = true">2xl</PrtBtn>
        <PrtDialog v-model="ex.x2l" size="2xl">
          <template #title>Double extra large</template>
          Multi-section form with sidebar-ish columns, provider tabs, file
          drops — the workhorse width for serious create/edit dialogs.
        </PrtDialog>
      </div>
    </DemoItem>
    <DemoItem label="full">
      <div>
        <PrtBtn size="sm" @click="ex.full = true">full</PrtBtn>
        <PrtDialog v-model="ex.full" size="full">
          <template #title>Full width</template>
          Viewport minus a 1rem frame on each side.
        </PrtDialog>
      </div>
    </DemoItem>
    <DemoItem label='width="68rem" — exact custom width, overrides size'>
      <div>
        <PrtBtn size="sm" @click="ex.custom = true">custom</PrtBtn>
        <PrtDialog v-model="ex.custom" width="68rem">
          <template #title>Custom width</template>
          Any CSS length — '900px', 'min(90vw, 75rem)'… Still shrinks on
          small viewports.
        </PrtDialog>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Square edges" min="19rem">
    <DemoItem label='edges="square"'>
      <div>
        <PrtBtn edges="square" @click="ex.square = true">Open square dialog</PrtBtn>
        <PrtDialog v-model="ex.square" edges="square">
          <template #title>Square</template>
          The technical read — zero radius, hairline, scrim.
        </PrtDialog>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Non-dismissible" min="19rem">
    <DemoItem label=':dismissible="false" — Esc still works, outside click does not'>
      <div>
        <PrtBtn @click="ex.guarded = true">Open guarded dialog</PrtBtn>
        <PrtDialog v-model="ex.guarded" :dismissible="false">
          <template #title>Unsaved changes</template>
          Clicking the scrim won't lose your work here — decide explicitly.
          <template #actions>
            <PrtBtn variant="ghost" @click="ex.guarded = false">Discard</PrtBtn>
            <PrtBtn seed="7" @click="ex.guarded = false">Save & close</PrtBtn>
          </template>
        </PrtDialog>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Declarative — command/commandfor, no v-model at all" min="19rem">
    <DemoItem label="platform invoker commands; id passes through $attrs">
      <div>
        <button
          command="show-modal"
          commandfor="demo-declarative-dialog"
          class="h-9 px-4 text-sm rounded-control bg-surface-2 text-ink hover:bg-surface-3 cursor-pointer prt-motion-colors"
        >
          Open declaratively
        </button>
        <PrtDialog id="demo-declarative-dialog">
          <template #title>No script needed</template>
          Opened by command="show-modal" on a plain button. Esc, scrim and the
          X close it the platform way.
        </PrtDialog>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title='Form in a dialog — method="dialog"' min="19rem">
    <DemoItem label="submit closes natively; the picked value rides returnValue">
      <div class="flex flex-col gap-2">
        <PrtBtn @click="ex.plan = true">Choose plan…</PrtBtn>
        <PrtDialog v-model="ex.plan" size="sm" @close="value = $event.target.returnValue">
          <template #title>Pick a plan</template>
          <form method="dialog" class="flex flex-col gap-2">
            <button value="solo" class="h-9 px-3 text-sm text-left rounded-control bg-surface-2 text-ink hover:bg-surface-3 cursor-pointer prt-motion-colors">Solo — 1 seat</button>
            <button value="studio" class="h-9 px-3 text-sm text-left rounded-control bg-surface-2 text-ink hover:bg-surface-3 cursor-pointer prt-motion-colors">Studio — 5 seats</button>
          </form>
        </PrtDialog>
        <span class="text-xs font-mono text-ink-faint">returnValue: {{ value || '—' }}</span>
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
// each dialog demo owns its own open flag so one trigger opens only its dialog
const ex = ref<Record<string, boolean>>({ confirm: false, sm: false, lg: false, xl: false, x2l: false, full: false, custom: false, square: false, guarded: false, plan: false })
</script>
