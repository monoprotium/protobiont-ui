// Builds cli/src/registry.json from templates/ — never hand-edit the output. Fails loudly on drift.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const COMPONENTS_DIR = join(ROOT, 'templates/components')
const STARTERS_DIR = join(ROOT, 'templates/starters')
const OUT = join(ROOT, 'cli/src/registry.json')

interface ComponentMeta {
  name: string
  description: string
  category: 'base' | 'composite' | 'recipe' | 'starter'
  internalDependencies: string[]
  externalDependencies: string[]
}

interface RegistryEntry extends ComponentMeta {
  folder: string
  files: string[]
}

const errors: string[] = []
const registry: Record<string, RegistryEntry> = {}

function walkFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walkFiles(full))
    else out.push(full)
  }
  return out
}

function scan(baseDir: string): void {
  if (!existsSync(baseDir)) return
  const folders = readdirSync(baseDir).filter(
    (f) => !f.startsWith('_') && statSync(join(baseDir, f)).isDirectory(),
  )

  for (const folder of folders) {
    const dir = join(baseDir, folder)
    let meta: ComponentMeta
    try {
      meta = JSON.parse(readFileSync(join(dir, 'component.json'), 'utf-8'))
    } catch {
      errors.push(`${folder}: missing or invalid component.json`)
      continue
    }

    for (const field of ['name', 'description', 'category'] as const) {
      if (!meta[field]) errors.push(`${folder}: component.json missing "${field}"`)
    }
    meta.internalDependencies ??= []
    meta.externalDependencies ??= []

    // installable: everything except component.json, demos, and tests. Starter README.md stays — CLI copies + prints it.
    const files = walkFiles(dir)
      .map((f) => relative(dir, f))
      .filter(
        (f) =>
          f !== 'component.json' &&
          !f.endsWith('.demo.vue') &&
          !f.endsWith('.test.ts'),
      )
      .sort()

    if (files.length === 0) {
      errors.push(`${folder}: no installable files`)
      continue
    }
    if (registry[meta.name]) {
      errors.push(`${folder}: duplicate component name "${meta.name}"`)
      continue
    }

    registry[meta.name] = { ...meta, folder, files }
  }
}

scan(COMPONENTS_DIR)
scan(STARTERS_DIR)

// validate internal dependency graph
for (const [name, entry] of Object.entries(registry)) {
  for (const dep of entry.internalDependencies) {
    if (!registry[dep]) errors.push(`${name}: unknown internal dependency "${dep}"`)
  }
  // belt-and-suspenders: the filter above should catch .test.ts; this fails loud if one slips through.
  for (const file of entry.files) {
    if (file.endsWith('.test.ts')) {
      errors.push(`${name}: test file "${file}" must not be an installable file`)
    }
  }
}

if (errors.length > 0) {
  console.error('registry build FAILED:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

const sorted = Object.fromEntries(
  Object.entries(registry).sort(([a], [b]) => a.localeCompare(b)),
)
writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`)
console.log(
  `registry: ${Object.keys(sorted).length} component(s) → ${relative(ROOT, OUT)}`,
)
