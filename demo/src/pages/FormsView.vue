<template>
  <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Forms
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        reference · opt-in form layer · Standard Schema · the validator is YOUR dependency
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        The form layer is opt-in, and everything underneath it works without it
        (Shape A): bare inputs carry <span class="text-ink">zero validation</span>,
        a <code class="font-mono text-xs">PrtFormField</code> with explicit
        <code class="font-mono text-xs">error-message</code> needs no form
        context, and a schema is never required. When you do opt in, the kit
        speaks <span class="text-ink">Standard Schema v1</span> — Valibot, Zod v4,
        ArkType, or a hand-rolled object literal all plug in — and the kit itself
        imports <span class="text-ink">no validator, ever</span>.
      </p>
      <p>
        Errors live in one flat map of dot-paths
        (<code class="font-mono text-xs">'title'</code>,
        <code class="font-mono text-xs">'user.email'</code>,
        <code class="font-mono text-xs">'tags.0'</code>) to first messages.
        Display is gated <span class="text-ink">reward-early-punish-late</span>:
        a field shows its error only after it was blurred or the form was
        submitted; once visible, fixing it clears ~300&nbsp;ms after typing
        (whole-state validation runs debounced — which is also why cross-field
        rules work for free). Transforms apply to the
        <span class="text-ink">submit output only</span> — your state stays
        exactly what was typed. And the kit never disables a submit button.
      </p>
    </div>

    <!-- ownership table -->
    <section class="mb-12 max-w-2xl">
      <div class="mb-6 border-l-2 border-edge-strong pl-3">
        <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
          Who owns what
        </h2>
      </div>
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="text-left text-xs font-mono uppercase tracking-wider text-ink-faint">
            <th class="py-2 pr-4 font-normal">layer</th>
            <th class="py-2 font-normal">owns</th>
          </tr>
        </thead>
        <tbody class="text-ink-muted align-top">
          <tr class="border-t border-edge">
            <td class="py-2 pr-4 font-mono text-xs text-ink whitespace-nowrap">your state</td>
            <td class="py-2">the reactive object — never wrapped, never mutated by the kit</td>
          </tr>
          <tr class="border-t border-edge">
            <td class="py-2 pr-4 font-mono text-xs text-ink whitespace-nowrap">useForm()</td>
            <td class="py-2">schema runs, the dot-path error map, display gating, submit/reset — the only machinery</td>
          </tr>
          <tr class="border-t border-edge">
            <td class="py-2 pr-4 font-mono text-xs text-ink whitespace-nowrap">PrtForm</td>
            <td class="py-2">the <code class="font-mono text-xs">&lt;form&gt;</code> element + provide() — a thin shell over a context you created</td>
          </tr>
          <tr class="border-t border-edge">
            <td class="py-2 pr-4 font-mono text-xs text-ink whitespace-nowrap">PrtFormField</td>
            <td class="py-2">anatomy (label/description/error/help), the <code class="font-mono text-xs">name</code>, error resolution — explicit props ALWAYS beat injection</td>
          </tr>
          <tr class="border-t border-edge">
            <td class="py-2 pr-4 font-mono text-xs text-ink whitespace-nowrap">inputs</td>
            <td class="py-2">nothing. they render and emit; field wiring arrives as plain attrs (<code class="font-mono text-xs">v-bind="inputProps"</code>) — inputs never inject form or field context</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- live walkthrough -->
    <section class="mb-12">
      <div class="mb-6 border-l-2 border-edge-strong pl-3">
        <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
          Live walkthrough — every tier-1 control, one named field each
        </h2>
      </div>
      <div class="pl-3.5 flex flex-col gap-3 max-w-md">
        <PrtForm :form="form" class="rounded-surface border border-edge bg-surface-1 p-5">
          <PrtFormField
            v-model="state.title"
            name="title"
            label="Title"
            placeholder="My project"
          />
          <PrtFormField name="summary" label="Summary" helper-text="Optional.">
            <template #default="{ inputProps, error, disabled }">
              <PrtTextarea
                v-model="state.summary"
                v-bind="inputProps"
                :error="error"
                :disabled="disabled"
                :rows="3"
                placeholder="What is this project about?"
              />
            </template>
          </PrtFormField>
          <PrtFormField name="region" label="Region">
            <template #default="{ inputProps, error, disabled }">
              <PrtSelect
                v-model="state.region"
                v-bind="inputProps"
                :error="error"
                :disabled="disabled"
                placeholder="Pick a region…"
                :options="[
                  { value: 'eu', label: 'Europe' },
                  { value: 'us', label: 'United States' },
                  { value: 'ap', label: 'Asia Pacific' },
                ]"
              />
            </template>
          </PrtFormField>
          <PrtFormField name="replicas" label="Replicas" helper-text="Empty means auto. Max 64.">
            <template #default="{ inputProps, error, disabled }">
              <PrtInputNumber
                v-model="state.replicas"
                v-bind="inputProps"
                :error="error"
                :disabled="disabled"
                :min="0"
              />
            </template>
          </PrtFormField>
          <PrtFormField name="plan">
            <template #default="{ inputProps, error }">
              <PrtRadioGroup
                v-model="state.plan"
                v-bind="inputProps"
                :error="error"
                label="Plan"
                :options="[
                  { value: 'hobby', label: 'Hobby' },
                  { value: 'pro', label: 'Pro' },
                  { value: 'team', label: 'Team' },
                ]"
              />
            </template>
          </PrtFormField>
          <PrtFormField name="terms">
            <template #default="{ inputProps, error }">
              <PrtCheckbox
                v-model="state.terms"
                v-bind="inputProps"
                :error="error"
                label="I accept the terms"
              />
            </template>
          </PrtFormField>
          <PrtToggle v-model="state.public" label="Public project (applies immediately — not validated)" />
          <div class="flex items-center gap-2 pt-1">
            <PrtBtn type="submit" seed="7" :loading="form.submitting">Create project</PrtBtn>
            <PrtBtn
              variant="outline"
              @click="form.setErrors({ title: 'Already exists (server)' })"
            >
              Simulate 422
            </PrtBtn>
            <PrtBtn variant="ghost" @click="form.reset()">Reset</PrtBtn>
          </div>
        </PrtForm>
        <p class="text-xs font-mono text-ink-faint">
          blur a field empty, or submit, to see gating · errors clear ~300 ms
          after a fix · the schema here is a hand-rolled object literal — no
          validator installed in this demo app
        </p>
        <p v-if="submitted" class="text-xs font-mono text-ink-muted break-all">
          onSubmit received (parsed output): {{ submitted }}
        </p>
      </div>
    </section>

    <!-- real-world usage, code as text -->
    <section class="mb-12 max-w-2xl">
      <div class="mb-6 border-l-2 border-edge-strong pl-3">
        <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
          Real-world usage — bring your validator
        </h2>
      </div>
      <div class="flex flex-col gap-4">
        <p class="text-sm text-ink-muted">
          Docs default to Valibot (smallest, tree-shakeable); anything speaking
          Standard Schema v1 works identically — shown as text, nothing here is
          installed:
        </p>
        <pre class="rounded-surface border border-edge bg-surface-1 p-4 text-xs font-mono text-ink-muted overflow-x-auto">{{ valibotSnippet }}</pre>
        <pre class="rounded-surface border border-edge bg-surface-1 p-4 text-xs font-mono text-ink-muted overflow-x-auto">{{ templateSnippet }}</pre>
        <p class="text-sm text-ink-muted">
          Zod v4 is the same one-liner swap:
        </p>
        <pre class="rounded-surface border border-edge bg-surface-1 p-4 text-xs font-mono text-ink-muted overflow-x-auto">{{ zodSnippet }}</pre>
        <p class="text-sm text-ink-muted">
          Server-side (422) errors share the same dot-path map and clear on the
          next validation run:
        </p>
        <pre class="rounded-surface border border-edge bg-surface-1 p-4 text-xs font-mono text-ink-muted overflow-x-auto">{{ serverSnippet }}</pre>
        <p class="text-ink-faint text-xs font-mono">
          escape hatch: when a form outgrows the copied composable (wizards,
          field arrays with drag-reorder, dependent async validation), bring
          vee-validate (stable v4) or regle for that form — the inputs and
          fields here still work, they only consume attrs.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { StandardSchemaV1 } from '@ui/_shared/form'
