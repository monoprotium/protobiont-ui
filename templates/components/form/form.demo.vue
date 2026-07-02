<template>
  <DemoSection title="Shape A — no form, no schema" min="19rem">
    <DemoItem label="explicit error-message (no PrtForm anywhere)">
      <PrtFormField
        model-value="sk-revoked"
        label="API key"
        error-message="This key was revoked."
      />
    </DemoItem>
    <DemoItem label="helper text">
      <PrtFormField
        v-model="ex.name"
        label="Project name"
        placeholder="my-project"
        helper-text="Lowercase, no spaces."
      />
    </DemoItem>
    <DemoItem label="required + description">
      <PrtFormField
        v-model="ex.email"
        label="Email"
        type="email"
        required
        description="Used for deploy notifications only."
        placeholder="you@example.com"
      />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtFormField label="Locked field" disabled placeholder="read only" />
    </DemoItem>
  </DemoSection>

  <!-- Live — a real useForm() context; intrinsic interactivity, no knobs.
       The schema is a hand-rolled object literal implementing ~standard:
       zero validator dependency, dogfooding the inlined StandardSchemaV1. -->
  <section class="mb-12">
    <div class="mb-6 border-l-2 border-edge-strong pl-3">
      <h2 class="text-sm font-light tracking-[0.15em] uppercase text-ink-muted">
        Live — schema, gating, server errors
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
        <PrtFormField
          v-model="state.email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          helper-text="Anything with an @ passes."
        />
        <PrtFormField
          v-model="state.title"
          name="title"
          label="Same name, explicit prop"
          error-message="Explicit error-message ALWAYS beats the injected error."
        />
        <div class="flex items-center gap-2">
          <PrtBtn type="submit" seed="7" :loading="form.submitting">Submit</PrtBtn>
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
        errors show after blur or submit · typing revalidates ~300 ms ·
        "simulate 422" needs a prior blur/submit to be displayed (gating is
        display-level) and clears on the next validation run
      </p>
      <p v-if="submitted" class="text-xs font-mono text-ink-muted break-all">
        onSubmit received (parsed output, title trimmed): {{ submitted }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'
import type { StandardSchemaV1 } from '../_shared/form'
import { useForm } from './useForm'

interface DemoShape {
  title: string
  email: string
}

// ~15 lines: an inline Standard Schema — what a validator library would hand us.
const schema: StandardSchemaV1<DemoShape> = {
  '~standard': {
    version: 1,
    vendor: 'prt-demo',
    validate(value) {
      const v = value as DemoShape
      const issues: Array<{ message: string; path: string[] }> = []
      if (!v.title.trim()) issues.push({ message: 'Title is required.', path: ['title'] })
      if (!v.email.includes('@')) issues.push({ message: 'Email must contain an @.', path: ['email'] })
      if (issues.length > 0) return { issues }
      // transform on OUTPUT only — state stays exactly what was typed
      return { value: { title: v.title.trim(), email: v.email } }
    },
  },
}

const state = reactive<DemoShape>({ title: '', email: '' })
const submitted = ref('')

const form = useForm({
  state,
  schema,
  onSubmit(output) {
    submitted.value = JSON.stringify(output)
  },
})

// the two Shape-A demo fields each get their own key so they type independently
const ex = ref<Record<string, string>>({ name: '', email: '' })
</script>
