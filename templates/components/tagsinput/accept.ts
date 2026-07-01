// no Vue imports in this file. Pure tag-field decisions; the component
// stays the imperative shell (it owns emit/flash/focus and the actual push).

import type { PrtTagsInputRejectReason } from './types'

// verdict of accept — 'ok' admits; 'empty' is a silent no-op (never a
// reject); 'max'/'duplicate' are the consumer-facing reject reasons.
export type PrtTagsInputVerdict = 'ok' | 'empty' | PrtTagsInputRejectReason

export interface PrtTagsInputAcceptOptions {
  // max tag count; the cap applies per piece against the running list
  max?: number
  // exact (case-sensitive) compare; when true, duplicates are allowed in
  allowDuplicates?: boolean
}

// Would `tag` be admitted into `into`? PURE — does NOT push and does NOT
// mutate `into` (the caller pushes on 'ok' and fires emit/flash). The cap is
// checked against the *running* list, so a paste batch fills to the cap and
// then rejects the rest, and an internal duplicate only admits its first.
export function accept(
  tag: string,
  into: readonly string[],
  opts: PrtTagsInputAcceptOptions = {},
): PrtTagsInputVerdict {
  if (tag === '') return 'empty' // silent no-op — never a reject
  if (opts.max !== undefined && into.length >= opts.max) return 'max'
  if (!opts.allowDuplicates && into.includes(tag)) return 'duplicate'
  return 'ok'
}

// Split pasted text into trimmed, non-empty candidate tags on the commit
// separators (newline always; comma only while it commits). Returns `null`
// when the text has no separator — the caller should let it type as a plain
// paste (no preventDefault), which is NOT the same as an empty batch.
export function splitPasted(text: string, commaCommits: boolean): string[] | null {
  const separator = commaCommits ? /[\n,]/ : /\n/
  if (!separator.test(text)) return null
  return text
    .split(separator)
    .map((piece) => piece.trim())
    .filter((piece) => piece !== '')
}

// Stable distinct keys for a TransitionGroup — tag + occurrence counter, so
// duplicates (when allowed) don't collide and re-mount on reorder.
// `['a','a','b'] → a#0, a#1, b#0`.
export function keyTags(tags: readonly string[]): { tag: string; key: string }[] {
  const seen = new Map<string, number>()
  return tags.map((tag) => {
    const n = seen.get(tag) ?? 0
    seen.set(tag, n + 1)
    return { tag, key: `${tag}#${n}` }
  })
}
