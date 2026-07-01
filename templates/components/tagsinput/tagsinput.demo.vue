<template>
  <!-- Live sections: the reject readout needs an event handler and the form
       story needs a useForm instance — neither fits the slot model, so both
       render directly (the sanctioned case). -->
  <DemoSection
    title="Live — reject reason codes (codes out, the consumer renders)"
    min="32rem"
  >
    <div class="flex flex-col gap-2 max-w-lg">
      <PrtTagsInput
        v-model="invitees"
        :max="4"
        placeholder="Invite by handle…"
        @reject="onReject"
      />
      <span class="text-xs font-mono text-ink-faint">
        last reject: {{ lastReject || '—' }}
      </span>
      <p class="text-xs font-mono text-ink-faint">
        max 4 — the fifth handle rejects with 'max'; a duplicate rejects with
        'duplicate' and flashes the chip it bounced off. No message is ever
        rendered by the component.
      </p>
    </div>
  </DemoSection>

  <!-- The kit's first array-valued field in a form: the schema produces
       issues at tags.0, tags.2, … (toDotPath normalizes them) and the
       field catches the whole family via error-pattern. -->
  <DemoSection
    title="Live — array field in a form (indexed error paths → error-pattern)"
    min="32rem"
  >
    <PrtForm :form="form" class="flex flex-col gap-4 max-w-lg">
      <PrtFormField
        name="tags"
        label="Topics"
        :error-pattern="/^tags(\.|$)/"
        description="lowercase kebab-case — the schema checks each tag"
      >
        <template #default="{ inputProps, error }">
          <PrtTagsInput
            v-model="article.tags"
            v-bind="inputProps"
            :error="error"
            placeholder="Add a topic…"
          />
        </template>
      </PrtFormField>
      <div class="flex items-center gap-3">
        <PrtBtn type="submit">Publish</PrtBtn>
        <span v-if="published" class="text-xs font-mono text-ink-faint">
          {{ published }}
        </span>
      </div>
    </PrtForm>
  </DemoSection>

  <!-- min 26rem: a token field is a LONG single-line control — chips +
       input on one row; the 10rem default stacks the chips -->
  <DemoSection title="Live — wired v-model (new arrays out, never mutation)" min="26rem">
    <DemoItem label='enter or comma commits; paste "pinia, vite, vitest" splits'>
      <div class="flex flex-col gap-2">
        <PrtTagsInput v-model="tags" placeholder="Add a tag…" />
        <span class="text-xs font-mono text-ink-faint">{{ tags }}</span>
      </div>
    </DemoItem>
    <DemoItem label="backspace on empty input marks, then deletes; arrowleft roves into the chips">
      <PrtTagsInput v-model="tags" placeholder="Try the keyboard…" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Limits — duplicates flash, max rejects" min="26rem">
    <DemoItem label="max 5; re-adding an existing tag flashes its chip">
      <PrtTagsInput v-model="tags" :max="5" placeholder="Up to five…" />
    </DemoItem>
    <DemoItem label=':allow-duplicates="true" — exact compare is off, repeats are fine'>
      <PrtTagsInput v-model="tags" allow-duplicates placeholder="Repeats allowed…" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Comma opt-out — commas stay literal" min="26rem">
    <DemoItem label=':comma-commits="false" for values like "Doe, Jane" (paste still splits on newlines)'>
      <PrtTagsInput v-model="tags" :comma-commits="false" placeholder="Author names…" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="26rem">
    <DemoItem label="sm">
      <PrtTagsInput v-model="tags" size="sm" placeholder="small" />
    </DemoItem>
    <DemoItem label="lg">
      <PrtTagsInput v-model="tags" size="lg" placeholder="large" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants + edges (chips follow the field)" min="26rem">
    <DemoItem label="outline">
      <PrtTagsInput v-model="tags" variant="outline" placeholder="outline" />
    </DemoItem>
    <DemoItem label="minimal">
      <PrtTagsInput v-model="tags" variant="minimal" placeholder="minimal" />
    </DemoItem>
    <DemoItem label="square">
      <PrtTagsInput v-model="tags" edges="square" placeholder="square" />
    </DemoItem>
    <DemoItem label="pill — the sanctioned exception (chips in tag boxes earn it)">
      <PrtTagsInput v-model="tags" edges="pill" placeholder="pill" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="26rem">
    <DemoItem label="error">
      <PrtTagsInput v-model="tags" error placeholder="invalid topics" />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtTagsInput :model-value="['locked', 'read-only']" disabled />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="26rem">
    <DemoItem label="inputProps + error-pattern — indexed paths (tags.0) light the whole field">
      <PrtFormField
        name="tags"
        label="Topics"
        :error-pattern="/^tags(\.|$)/"
        helper-text="Enter or comma commits."
      >
        <template #default="{ inputProps, error, disabled }">
          <PrtTagsInput
            v-model="tags"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
          />
        </template>
      </PrtFormField>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { StandardSchemaV1 } from '@ui/_shared/form'
import { useForm } from '@ui/form/useForm'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// reject readout — the component emits codes, this demo renders them
const invitees = ref(['mara', 'jonas', 'ines'])
const lastReject = ref('')
function onReject(tag: string, reason: 'duplicate' | 'max') {
  lastReject.value = `'${tag}' → ${reason}`
}

// the array-field form story: indexed issues out of a hand-rolled
// Standard Schema (exactly what a validator library would hand us)
interface ArticleShape {
  tags: string[]
}
const article = reactive<ArticleShape>({ tags: ['observability', 'Edge Functions'] })
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const schema: StandardSchemaV1<ArticleShape> = {
  '~standard': {
    version: 1,
    vendor: 'prt-demo',
    validate(value) {
      const s = value as ArticleShape
      const issues: Array<{ message: string; path: (string | number)[] }> = []
      if (s.tags.length === 0)
        issues.push({ message: 'Add at least one topic.', path: ['tags'] })
      s.tags.forEach((tag, i) => {
        if (!KEBAB.test(tag))
          issues.push({
            message: `"${tag}" must be lowercase kebab-case.`,
            path: ['tags', i],
          })
      })
      return issues.length > 0 ? { issues } : { value: s }
    },
  },
}
const published = ref('')
const form = useForm({
  state: article,
  schema,
  onSubmit(output) {
    published.value = JSON.stringify(output)
  },
})

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const tags = ref(['vue', 'unocss', 'dark-mode'])
</script>
