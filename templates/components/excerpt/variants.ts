// Clamp lives in the SFC scoped block (legacy -webkit-line-clamp, interop in
// both engines; unprefixed `line-clamp` not in Chrome); line count is a CSS var.

export const excerptToggleClass =
  'mt-1 inline-flex items-center gap-1 bg-transparent text-sm font-medium text-[var(--seed,var(--accent))] prt-motion-colors prt-ring hover:underline'
