// Audio player look — plain class constants (no variant axes worth a CVA table).

export const audioPlayerClass =
  'flex flex-col gap-3 rounded-surface border border-edge bg-surface-1 p-4'

// compact = a single slim control row (a web-player bottom bar); tighter
// padding, no title block, no waveform — the 2025-era compact player, redrawn.
export const audioPlayerCompactClass =
  'flex items-center gap-2 rounded-surface border border-edge bg-surface-1 px-3 py-2'

// bare = NO container chrome (border/bg/padding) — for embedding inside another
// surface (e.g. the recorder review) without a nested box. compact stays a row.
export const audioPlayerBareClass = 'flex flex-col gap-3'
export const audioPlayerBareCompactClass = 'flex items-center gap-2'

export const audioTimeClass = 'text-xs font-mono tabular-nums text-ink-muted'
