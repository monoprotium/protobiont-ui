<template>
  <DemoSection title="Basic" min="19rem">
    <DemoItem label="with helper">
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
  </DemoSection>

  <DemoSection title="States" min="19rem">
    <DemoItem label="error">
      <PrtFormField
        model-value="sk-revoked"
        label="API key"
        error
        error-message="This key was revoked."
      />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtFormField label="Locked field" disabled placeholder="read only" />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// each field gets its own key so they type independently
const ex = ref<Record<string, string>>({ name: '', email: '' })
</script>
