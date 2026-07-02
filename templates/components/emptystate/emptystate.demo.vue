<template>
  <DemoSection title="No results — with a recovery action" min="24rem">
    <DemoItem label="the one action lives in #action; composition wins">
      <PrtEmptyState
        icon="i-lucide-search-x"
        title="No deployments match"
        description="Nothing in this project matches 'edge-cache'. Try fewer filters."
      >
        <template #action>
          <PrtBtn size="sm">Clear filters</PrtBtn>
        </template>
      </PrtEmptyState>
    </DemoItem>
  </DemoSection>

  <DemoSection title="First run — with a primary action" min="24rem">
    <DemoItem label="empty project, one obvious next step">
      <PrtEmptyState
        icon="i-lucide-database"
        title="No API keys yet"
        description="Create a key to start sending events from your backend."
      >
        <template #action>
          <PrtBtn size="sm">Create API key</PrtBtn>
        </template>
      </PrtEmptyState>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Bare — title only" min="24rem">
    <DemoItem label="the minimum useful empty state">
      <PrtEmptyState title="No notifications" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="24rem">
    <DemoItem label="sm — for tight panels">
      <PrtEmptyState
        size="sm"
        icon="i-lucide-inbox"
        title="Inbox zero"
        description="New mentions land here."
      />
    </DemoItem>
    <DemoItem label="lg — for full-page voids">
      <PrtEmptyState
        size="lg"
        icon="i-lucide-folder-open"
        title="This workspace is empty"
        description="Invite your team or import an existing project to get going."
      />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const filters = ref<string[]>([])
</script>
