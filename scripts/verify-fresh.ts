// verify:fresh — end-to-end CLI verification in a throwaway app.
// Creates a minimal Vite+Vue project in a temp dir, runs prt init + add,
// checks manifest behavior (skip / modified detection), then a real vite build.
// Replaces the 2025 verification apps entirely.
import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const PRT = `node ${join(ROOT, 'cli/dist/index.js')}`
const APP = mkdtempSync(join(tmpdir(), 'prt-verify-'))

let failures = 0
function check(name: string, ok: boolean) {
  console.log(`${ok ? '  ✓' : '  ✗ FAIL'} ${name}`)
  if (!ok) failures++
}
function run(cmd: string, expectFail = false): string {
  try {
    return execSync(cmd, { cwd: APP, encoding: 'utf-8', stdio: 'pipe' })
  } catch (err: any) {
    if (expectFail) return String(err.stdout ?? '')
    console.error(`command failed: ${cmd}\n${err.stdout}\n${err.stderr}`)
    failures++
    return ''
  }
}

console.log(`verify:fresh in ${APP}\n`)

// --- minimal vue app scaffold -------------------------------------------
writeFileSync(
  join(APP, 'package.json'),
  JSON.stringify({ name: 'prt-verify-app', private: true, type: 'module' }, null, 2),
)
writeFileSync(
  join(APP, 'index.html'),
  `<!doctype html><html data-mode="dark"><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
)
mkdirSync(join(APP, 'src'))
writeFileSync(
  join(APP, 'src/main.ts'),
  `import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import './styles/tokens.css'
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
`,
)
writeFileSync(
  join(APP, 'src/App.vue'),
  `<template>
  <main class="min-h-screen bg-surface-0 p-8 flex flex-col gap-4 max-w-md">
    <PrtBtn color="primary">Verify</PrtBtn>
    <PrtFormField v-model="value" label="Field" helper-text="works" />
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { PrtBtn } from '@/components/ui/btn'
import { PrtFormField } from '@/components/ui/formfield'
const value = ref('')
</script>
`,
)
execSync('bun add vue && bun add -d vite @vitejs/plugin-vue typescript', {
  cwd: APP,
  stdio: 'pipe',
})

// --- init ------------------------------------------------------------------
run(`${PRT} init --yes`)
check('components.json created', existsSync(join(APP, 'components.json')))
check('tokens.css installed', existsSync(join(APP, 'src/styles/tokens.css')))
check('uno.config.ts installed', existsSync(join(APP, 'uno.config.ts')))
check('_shared installed', existsSync(join(APP, 'src/components/ui/_shared/types.ts')))

// --- add with dependency resolution ----------------------------------------
run(`${PRT} add PrtFormField PrtBtn --yes`)
check(
  'PrtFormField installed',
  existsSync(join(APP, 'src/components/ui/formfield/PrtFormField.vue')),
)
check(
  'dependency PrtInput pulled automatically',
  existsSync(join(APP, 'src/components/ui/input/PrtInput.vue')),
)
check(
  'demo files NOT installed',
  !existsSync(join(APP, 'src/components/ui/btn/btn.demo.vue')),
)
const manifest = JSON.parse(readFileSync(join(APP, 'components.json'), 'utf-8'))
check(
  'manifest records hashes',
  Object.keys(manifest.installed?.PrtBtn ?? {}).length > 0,
)

// --- re-add: no-op -----------------------------------------------------------
const rerun = run(`${PRT} add PrtBtn --yes`)
check('second add is a no-op (skipped-unchanged)', rerun.includes('skipped-unchanged'))

// --- modified file protection ------------------------------------------------
const btnPath = join(APP, 'src/components/ui/btn/PrtBtn.vue')
writeFileSync(btnPath, `${readFileSync(btnPath, 'utf-8')}\n<!-- local edit -->\n`)
const out = run(`${PRT} add PrtBtn --yes`, true)
check('modified file is kept with --yes', readFileSync(btnPath, 'utf-8').includes('local edit'))
check('modified skip exits non-zero / warns', out.includes('locally modified'))
run(`${PRT} add PrtBtn --yes --force`)
check(
  '--force overwrites local edit',
  !readFileSync(btnPath, 'utf-8').includes('local edit'),
)

// --- diff + list -------------------------------------------------------------
const json = run(`${PRT} list --json`)
check('list --json parses', (() => { try { JSON.parse(json); return true } catch { return false } })())

// --- custom-icons scaffold ---------------------------------------------------
check('init scaffolds icons/ (i-prt-* collection)', existsSync(join(APP, 'icons/.gitkeep')))

// --- starters tier -----------------------------------------------------------
run(`${PRT} add formcheckout --yes`)
check(
  'starter bundle copied to src/starters',
  existsSync(join(APP, 'src/starters/formcheckout/CheckoutSteps.vue')),
)
check(
  'starter README copied (printed as install steps)',
  existsSync(join(APP, 'src/starters/formcheckout/README.md')),
)
check(
  'starter internal dep pulled to componentDir',
  existsSync(join(APP, 'src/components/ui/checkoutordersummary/PrtCheckoutOrderSummary.vue')),
)
run(`${PRT} add splashscreen --yes`)
check(
  'splash starter composable copied',
  existsSync(join(APP, 'src/starters/splashscreen/useSplashDismiss.ts')),
)

// --- real build ---------------------------------------------------------------
const build = run('bun x vite build')
check('vite build succeeds', build.includes('built in'))

// --- report --------------------------------------------------------------------
console.log(failures === 0 ? '\nverify:fresh PASSED' : `\nverify:fresh FAILED (${failures})`)
if (process.env.PRT_KEEP !== '1') rmSync(APP, { recursive: true, force: true })
else console.log(`kept: ${APP}`)
process.exit(failures === 0 ? 0 : 1)
