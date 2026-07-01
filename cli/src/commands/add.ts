import { promises as fs } from 'node:fs'
import * as p from '@clack/prompts'
import { execa } from 'execa'
import { bold, cyan, green, red, yellow } from 'kolorist'
import { dirname, join } from 'pathe'
import {
  fileExists,
  hashContent,
  loadConfig,
  saveConfig,
} from '../utils/config.js'
import { componentTemplateDir, starterTemplateDir } from '../utils/paths.js'
import { type RegistryEntry, resolveWithDependencies } from '../utils/registry.js'
import { assertNever, fileAction } from './fileAction.js'

interface AddOptions {
  yes?: boolean
  force?: boolean
}

type FileAction = 'installed' | 'updated' | 'skipped-unchanged' | 'skipped-modified'

export async function handleAdd(names: string[], opts: AddOptions): Promise<void> {
  const config = await loadConfig()
  if (!config) {
    console.error(red('Not initialized — run `prt init` first.'))
    process.exit(1)
  }

  let components: Map<string, RegistryEntry>
  try {
    components = resolveWithDependencies(names)
  } catch (err) {
    console.error(red(String(err instanceof Error ? err.message : err)))
    console.error(cyan('Run `prt list` to see available components.'))
    process.exit(1)
  }

  p.intro(`prt add — installing: ${[...components.keys()].join(', ')}`)

  const counts: Record<FileAction, number> = {
    installed: 0,
    updated: 0,
    'skipped-unchanged': 0,
    'skipped-modified': 0,
  }
  let failed = false

  const startersInstalled: RegistryEntry[] = []

  for (const entry of components.values()) {
    const manifest = (config.installed[entry.name] ??= {})
    const isStarter = entry.category === 'starter'
    if (isStarter) startersInstalled.push(entry)
    const srcDir = isStarter
      ? starterTemplateDir(entry.folder)
      : componentTemplateDir(entry.folder)
    const destDir = isStarter
      ? join(process.cwd(), 'src/starters', entry.folder)
      : join(process.cwd(), config.componentDir, entry.folder)

    for (const relFile of entry.files) {
      const srcContent = await fs.readFile(join(srcDir, relFile))
      const srcHash = hashContent(srcContent)
      const destPath = join(destDir, relFile)
      const manifestKey = join(entry.folder, relFile)

      const exists = await fileExists(destPath)
      const destHash = exists ? hashContent(await fs.readFile(destPath)) : ''
      const verb = fileAction({
        exists,
        srcHash,
        destHash,
        manifestHash: manifest[manifestKey],
        force: opts.force ?? false,
      })

      if (verb === 'install') {
        await fs.mkdir(dirname(destPath), { recursive: true })
        await fs.writeFile(destPath, srcContent)
        manifest[manifestKey] = srcHash
        counts.installed++
        continue
      }
      if (verb === 'skip-unchanged') {
        manifest[manifestKey] = srcHash
        counts['skipped-unchanged']++
        continue
      }
      if (verb === 'update') {
        await fs.writeFile(destPath, srcContent)
        manifest[manifestKey] = srcHash
        counts.updated++
        continue
      }

      if (verb === 'conflict') {
        // conflict: prompt lives here (I/O), never in fileAction.
        if (opts.yes) {
          p.log.warn(`${manifestKey}: locally modified — skipped (use --force)`)
          counts['skipped-modified']++
          failed = true
          continue
        }
        const answer = await p.select({
          message: `${manifestKey} is locally modified. Overwrite?`,
          options: [
            { value: 'skip', label: 'Keep my version' },
            { value: 'overwrite', label: 'Overwrite with template' },
          ],
        })
        if (p.isCancel(answer)) return p.cancel('Cancelled.')
        if (answer === 'overwrite') {
          await fs.writeFile(destPath, srcContent)
          manifest[manifestKey] = srcHash
          counts.updated++
        } else {
          counts['skipped-modified']++
        }
      } else {
        assertNever(verb)
      }
    }
  }

  await saveConfig(config)

  const externals = [
    ...new Set([...components.values()].flatMap((c) => c.externalDependencies)),
  ]
  if (externals.length > 0) {
    let install = opts.yes ?? false
    if (!opts.yes) {
      const answer = await p.confirm({
        message: `Install external dependencies? (${externals.join(', ')})`,
      })
      if (p.isCancel(answer)) return p.cancel('Cancelled.')
      install = answer
    }
    if (install) {
      try {
        await execa('bun', ['add', ...externals])
        p.log.success(`Dependencies: ${externals.join(', ')}`)
      } catch (err) {
        p.log.error(`Dependency install failed: ${err}`)
        p.log.info(`Install manually: bun add ${externals.join(' ')}`)
        failed = true
      }
    }
  }

  const summary = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${k}: ${n}`)
    .join(', ')
  p.log.info(summary || 'nothing to do')

  for (const entry of components.values()) {
    if (entry.category === 'starter') continue // starters print install steps, not an import
    p.log.message(
      `import { ${entry.name} } from '${cyan(`@/${config.componentDir.replace(/^src\//, '')}/${entry.folder}`)}'`,
    )
  }

  // CLI can't safely patch index.html/main.ts/router — starter README carries the steps
  for (const entry of startersInstalled) {
    const readmePath = join(process.cwd(), 'src/starters', entry.folder, 'README.md')
    if (await fileExists(readmePath)) {
      p.note(await fs.readFile(readmePath, 'utf-8'), `${entry.name} — install steps (src/starters/${entry.folder})`)
    } else {
      p.log.info(`${entry.name} copied to src/starters/${entry.folder}`)
    }
  }

  if (failed) {
    p.outro(yellow('Finished with warnings — see above.'))
    process.exit(1)
  }
  p.outro(green(bold('Done.')))
}
