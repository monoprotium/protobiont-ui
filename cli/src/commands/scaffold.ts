import { promises as fs } from 'node:fs'
import { green, red } from 'kolorist'
import { join } from 'pathe'
import { fileExists } from '../utils/config.js'
import { componentTemplateDir } from '../utils/paths.js'

interface ScaffoldOptions {
  category: 'base' | 'composite' | 'recipe'
}

export async function handleScaffold(
  name: string,
  opts: ScaffoldOptions,
): Promise<void> {
  if (!/^Prt[A-Z]/.test(name)) {
    console.error(red(`Name must be PascalCase with Prt prefix (got '${name}')`))
    process.exit(1)
  }
  const folder = name.replace(/^Prt/, '').toLowerCase()
  const dir = componentTemplateDir(folder)
  if (await fileExists(dir)) {
    console.error(red(`templates/components/${folder} already exists.`))
    process.exit(1)
  }
  await fs.mkdir(dir, { recursive: true })

  const files: Record<string, string> = {
    'component.json': `${JSON.stringify(
      {
        name,
        description: 'TODO',
        category: opts.category,
        internalDependencies: [],
        externalDependencies: ['class-variance-authority'],
      },
      null,
      2,
    )}\n`,

    [`${name}.vue`]: `<!--
  ${name}
  Slot contract: default — content
-->
<template>
  <div :class="cx(rootVariants({ size }), props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { ${name}Props } from './types'
import { rootVariants } from './variants'

const props = withDefaults(defineProps<${name}Props>(), {
  size: 'base',
  class: '',
})
</script>
`,

    'variants.ts': `import { cva } from 'class-variance-authority'

export const rootVariants = cva('prt-motion-colors', {
  variants: {
    size: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'base',
  },
})
`,

    'types.ts': `import type { PrtSize } from '../_shared/types'

export interface ${name}Props {
  size?: PrtSize
  /** layout-only additions (margin/width) — appearance goes through variants */
  class?: string
}
`,

    'index.ts': `export { default as ${name} } from './${name}.vue'
export * from './types'
export * from './variants'
`,

    [`${folder}.demo.vue`]: `<template>
  <DemoSection title="Default" :code="snippets.default">
    <${name}>content</${name}>
  </DemoSection>
</template>

<script setup lang="ts">
import ${name} from './${name}.vue'
import DemoSection from '@demo/DemoSection.vue'

const snippets = {
  default: '<${name}>content</${name}>',
}
</script>
`,
  }

  for (const [file, content] of Object.entries(files)) {
    await fs.writeFile(join(dir, file), content)
  }
  console.log(green(`Scaffolded templates/components/${folder}/ (${name})`))
  console.log('Next: edit files, then `bun run registry` to register it.')
}
