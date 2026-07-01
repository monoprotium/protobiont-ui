import registry from '../registry.json'

export type Registry = typeof registry
export type ComponentName = keyof Registry

export interface RegistryEntry {
  name: string
  description: string
  category: 'base' | 'composite' | 'recipe' | 'starter'
  folder: string
  files: string[]
  internalDependencies: string[]
  externalDependencies: string[]
}

const entries = registry as unknown as Record<string, RegistryEntry>

export function getComponent(name: string): RegistryEntry | null {
  if (entries[name]) return entries[name]
  const lower = name.toLowerCase()
  return Object.values(entries).find((e) => e.folder === lower) ?? null
}

export function allComponents(): RegistryEntry[] {
  return Object.values(entries)
}

export function resolveWithDependencies(
  names: string[],
  resolved = new Map<string, RegistryEntry>(),
): Map<string, RegistryEntry> {
  for (const name of names) {
    const entry = getComponent(name)
    if (!entry) throw new Error(`Component '${name}' not found in registry`)
    if (resolved.has(entry.name)) continue
    resolved.set(entry.name, entry)
    resolveWithDependencies(entry.internalDependencies, resolved)
  }
  return resolved
}