import { useForm } from '@ui/form/useForm'

interface WalkthroughShape {
  title: string
  summary: string
  region: string | number | null
  replicas: number | null
  plan: string | number
  terms: boolean
  public: boolean
}

const state = reactive<WalkthroughShape>({
  title: '',
  summary: '',
  region: null,
  replicas: null,
  plan: '',
  terms: false,
  public: false,
})

// hand-rolled Standard Schema — exactly what a validator library would hand us
const schema: StandardSchemaV1<WalkthroughShape> = {
  '~standard': {
    version: 1,
    vendor: 'prt-demo',
    validate(value) {
      const s = value as WalkthroughShape
      const issues: Array<{ message: string; path: string[] }> = []
      if (!s.title.trim()) issues.push({ message: 'Title is required.', path: ['title'] })
      if (s.region === null) issues.push({ message: 'Pick a region.', path: ['region'] })
      if (s.replicas !== null && s.replicas > 64)
        issues.push({ message: 'At most 64 replicas.', path: ['replicas'] })
      if (!s.plan) issues.push({ message: 'Choose a plan.', path: ['plan'] })
      if (!s.terms) issues.push({ message: 'You must accept the terms.', path: ['terms'] })
      if (issues.length > 0) return { issues }
      return { value: { ...s, title: s.title.trim() } }
    },
  },
}

const submitted = ref('')
const form = useForm({
  state,
  schema,
  onSubmit(output) {
    submitted.value = JSON.stringify(output)
  },
})

const valibotSnippet = `import * as v from 'valibot'
import { reactive } from 'vue'
import { useForm, PrtForm } from '@/components/ui/form'

const schema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Title is required.')),
  email: v.pipe(v.string(), v.email('Enter a valid email.')),
  replicas: v.nullable(v.pipe(v.number(), v.maxValue(64))),
})

const state = reactive({ title: '', email: '', replicas: null })

const form = useForm({
  state,
  schema,
  async onSubmit(output) {
    // output is v.InferOutput<typeof schema> — parsed AND transformed
    await api.createProject(output)
  },
})`

const templateSnippet = `<PrtForm :form="form">
  <PrtFormField v-model="state.title" name="title" label="Title" />
  <PrtFormField v-model="state.email" name="email" type="email" label="Email" />
  <PrtBtn type="submit" :loading="form.submitting">Create</PrtBtn>
</PrtForm>`

const zodSnippet = `import { z } from 'zod' // Zod v4 implements Standard Schema v1 — same useForm, zero changes
const schema = z.object({ title: z.string().trim().min(1, 'Title is required.') })`

const serverSnippet = `catch (err) {
  if (err.status === 422) form.setErrors(err.body.errors) // { 'user.email': 'Already taken.' }
}`
</script>
