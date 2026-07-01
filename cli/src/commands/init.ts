import { promises as fs } from 'node:fs'
import * as p from '@clack/prompts'
import { execa } from 'execa'
import { cyan, gray, green, yellow } from 'kolorist'
import { dirname, join } from 'pathe'
import {
  detectFramework,
  fileExists,
  loadConfig,
  saveConfig,
} from '../utils/config.js'
import { configTemplateDir, sharedTemplateDir } from '../utils/paths.js'

const RUNTIME_DEPS = ['class-variance-authority', 'clsx']
// @iconify/utils powers the FileSystemIconLoader for the custom `i-prt-*`
// collection scaffolded in uno.config.ts (custom-icons distribution).
const DEV_DEPS = ['unocss', '@unocss/reset', '@iconify-json/lucide', '@iconify/utils']

const MAIN_TS_SNIPPET = `import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import './styles/tokens.css'`

interface InitOptions {
  yes?: boolean
}

// returns true if written
async function writeIfAbsent(path: string, content: string | Buffer): Promise<boolean> {
  if (await fileExists(path)) return false
  await fs.mkdir(dirname(path), { recursive: true })
  await fs.writeFile(path, content)
  return true
}

export async function handleInit(opts: InitOptions): Promise<void> {
  p.intro('prt init — Protobiont UI')

  if (await loadConfig()) {
    p.log.warn('components.json already exists — project is initialized.')
    p.outro('Nothing to do.')
    return
  }

  const framework = await detectFramework()
  p.log.info(`Detected framework: ${cyan(framework)}`)

  let componentDir = 'src/components/ui'
  let installDeps = true

  if (!opts.yes) {
    const dir = await p.text({
      message: 'Where should components live?',
      defaultValue: componentDir,
      placeholder: componentDir,
    })
    if (p.isCancel(dir)) return p.cancel('Cancelled.')
    componentDir = dir || componentDir

    const deps = await p.confirm({
      message: `Install dependencies? (${[...RUNTIME_DEPS, ...DEV_DEPS].join(', ')})`,
    })
    if (p.isCancel(deps)) return p.cancel('Cancelled.')
    installDeps = deps
  }

  // 1. config with empty manifest
  await saveConfig({ componentDir, framework, installed: {} })
  p.log.success('Created components.json')

  // 2. _shared module
  const sharedSrc = sharedTemplateDir()
  const sharedDest = join(process.cwd(), componentDir, '_shared')
  let sharedCopied = 0
  for (const file of await fs.readdir(sharedSrc)) {
    // .test.ts files are author-side; _shared bypasses the registry so this filter must be explicit.
    if (file.endsWith('.test.ts')) continue
    const content = await fs.readFile(join(sharedSrc, file))
    if (await writeIfAbsent(join(sharedDest, file), content)) sharedCopied++
  }
  p.log.success(`Installed ${componentDir}/_shared (${sharedCopied} file(s))`)

  // 3. config files — never overwrite existing ones
  const configs: Array<[string, string]> = [
    ['tokens.css', 'src/styles/tokens.css'],
    ['uno.config.ts', 'uno.config.ts'],
    ['vite.config.ts', 'vite.config.ts'],
  ]
  const skipped: string[] = []
  for (const [src, dest] of configs) {
    const content = await fs.readFile(join(configTemplateDir(), src))
    if (await writeIfAbsent(join(process.cwd(), dest), content)) {
      p.log.success(`Created ${dest}`)
    } else {
      skipped.push(dest)
    }
  }
  for (const dest of skipped) {
    p.log.warn(
      `${dest} exists — left untouched. Reference version: ${gray(
        join(configTemplateDir(), dest.split('/').pop() ?? dest),
      )}`,
    )
  }

  // 3b. icons/ scaffold: FileSystemIconLoader in uno.config.ts resolves i-prt-* SVGs from here.
  if (await writeIfAbsent(join(process.cwd(), 'icons/.gitkeep'), '')) {
    p.log.success('Created icons/ (drop SVGs here → i-prt-<name>)')
  }

  // 4. dependencies
  if (installDeps) {
    const s = p.spinner()
    s.start('Installing dependencies with bun')
    try {
      await execa('bun', ['add', ...RUNTIME_DEPS])
      await execa('bun', ['add', '-d', ...DEV_DEPS])
      s.stop('Dependencies installed')
    } catch (err) {
      s.stop(yellow('Dependency install failed'))
      p.log.error(String(err))
      p.log.info(
        `Install manually: bun add ${RUNTIME_DEPS.join(' ')} && bun add -d ${DEV_DEPS.join(' ')}`,
      )
      process.exitCode = 1
    }
  }

  // 5. main.ts — never patched, always printed
  p.note(MAIN_TS_SNIPPET, 'Add to your src/main.ts')
  if (framework === 'nuxt') {
    p.note(
      `modules: ['@unocss/nuxt']\ncss: ['@unocss/reset/tailwind-compat.css', '~/styles/tokens.css']`,
      'Nuxt: add to nuxt.config.ts (and skip vite.config.ts)',
    )
  }

  p.outro(green('Initialized. Next: prt add PrtBtn'))
}
