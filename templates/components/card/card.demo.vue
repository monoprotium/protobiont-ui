<template>
  <DemoSection title="Variants" min="19rem">
    <DemoItem label="default">
      <PrtCard>
        <template #header>Default</template>
        Hairline edge on surface-1. The baseline card.
      </PrtCard>
    </DemoItem>
    <DemoItem label="raised">
      <PrtCard variant="raised">
        <template #header>Raised</template>
        Tokenized shadow — for things that need gentle lift.
      </PrtCard>
    </DemoItem>
    <DemoItem label="outline">
      <PrtCard variant="outline">
        <template #header>Outline</template>
        Transparent body, stronger edge.
      </PrtCard>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Anatomy" min="19rem">
    <DemoItem label="full anatomy">
      <PrtCard>
        <template #image>
          <div class="aspect-[16/9] bg-surface-2 flex items-center justify-center">
            <span class="i-lucide-image text-ink-faint text-2xl" />
          </div>
        </template>
        <template #header>Deploy summary</template>
        Build finished in 42s. 3 routes prerendered, 0 warnings.
        <template #footer>
          <PrtBtn size="sm" seed="7">View logs</PrtBtn>
          <PrtBtn size="sm" variant="ghost">Dismiss</PrtBtn>
        </template>
      </PrtCard>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Edges" min="19rem">
    <DemoItem label="square">
      <PrtCard edges="square">
        <template #header>Square</template>
        For dense dashboard grids.
      </PrtCard>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
