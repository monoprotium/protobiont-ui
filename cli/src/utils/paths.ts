import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'pathe'

const HERE = dirname(fileURLToPath(import.meta.url))

// PRT_ROOT wins (Nix builds); otherwise walk up — depth differs between cli/src and cli/dist entry points.
export function templatesDir(): string {
  if (process.env.PRT_ROOT) return join(process.env.PRT_ROOT, 'templates')
  let dir = HERE
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, 'templates')
    if (existsSync(join(candidate, 'components'))) return candidate
    dir = resolve(dir, '..')
  }
  throw new Error(
    'templates/ not found — set PRT_ROOT to the protobiont repo root',
  )
}

export function componentTemplateDir(folder: string): string {
  return join(templatesDir(), 'components', folder)
}

export function starterTemplateDir(folder: string): string {
  return join(templatesDir(), 'starters', folder)
}

export function sharedTemplateDir(): string {
  return join(templatesDir(), 'components', '_shared')
}

export function configTemplateDir(): string {
  return join(templatesDir(), 'config')
}
