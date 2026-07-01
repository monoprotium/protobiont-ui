import { bold, cyan, gray } from 'kolorist'
import { allComponents } from '../utils/registry.js'

interface ListOptions {
  json?: boolean
}

export function handleList(opts: ListOptions): void {
  const components = allComponents()

  if (opts.json) {
    // agent interface
    const out = Object.fromEntries(components.map((c) => [c.name, c]))
    console.log(JSON.stringify(out, null, 2))
    return
  }

  for (const category of ['base', 'composite', 'recipe', 'starter'] as const) {
    const group = components.filter((c) => c.category === category)
    if (group.length === 0) continue
    console.log(bold(`\n${category} (${group.length})`))
    for (const c of group) {
      const deps =
        c.internalDependencies.length > 0
          ? gray(` (deps: ${c.internalDependencies.join(', ')})`)
          : ''
      console.log(`  ${cyan(c.name)} — ${c.description}${deps}`)
    }
  }
  console.log(gray('\nUsage: prt add <name> · prt list --json for machine output'))
}
