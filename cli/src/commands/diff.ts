import { promises as fs } from 'node:fs'
import { execa } from 'execa'
import { cyan, gray, green, red } from 'kolorist'
import { join } from 'pathe'
import { fileExists, hashContent, loadConfig } from '../utils/config.js'
import { componentTemplateDir } from '../utils/paths.js'
import { getComponent } from '../utils/registry.js'

export async function handleDiff(name: string): Promise<void> {
  const config = await loadConfig()
  if (!config) {
    console.error(red('Not initialized — run `prt init` first.'))
    process.exit(1)
  }
  const entry = getComponent(name)
  if (!entry) {
    console.error(red(`Component '${name}' not found in registry.`))
    process.exit(1)
  }

  let differences = 0
  for (const relFile of entry.files) {
    const srcPath = join(componentTemplateDir(entry.folder), relFile)
    const destPath = join(process.cwd(), config.componentDir, entry.folder, relFile)

    if (!(await fileExists(destPath))) {
      console.log(`${red('missing')}  ${entry.folder}/${relFile}`)
      differences++
      continue
    }
    const same =
      hashContent(await fs.readFile(srcPath)) ===
      hashContent(await fs.readFile(destPath))
    if (same) {
      console.log(`${green('same')}     ${gray(`${entry.folder}/${relFile}`)}`)
      continue
    }
    differences++
    console.log(`${cyan('differs')}  ${entry.folder}/${relFile}`)
    // installed on the left, template on the right
    const { stdout } = await execa('diff', ['-u', destPath, srcPath], {
      reject: false,
    })
    console.log(stdout)
  }
  process.exit(differences > 0 ? 1 : 0)
}
