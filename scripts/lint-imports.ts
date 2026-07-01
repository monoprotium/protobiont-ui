// lint:imports — fail if any Prt*.vue uses a Vue composition API in <script setup>
// that it never imported from 'vue'. Catches the missing-import class (e.g. a bare
// `ref(...)`) that vite build compiles fine, tsgo skips (.vue internals out of scope),
// verify-fresh never renders, and the demo only hits if you open that exact page.
// Generic-aware: `ref<T>(...)` counts as a call (the <T> sits between name and `(`).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const COMPONENTS = resolve(import.meta.dirname, '../templates/components')

// Composition APIs that MUST be imported from 'vue' when called in <script setup>.
// Compiler macros (defineProps/defineEmits/defineModel/withDefaults/defineExpose) and
// template-global components (Transition/Teleport/KeepAlive) are excluded on purpose.
const API = [
  'ref', 'computed', 'reactive', 'readonly', 'shallowRef', 'shallowReactive',
  'triggerRef', 'toRef', 'toRefs', 'toRaw', 'markRaw', 'unref', 'isRef', 'customRef',
  'watch', 'watchEffect', 'watchPostEffect', 'watchSyncEffect',
  'provide', 'inject', 'nextTick',
  'onMounted', 'onBeforeMount', 'onBeforeUnmount', 'onUnmounted', 'onUpdated',
  'onBeforeUpdate', 'onActivated', 'onDeactivated', 'onErrorCaptured',
  'getCurrentInstance', 'getCurrentScope', 'onScopeDispose', 'effectScope',
  'useId', 'useTemplateRef', 'useSlots', 'useAttrs', 'useCssModule',
  'defineAsyncComponent', 'h',
]

function vueFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) vueFiles(p, out)
    else if (/^Prt.*\.vue$/.test(entry)) out.push(p)
  }
  return out
}

const problems: Array<{ file: string; missing: string[] }> = []

for (const file of vueFiles(COMPONENTS)) {
  const src = readFileSync(file, 'utf-8')
  const script = src.match(/<script setup[^>]*>([\s\S]*?)<\/script>/)?.[1]
  if (!script) continue

  const imported = new Set<string>()
  for (const m of script.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"]vue['"]/g)) {
    for (const name of m[1].split(',')) {
      const id = name.trim().split(/\s+as\s+/)[0].trim()
      if (id) imported.add(id)
    }
  }

  const missing = API.filter((api) => {
    // `api(` OR `api<Generic>(` — the generic sits between the name and the paren
    const usedAsCall = new RegExp(`\\b${api}\\s*(?:<[^>]*>)?\\s*\\(`).test(script)
    const declaredLocal = new RegExp(`\\b(?:const|let|var|function)\\s+${api}\\b`).test(script)
    return usedAsCall && !imported.has(api) && !declaredLocal
  })
  if (missing.length) problems.push({ file: file.replace(`${COMPONENTS}/`, ''), missing })
}

for (const { file, missing } of problems) {
  console.error(`  ✗ ${file}\n      used-but-not-imported from 'vue': ${missing.join(', ')}`)
}

if (problems.length > 0) {
  console.error(`\nlint:imports FAILED — ${problems.length} component(s) with missing vue imports.`)
  process.exit(1)
}
console.log('lint:imports OK — no missing vue imports.')
