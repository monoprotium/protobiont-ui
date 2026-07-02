<template>
  <DemoSection title="Runtime highlighting — drop-in, dual-theme" min="30rem">
    <DemoItem label="TypeScript">
      <PrtCodeBlock lang="ts" filename="useCounter.ts" :code="sampleTs" />
    </DemoItem>
    <DemoItem label="Vue SFC">
      <PrtCodeBlock lang="vue" filename="Toggle.vue" :code="sampleVue" />
    </DemoItem>
    <DemoItem label="Shell">
      <PrtCodeBlock lang="bash" :code="sampleBash" />
    </DemoItem>
    <DemoItem label="CSS">
      <PrtCodeBlock lang="css" :code="sampleCss" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Chrome — filename, copy, line numbers" min="30rem">
    <DemoItem label="line-numbers + filename + copy">
      <PrtCodeBlock lang="ts" filename="useCounter.ts" line-numbers :code="sampleTs" />
    </DemoItem>
    <DemoItem label="bare — no toolbar">
      <PrtCodeBlock lang="bash" :copyable="false" :code="sampleBash" />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const sampleTs = `import { ref, computed } from 'vue'

export function useCounter(start = 0) {
  const count = ref(start)
  const doubled = computed(() => count.value * 2)
  function increment() {
    count.value += 1
  }
  return { count, doubled, increment }
}`
const sampleVue = `<script setup lang="ts">
import { ref } from 'vue'
import { PrtBtn } from '@/components/ui/btn'

const open = ref(false)
<\/script>

<template>
  <PrtBtn seed="7" @click="open = !open">
    {{ open ? 'Close' : 'Open' }}
  </PrtBtn>
</template>`
const sampleBash = `# install the CLI once, then add per app
bun add -g prt
bun x prt add PrtCodeBlock`
const sampleCss = `.prt-code .shiki span {
  color: var(--shiki-dark);
}
[data-mode='light'] .prt-code .shiki span {
  color: var(--shiki-light);
}`
</script>
