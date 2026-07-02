<template>
  <div class="border-l border-edge bg-surface-1 h-screen sticky top-0 flex flex-col">
    <div class="px-4 py-3 border-b border-edge flex items-center gap-2">
      <span class="text-sm text-ink font-medium">Source</span>
      <span v-if="snippet" class="text-xs font-mono text-ink-faint truncate">
        {{ snippet.title.toLowerCase() }}
      </span>
      <button
        v-if="snippet"
        type="button"
        class="ml-auto inline-flex items-center gap-1.5 text-xs font-mono text-ink-faint hover:text-ink px-2 py-1 rounded-control hover:bg-wash prt-motion-colors prt-ring"
        @click="copy"
      >
        <span :class="copied ? 'i-lucide-check text-accent' : 'i-lucide-copy'" />
        {{ copied ? 'copied' : 'copy' }}
      </button>
    </div>

    <div v-if="snippet" class="flex-1 overflow-auto">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="html" class="prt-code" v-html="html" />
      <pre v-else class="p-4 font-mono text-xs text-ink-muted whitespace-pre-wrap">{{ sfc }}</pre>
    </div>
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
      <span class="i-lucide-mouse-pointer-click text-2xl text-ink-faint" />
      <p class="text-sm text-ink-faint">
        Click any example to get ready-to-paste code here
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { gallery } from '../router'
import { activeSnippet } from './sourceStore'

const snippet = activeSnippet
const html = shallowRef('')
const copied = ref(false)

function importLine(name: string): string {
  const folder =
    gallery.find((e) => e.name === name)?.folder ?? name.replace(/^Prt/, '').toLowerCase()
  return `import { ${name} } from '@/components/ui/${folder}'`
}

// mirrors the DemoItem sandbox — the copied SFC must carry the same wiring
// the preview runs on, so a paste works without thinking (§ demo convention)
const sandboxDecls: Record<string, string> = {
  value: `const value = ref('')`,
  checked: `const checked = ref(false)`,
  flags: `const flags = ref({ basic: false, sm: true, base: true, lg: true, slot: false, field: true })`,
  texts: `const texts = ref<Record<string, string>>({})`,
  tabState: `const tabState = ref<Record<string, string | number>>({})`,
  ex: `const ex = ref<Record<string, string | number | boolean>>({})`,
  num: `const num = ref<number | null>(null)`,
  choice: `const choice = ref<string | number>('')`,
  count: `const count = ref(0)`,
  open: `const open = ref(true)`,
  show: `const show = ref(false)`,
  expanded: `const expanded = ref(false)`,
  tab: `const tab = ref<string | number>('overview')`,
  page: `const page = ref(1)`,
  level: `const level = ref(35)`,
  range: `const range = ref<[number, number]>([120, 480])`,
  gains: `const gains = ref([0, -7.5, -3, -12])`,
  freq: `const freq = ref(640)`,
  tags: `const tags = ref(['vue', 'unocss', 'dark-mode'])`,
  files: `const files = ref<any[]>([])`,
  view: `const view = ref<'grid' | 'list'>('grid')`,
  filters: `const filters = ref<string[]>([])`,
  category: `const category = ref<string[]>([])`,
  picked: `const picked = ref<number[]>([])`,
  collapsed: `const collapsed = ref(false)`,
  current: `const current = ref<string | number>('projects')`,
  locale: `const locale = ref('en')`,
  address: `const address = ref<Record<string, string>>({})`,
  method: `const method = ref('standard')`,
  picks: `const picks = ref({ basic: 'pro', legend: 'pro', inline: 'm', sm: 'a', lg: 'b', soldOut: 'a', error: 'a', cardSeed: 'express', field: 'hobby', seed5: 'b', seed9: 'a' })`,
  sampleTs: `const sampleTs = \`import { ref, computed } from 'vue'

export function useCounter(start = 0) {
  const count = ref(start)
  const doubled = computed(() => count.value * 2)
  function increment() {
    count.value += 1
  }
  return { count, doubled, increment }
}\``,
  sampleVue: `const sampleVue = \`<script setup lang="ts">
import { ref } from 'vue'
import { PrtBtn } from '@/components/ui/btn'

const open = ref(false)
<\\/script>

<template>
  <PrtBtn seed="7" @click="open = !open">
    {{ open ? 'Close' : 'Open' }}
  </PrtBtn>
</template>\``,
  sampleBash: `const sampleBash = \`# install the CLI once, then add per app
bun add -g prt
bun x prt add PrtCodeBlock\``,
  sampleCss: `const sampleCss = \`.prt-code .shiki span {
  color: var(--shiki-dark);
}
[data-mode='light'] .prt-code .shiki span {
  color: var(--shiki-light);
}\``,
  nav: `const nav = [
  { label: 'Workspace', items: [
    { value: 'overview', label: 'Overview', icon: 'i-lucide-layout-dashboard' },
    { value: 'projects', label: 'Projects', icon: 'i-lucide-folder-kanban', badge: '12' },
    { value: 'analytics', label: 'Analytics', icon: 'i-lucide-chart-line' },
  ] },
  { label: 'Build', items: [
    { value: 'pipelines', label: 'Pipelines', icon: 'i-lucide-git-branch', children: [
      { value: 'runs', label: 'Runs' },
      { value: 'schedules', label: 'Schedules' },
      { value: 'caches', label: 'Caches' },
    ] },
    { value: 'artifacts', label: 'Artifacts', icon: 'i-lucide-package' },
    { value: 'registry', label: 'Registry', icon: 'i-lucide-container' },
  ] },
  { label: 'Account', items: [
    { value: 'settings', label: 'Settings', icon: 'i-lucide-settings' },
    { value: 'billing', label: 'Billing', icon: 'i-lucide-credit-card' },
  ] },
]`,
  playlist: `const playlist = (() => {
  const tracks = [
    { src: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3', title: 'Sample track' },
    { src: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample2.mp3', title: 'Second sample' },
  ]
  const i = ref(0)
  return {
    get src() { return tracks[i.value].src },
    get title() { return tracks[i.value].title },
    get hasPrev() { return i.value > 0 },
    get hasNext() { return i.value < tracks.length - 1 },
    prev() { if (i.value > 0) i.value-- },
    next() { if (i.value < tracks.length - 1) i.value++ },
  }
})()`,
}

