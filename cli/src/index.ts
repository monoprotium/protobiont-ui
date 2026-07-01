#!/usr/bin/env node
import { Command } from 'commander'
import { handleAdd } from './commands/add.js'
import { handleDiff } from './commands/diff.js'
import { handleInit } from './commands/init.js'
import { handleList } from './commands/list.js'
import { handleScaffold } from './commands/scaffold.js'

const program = new Command()

program
  .name('prt')
  .description('Protobiont UI — copy-source component CLI')
  .version('0.0.1')

program
  .command('init')
  .description('Initialize a project (config, tokens, _shared, deps)')
  .option('-y, --yes', 'non-interactive: accept defaults')
  .action(handleInit)

program
  .command('add')
  .description('Add component(s) with dependency resolution')
  .argument('<names...>', 'component names (PrtBtn) or folders (btn)')
  .option('-y, --yes', 'non-interactive: skip prompts (modified files are kept)')
  .option('-f, --force', 'overwrite locally modified files')
  .action(handleAdd)

program
  .command('list')
  .description('List available components')
  .option('--json', 'machine-readable registry dump')
  .action(handleList)

program
  .command('diff')
  .description('Diff installed component against current template')
  .argument('<name>', 'component name')
  .action(handleDiff)

program
  .command('scaffold')
  .description('(author) stamp a new component into templates/')
  .argument('<name>', 'PascalCase name, e.g. PrtBadge')
  .requiredOption('-c, --category <category>', 'base | composite | recipe')
  .action(handleScaffold)

program.parseAsync()
