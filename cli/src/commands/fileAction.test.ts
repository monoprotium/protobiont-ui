import { describe, expect, it } from 'bun:test'
import { fileAction } from './fileAction'

// Guards consumer edits: locally modified → conflict unless --force. Pure, so tested directly (prompt + fs live in handleAdd).

describe('fileAction', () => {
  it('installs when the file is absent', () => {
    expect(
      fileAction({ exists: false, srcHash: 'a', destHash: '', manifestHash: undefined, force: false }),
    ).toBe('install')
  })

  it('skips when the on-disk file already equals the template', () => {
    expect(
      fileAction({ exists: true, srcHash: 'a', destHash: 'a', manifestHash: 'a', force: false }),
    ).toBe('skip-unchanged')
  })

  it('updates an unmodified file when the template has moved on', () => {
    // dest matches the manifest (untouched since prt wrote it) but differs from src
    expect(
      fileAction({ exists: true, srcHash: 'b', destHash: 'a', manifestHash: 'a', force: false }),
    ).toBe('update')
  })

  it('flags a conflict when the file is locally modified (guards the edit)', () => {
    // dest differs from BOTH the manifest (user edited) and the template
    expect(
      fileAction({ exists: true, srcHash: 'b', destHash: 'x', manifestHash: 'a', force: false }),
    ).toBe('conflict')
  })

  it('treats an unmanaged existing file (no manifest entry) as a conflict', () => {
    expect(
      fileAction({ exists: true, srcHash: 'b', destHash: 'x', manifestHash: undefined, force: false }),
    ).toBe('conflict')
  })

  it('--force overrides a conflict into an update', () => {
    expect(
      fileAction({ exists: true, srcHash: 'b', destHash: 'x', manifestHash: 'a', force: true }),
    ).toBe('update')
  })

  it('still skips an unchanged file even with --force (no needless rewrite)', () => {
    expect(
      fileAction({ exists: true, srcHash: 'a', destHash: 'a', manifestHash: 'a', force: true }),
    ).toBe('skip-unchanged')
  })
})
