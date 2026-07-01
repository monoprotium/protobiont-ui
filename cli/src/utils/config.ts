import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'pathe'

export interface ProjectConfig {
  componentDir: string
  framework: 'vue' | 'nuxt'
  // component name → relative file → sha256 at install time
  installed: Record<string, Record<string, string>>
}

const CONFIG_FILE = 'components.json'

export async function loadConfig(): Promise<ProjectConfig | null> {
  try {
    const raw = await fs.readFile(join(process.cwd(), CONFIG_FILE), 'utf-8')
    const cfg = JSON.parse(raw) as ProjectConfig
    cfg.installed ??= {}
    return cfg
  } catch {
    return null
  }
}

export async function saveConfig(config: ProjectConfig): Promise<void> {
  await fs.writeFile(
    join(process.cwd(), CONFIG_FILE),
    `${JSON.stringify(config, null, 2)}\n`,
  )
}

export async function detectFramework(): Promise<'vue' | 'nuxt'> {
  for (const f of ['nuxt.config.ts', 'nuxt.config.js']) {
    try {
      await fs.access(join(process.cwd(), f))
      return 'nuxt'
    } catch {
      // keep looking
    }
  }
  return 'vue'
}

export function hashContent(content: Buffer | string): string {
  return createHash('sha256').update(content).digest('hex')
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}
