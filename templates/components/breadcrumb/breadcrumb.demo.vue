<template>
  <DemoSection title="Basic" min="24rem">
    <DemoItem label="links + current page">
      <PrtBreadcrumb
        :items="[
          { label: 'Library', href: '#' },
          { label: 'Samples', href: '#' },
          { label: 'drum-loops-92bpm.wav' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Long trail — wraps, never truncates" min="24rem">
    <DemoItem label="six levels deep">
      <PrtBreadcrumb
        :items="[
          { label: 'Org', href: '#' },
          { label: 'Projects', href: '#' },
          { label: 'protobiont', href: '#' },
          { label: 'templates', href: '#' },
          { label: 'components', href: '#' },
          { label: 'breadcrumb' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom separator slot" min="24rem">
    <DemoItem label="chevron icon instead of the slash">
      <PrtBreadcrumb
        :items="[
          { label: 'Store', href: '#' },
          { label: 'Synths', href: '#' },
          { label: 'Monophonic' },
        ]"
      >
        <template #separator>
          <span class="i-lucide-chevron-right text-xs" aria-hidden="true" />
        </template>
      </PrtBreadcrumb>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="24rem">
    <DemoItem label="sm">
      <PrtBreadcrumb
        size="sm"
        :items="[
          { label: 'Settings', href: '#' },
          { label: 'Tokens' },
        ]"
      />
    </DemoItem>
    <DemoItem label="lg">
      <PrtBreadcrumb
        size="lg"
        :items="[
          { label: 'Settings', href: '#' },
          { label: 'Tokens' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Plain segment — href-less middle item" min="24rem">
    <DemoItem label="a non-navigable level stays muted text">
      <PrtBreadcrumb
        :items="[
          { label: 'Campaign', href: '#' },
          { label: 'Act II' },
          { label: 'Mission 7' },
        ]"
      />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
