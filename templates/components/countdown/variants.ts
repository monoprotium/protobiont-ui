// Countdown default-render look — plain class constants (tabular-nums mono, slot-first).

// root wraps the parts row + (optional) interactive controls
export const countdownRootClass = 'inline-flex flex-col items-center gap-3'

// the <time> parts row
export const countdownRowClass = 'inline-flex items-center gap-3'

// duration-timer default render — a single mm:ss / h:mm:ss clock
export const countdownClockClass =
  'text-3xl font-medium tabular-nums tracking-tight text-[var(--seed,var(--ink))]'

// the start/pause/reset control row
export const countdownControlsClass = 'inline-flex items-center gap-2'

export const countdownNumClass =
  'block min-w-[2ch] text-center text-2xl font-medium tabular-nums text-[var(--seed,var(--ink))]'

export const countdownLabelClass =
  'text-[0.625rem] font-mono uppercase tracking-wide text-ink-faint'
