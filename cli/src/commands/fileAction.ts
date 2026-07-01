// Pure 4-way decision for `prt add` — no I/O, no prompt; testable directly. Prompt + fs live in handleAdd.

export type FileVerb = 'install' | 'skip-unchanged' | 'update' | 'conflict'

export function assertNever(x: never): never {
  throw new Error(`Unhandled FileVerb: ${JSON.stringify(x)}`)
}

export interface FileActionInput {
  exists: boolean
  srcHash: string
  destHash: string
  manifestHash: string | undefined
  force: boolean
}

export function fileAction(input: FileActionInput): FileVerb {
  if (!input.exists) return 'install'
  if (input.destHash === input.srcHash) return 'skip-unchanged'
  const locallyModified = input.manifestHash !== input.destHash
  if (locallyModified && !input.force) return 'conflict'
  return 'update'
}
