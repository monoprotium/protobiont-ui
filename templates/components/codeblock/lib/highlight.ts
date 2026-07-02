// PrtCodeBlock — the OPTIONAL runtime highlighter singleton.
// No Vue imports in this file. Copied by `prt add PrtCodeBlock` only when
// runtime highlighting is wanted; nothing else in the kit may import it (the
// leaf-component rule), so an app that never renders a block ships ZERO bytes.
//
// Fine-grained Shiki core + the JavaScript regex engine — NEVER `shiki`,
// `shiki/bundle/web`, or `shiki/bundle/full`. The JS engine transpiles the
// TextMate Oniguruma patterns to native RegExp (ES2024 `v` flag), so the
// ~231KB-gz Oniguruma WASM is dropped entirely. As of Shiki 3.9.1 every
// built-in language is supported on the JS engine.
//
// PrtCodeBlock.vue dynamic-imports this module, so Vite/Rollup code-splits the
// whole highlighter (core + engine + each lang + each theme) into a lazy chunk
// fetched only on first render.
import { createHighlighterCore, type HighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'

let highlighter: Promise<HighlighterCore> | undefined

function build(): Promise<HighlighterCore> {
  return createHighlighterCore({
    // ── EDIT THESE LISTS to trim or add themes/languages. The one obvious knob.
    //    Each entry is a dynamic import() so an unused language never weighs on
    //    the base highlight chunk.
    themes: [
      import('@shikijs/themes/vitesse-dark'),
      import('@shikijs/themes/vitesse-light'),
    ],
    langs: [
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/vue'),
      import('@shikijs/langs/bash'),
      import('@shikijs/langs/json'),
      import('@shikijs/langs/css'),
      import('@shikijs/langs/html'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
}

// Lazily build (once) and return the shared highlighter.
export function getHighlighter(): Promise<HighlighterCore> {
  return (highlighter ??= build())
}

// Highlight `code` as `lang` into a dual-theme HTML string.
// `defaultColor: false` emits ONLY the `--shiki-light` / `--shiki-dark` CSS
// variables (no inline `color:`), so the kit's `[data-mode]` CSS flips the
// palette with zero re-render and — crucially — NO `!important`.
export async function highlight(code: string, lang: string): Promise<string> {
  const hl = await getHighlighter()
  return hl.codeToHtml(code, {
    lang,
    themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    defaultColor: false,
  })
}
