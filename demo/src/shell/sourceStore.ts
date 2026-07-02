import { ref } from 'vue'

export interface ActiveSnippet {
  /** section title, e.g. "Solid · all colors" */
  title: string
  /** template-level snippet as authored in the demo */
  code: string
  /** component names to import, e.g. ['PrtBtn'] */
  imports: string[]
  /**
   * Verbatim, non-template source (e.g. composable/script wiring): show `code`
   * exactly as given, WITHOUT the <template>/<script setup> SFC scaffold.
   */
  raw?: boolean
  /** highlight language (default 'vue'); pair with `raw` for ts/bash/etc. */
  lang?: string
}

/** module-level singleton: the snippet currently shown in the source panel */
export const activeSnippet = ref<ActiveSnippet | null>(null)

export function showSnippet(snippet: ActiveSnippet) {
  activeSnippet.value = snippet
}

/** used by the first section on a page so the panel is never empty */
export function showSnippetIfEmpty(snippet: ActiveSnippet) {
  if (!activeSnippet.value) activeSnippet.value = snippet
}

export function clearSnippet() {
  activeSnippet.value = null
}
