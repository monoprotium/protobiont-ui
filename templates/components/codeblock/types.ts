export interface PrtCodeBlockProps {
  // Raw source for RUNTIME highlighting. When set (and `html` is not), the
  // component lazy-imports `./lib/highlight` and highlights on the client.
  // Omit it and pass `html` to stay highlighter-free (build-time / BYO).
  code?: string
  // Language id for the grammar (must be in lib/highlight.ts's list). Default 'text'.
  lang?: string
  // Pre-highlighted HTML (a Shiki `<pre class="shiki">…` string from a
  // build-time pipeline or your own highlighter). When set, the runtime
  // highlighter is NEVER imported — zero highlighter bytes on this path.
  html?: string
  // Optional filename/title shown in the toolbar.
  filename?: string
  // Show the copy button. Default true.
  copyable?: boolean
  // Render line numbers (CSS counter over Shiki's per-line spans). Default false.
  lineNumbers?: boolean
  // Copy-button idle label (D13: no hardcoded user-facing strings). Default 'Copy'.
  copyLabel?: string
  // Copy-button success label. Default 'Copied'.
  copiedLabel?: string
  // layout-only additions (margin, grid placement).
  class?: string
}