// a binding counts only as a standalone identifier in an expression:
// `v-model="value"`, `{{ count }}` — not `model-value` (hyphen), not object
// keys (`value:`), not prop/event names (`:count=`, `@open=`)
function detectBindings(code: string): string[] {
  const names = Object.keys(sandboxDecls).join('|')
  const re = new RegExp(`(?:^|[^-:@\\w])(${names})\\b(?!\\s*:)`, 'g')
  return [...new Set([...code.matchAll(re)].map((m) => m[1]))]
}

/** the deliverable: a complete, paste-ready SFC (or verbatim, for raw snippets) */
const sfc = computed(() => {
  if (!snippet.value) return ''
  // raw = non-template source (composable/script wiring): show as authored
  if (snippet.value.raw) return snippet.value.code
  const body = snippet.value.code
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')
  const bindings = detectBindings(snippet.value.code)
  const script = [
    ...(bindings.length ? [`import { ref } from 'vue'`] : []),
    ...snippet.value.imports.map(importLine),
    ...(bindings.length ? ['', ...bindings.map((b) => sandboxDecls[b])] : []),
  ].join('\n')
  return `<template>\n${body}\n</template>\n\n<script setup lang="ts">\n${script}\n<\/script>`
})

watch(
  sfc,
  async (code) => {
    html.value = ''
    if (!code) return
    // Reuse PrtCodeBlock's atomic singleton (fine-grained core + JS engine,
    // no WASM) and its dual-theme output — the `.prt-code` wrapper below picks
    // up the component's [data-mode] flip CSS, so the panel reads correctly in
    // BOTH modes instead of dark-theme-on-white.
    const { highlight } = await import('@ui/codeblock/lib/highlight')
    html.value = await highlight(code, snippet.value?.lang ?? 'vue')
  },
  { immediate: true },
)

async function copy() {
  if (!sfc.value) return
  await navigator.clipboard.writeText(sfc.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>
