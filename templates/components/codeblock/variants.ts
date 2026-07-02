// CodeBlock chrome — plain literal class strings (no runtime construction).
// The frame rides kit tokens; the toolbar/copy mirror the demo source-panel
// chrome so a copied block reads native. The token COLORS (the --shiki-* flip)
// live in the SFC's NON-scoped <style> (they must reach v-html content + the
// data-mode ancestor selector — see the SFC header).

export const codeBlockClass =
  'prt-code not-prose overflow-hidden rounded-surface border border-edge bg-surface-1'

export const codeBlockToolbarClass =
  'flex items-center gap-2 border-b border-edge px-4 py-2'

export const codeBlockNameClass = 'text-xs font-mono text-ink-muted truncate'

export const codeBlockCopyClass =
  'ml-auto inline-flex items-center gap-1.5 bg-transparent text-xs font-mono text-ink-faint hover:text-ink px-2 py-1 rounded-control hover:bg-wash prt-motion-colors prt-ring'
