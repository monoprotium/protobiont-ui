<template>
  <DemoSection title="Live — single file (a new pick replaces)" min="32rem">
    <DemoItem label="click the button or drop a file; re-picking the same file works">
      <PrtUploader v-model="files" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Multiple + accept (hint derives from accept + maxSize)" min="32rem">
    <DemoItem label="documents only — the picker filters AND validation re-checks">
      <PrtUploader
        v-model="files"
        multiple
        accept=".pdf,.docx"
        :max-size="5 * 1024 * 1024"
      />
    </DemoItem>
    <DemoItem label="image previews — object URLs, never base64">
      <PrtUploader v-model="files" multiple accept="image/*" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom dropzone — the default slot (slot props: open, dragging)" min="32rem">
    <DemoItem label="bring your own content; `open` is the picker">
      <PrtUploader v-model="files" accept=".csv" hint-text="">
        <template #default="{ open, dragging }">
          <p class="text-sm text-ink-muted">
            {{ dragging ? 'Release to import' : 'Drop the quarterly export here' }}
          </p>
          <PrtBtn size="sm" @click="open">Choose CSV</PrtBtn>
        </template>
      </PrtUploader>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom rows — the #file slot" min="32rem">
    <DemoItem label="consumer-rendered list rows; `remove` is wired">
      <PrtUploader v-model="files" multiple>
        <template #file="{ file, remove }">
          <span class="flex-1 min-w-0 truncate text-sm font-mono text-ink">
            {{ file.name }}
          </span>
          <PrtBtn size="sm" @click="remove">drop</PrtBtn>
        </template>
      </PrtUploader>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Directory + paste modes" min="32rem">
    <DemoItem label="directory: rows show the relative path (webkitdirectory — accept may be ignored by the picker, validation still runs)">
      <PrtUploader v-model="files" directory />
    </DemoItem>
    <DemoItem label="paste: focus the button, then Ctrl/⌘-V a copied image">
      <PrtUploader v-model="files" paste multiple accept="image/*" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Variants + edges" min="32rem">
    <DemoItem label="outline — the quiet frame">
      <PrtUploader v-model="files" variant="outline" />
    </DemoItem>
    <DemoItem label="square">
      <PrtUploader v-model="files" edges="square" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="States" min="32rem">
    <DemoItem label="error">
      <PrtUploader v-model="files" error />
    </DemoItem>
    <DemoItem label="disabled">
      <PrtUploader v-model="files" disabled />
    </DemoItem>
  </DemoSection>

  <DemoSection title="In a form field" min="32rem">
    <DemoItem label="inputProps land on the hidden input; errors surface on submit">
      <PrtFormField name="attachments" label="Attachments" helper-text="PDF only, 5 MB max.">
        <template #default="{ inputProps, error, disabled }">
          <PrtUploader
            v-model="files"
            v-bind="inputProps"
            :error="error"
            :disabled="disabled"
            multiple
            accept=".pdf"
            :max-size="5 * 1024 * 1024"
          />
        </template>
      </PrtFormField>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const open = ref(true)
const files = ref<any[]>([])
</script>
