<template>
  <DemoSection title="Live — dismiss wired to state (visibility is the parent's v-if)" min="22rem">
    <DemoItem label="dismiss, then bring it back">
      <div class="flex flex-col items-start gap-2">
        <PrtNotice
          v-if="open"
          intent="warning"
          title="Token expires soon"
          description="Rotate it in Settings → API."
          dismissible
          @dismiss="open = false"
        />
        <PrtBtn v-else size="sm" variant="ghost" @click="open = true">show again</PrtBtn>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Intents × edge (default) — left tone edge, quiet surface" min="20rem">
    <DemoItem label="info (default)">
      <PrtNotice title="Heads up" description="Indexing runs nightly at 02:00." />
    </DemoItem>
    <DemoItem label="success">
      <PrtNotice intent="success" title="Deployed" description="Build 412 is live on production." />
    </DemoItem>
    <DemoItem label="warning">
      <PrtNotice intent="warning" title="Quota at 85%" description="Usage resets on the 1st." />
    </DemoItem>
    <DemoItem label="danger">
      <PrtNotice intent="danger" title="Sync failed" description="Could not reach the registry." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Intents × wash — tinted background, hairline edge" min="20rem">
    <DemoItem label="info">
      <PrtNotice variant="wash" title="Heads up" description="Indexing runs nightly at 02:00." />
    </DemoItem>
    <DemoItem label="success">
      <PrtNotice variant="wash" intent="success" title="Deployed" description="Build 412 is live on production." />
    </DemoItem>
    <DemoItem label="warning">
      <PrtNotice variant="wash" intent="warning" title="Quota at 85%" description="Usage resets on the 1st." />
    </DemoItem>
    <DemoItem label="danger">
      <PrtNotice variant="wash" intent="danger" title="Sync failed" description="Could not reach the registry." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Intents × ghost — borderless wash block" min="20rem">
    <DemoItem label="info">
      <PrtNotice variant="ghost" title="Heads up" description="Indexing runs nightly at 02:00." />
    </DemoItem>
    <DemoItem label="success">
      <PrtNotice variant="ghost" intent="success" title="Deployed" description="Build 412 is live on production." />
    </DemoItem>
    <DemoItem label="warning">
      <PrtNotice variant="ghost" intent="warning" title="Quota at 85%" description="Usage resets on the 1st." />
    </DemoItem>
    <DemoItem label="danger">
      <PrtNotice variant="ghost" intent="danger" title="Sync failed" description="Could not reach the registry." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Outline — full tone frame (the btn/chip meaning); calmest seeded" min="20rem">
    <DemoItem label="seeded frame — the decorative callout case">
      <PrtNotice variant="outline" seed="3" title="Tip" description="A thin frame, quiet fill — calm, not alarmed." />
    </DemoItem>
    <DemoItem label="seed 9">
      <PrtNotice variant="outline" seed="9" title="Note" description="Decoration carries no semantics." />
    </DemoItem>
    <DemoItem label="intent frame (loud — prefer edge for alerts)">
      <PrtNotice variant="outline" intent="danger" title="Sync failed" description="Could not reach the registry." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Mono — the typographic notice (tone treatment, orthogonal to variant)" min="20rem">
    <DemoItem label='mono="title" — title carries the seed, body stays muted (the safer ship)'>
      <PrtNotice variant="outline" seed="9" mono="title" title="Did you know" description="Title carries the seed, body stays muted ink." />
    </DemoItem>
    <DemoItem label="full mono, seed 3 — body dims into the seed (--seed-body)">
      <PrtNotice variant="outline" seed="3" mono title="Tip" description="Frame, title and body all speak in one seed." />
    </DemoItem>
    <DemoItem label="full mono, seed 5">
      <PrtNotice variant="outline" seed="5" mono title="Note" description="Frame, title and body all speak in one seed." />
    </DemoItem>
    <DemoItem label="works on any variant — edge, title-only">
      <PrtNotice seed="3" mono="title" title="Tip" description="The treatment is orthogonal to the frame." />
    </DemoItem>
    <DemoItem label="intents get it too (true states, monochrome voice)">
      <PrtNotice variant="outline" intent="danger" mono title="Sync failed" description="Could not reach the registry." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Seeds — decoration for non-semantic callouts; no icon by default" min="20rem">
    <DemoItem label="edge, seed 3">
      <PrtNotice seed="3" title="Tip" description="Stable seed per category makes callouts scannable." />
    </DemoItem>
    <DemoItem label="wash, seed 5">
      <PrtNotice variant="wash" seed="5" title="Did you know" description="Seeds derive ink, hover and wash from one value." />
    </DemoItem>
    <DemoItem label="ghost, seed 7">
      <PrtNotice variant="ghost" seed="7" title="Note" description="Ghost reads softest — body text callouts." />
    </DemoItem>
    <DemoItem label="seeded + opt-in icon">
      <PrtNotice variant="wash" seed="9" icon="i-lucide-lightbulb" title="Idea" description="Decoration carries no semantics — the icon is yours." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Anatomy — title and body are independent" min="20rem">
    <DemoItem label="title only">
      <PrtNotice intent="warning" title="Read-only mode" />
    </DemoItem>
    <DemoItem label="description only">
      <PrtNotice description="Drafts autosave every 30 seconds." />
    </DemoItem>
    <DemoItem label="body via slot">
      <PrtNotice intent="danger" title="Payment failed">
        Card ending <span class="font-mono">4242</span> was declined — retry or
        use a different method.
      </PrtNotice>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Dismiss — emits only; visibility is the parent's v-if" min="20rem">
    <DemoItem label="dismissible">
      <PrtNotice dismissible title="Tip" description="Press ? for shortcuts." />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Icon control" min="20rem">
    <DemoItem label="custom icon">
      <PrtNotice icon="i-lucide-rocket" title="Beta" description="New listing engine enabled." />
    </DemoItem>
    <DemoItem label="no icon (icon='')">
      <PrtNotice icon="" description="A bare, quiet line of context." />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const open = ref(true)
const show = ref(false)
const method = ref('standard')
</script>
