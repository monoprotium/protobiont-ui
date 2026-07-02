<!--
  PrtCodeBlock
  A tree-shakeable code block. The component is a zero-dependency styled wrapper:
  chrome (filename, copy, optional line numbers) + dual-mode token CSS. It imports
  no highlighter statically.

  Two ways to feed it:
    • `html`  — a pre-highlighted Shiki string (build-time / SSG / your own
      pipeline). The runtime highlighter is never touched → zero highlighter bytes.
    • `code` + `lang` — raw source; the component lazy-imports `./lib/highlight`
      (the optional Shiki singleton) on first render, so the highlighter lands in a
      separate async chunk loaded only when a block actually renders.

  Leaf rule: nothing else in the kit may import this component or lib/highlight —
  that's what keeps an app that never adds it at zero highlighter bytes.

  Slot contract:
    default — fallback content shown before highlight resolves / if both props omit
  emits: none
-->
<template>
  <div :class="[codeBlockClass, props.class]">
    <div v-if="filename || copyable" :class="codeBlockToolbarClass">
      <span v-if="filename" :class="codeBlockNameClass">{{ filename }}</span>
      <button
        v-if="copyable"
        type="button"
        :class="codeBlockCopyClass"
        @click="copy"
      >
        <span
          :class="copied ? 'i-lucide-check text-accent' : 'i-lucide-copy'"
          class="h-3.5 w-3.5"
          aria-hidden="true"
        />
        {{ copied ? copiedLabel : copyLabel }}
      </button>
    </div>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      v-if="rendered"
      class="prt-code__body"
      :data-line-numbers="lineNumbers || undefined"
      v-html="rendered"
    />
    <div v-else class="prt-code__body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import type { PrtCodeBlockProps } from './types'
import {
  codeBlockClass,
  codeBlockCopyClass,
  codeBlockNameClass,
  codeBlockToolbarClass,
} from './variants'

const props = withDefaults(defineProps<PrtCodeBlockProps>(), {
  lang: 'text',
  copyable: true,
  lineNumbers: false,
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  class: '',
})

const rendered = shallowRef<string>(props.html ?? '')
const copied = ref(false)

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

watch(
  () => [props.html, props.code, props.lang] as const,
  async ([html, code, lang]) => {
    if (html !== undefined) {
      rendered.value = html
      return
    }
    if (!code) {
      rendered.value = ''
      return
    }
    try {
      // lazy: this dynamic import is the code-split boundary — Shiki lands in
      // its own async chunk, fetched only now (first render of a coded block).
      const { highlight } = await import('./lib/highlight')
      rendered.value = await highlight(code, lang)
    } catch {
      // unknown/unloaded language, or highlight failure → readable plain text
      rendered.value = `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
    }
  },
  { immediate: true },
)

function plainText(): string {
  if (props.code != null) return props.code
  if (typeof document !== 'undefined' && props.html) {
    const el = document.createElement('div')
    el.innerHTML = props.html
    return el.textContent ?? ''
  }
  return ''
}

async function copy(): Promise<void> {
  await navigator.clipboard.writeText(plainText())
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<!--
  NON-scoped on purpose: the highlighted markup arrives via v-html (no scope
  hash, like PrtProse), and the dual-mode flip keys off `[data-mode]` on a root
  ANCESTOR. Everything is namespaced under `.prt-code`, so it cannot leak. The
  token palette comes straight from Shiki's `--shiki-light` / `--shiki-dark`
  vars (emitted because `defaultColor: false`); because there is no inline
  `color:` to beat, NO `!important` is needed. Background stays the kit surface
  (we deliberately do NOT consume Shiki's `--shiki-*-bg`) so the block reads
  on-brand. em-free: rem / ch / lh / unitless only.
-->
<style>
.prt-code .shiki {
  margin: 0;
  padding: 0.875rem 1rem;
  overflow-x: auto;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  tab-size: 2;
}

/* dark is the kit default — apply the dark token everywhere */
.prt-code .shiki,
.prt-code .shiki span {
  color: var(--shiki-dark);
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}

/* light mode override (the kit toggles [data-mode='light'] on a root element) */
[data-mode='light'] .prt-code .shiki,
[data-mode='light'] .prt-code .shiki span {
  color: var(--shiki-light);
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}

/* un-toggled root: honor the OS preference so light-OS users read light */
@media (prefers-color-scheme: light) {
  :root:not([data-mode]) .prt-code .shiki,
  :root:not([data-mode]) .prt-code .shiki span {
    color: var(--shiki-light);
    font-style: var(--shiki-light-font-style);
    font-weight: var(--shiki-light-font-weight);
    text-decoration: var(--shiki-light-text-decoration);
  }
}

/* optional line numbers — a CSS counter over Shiki's per-line `.line` spans */
.prt-code__body[data-line-numbers] .shiki code {
  counter-reset: prt-ln;
}
.prt-code__body[data-line-numbers] .shiki .line::before {
  counter-increment: prt-ln;
  content: counter(prt-ln);
  display: inline-block;
  width: 2ch;
  margin-right: 1.5ch;
  text-align: right;
  color: var(--ink-faint);
  user-select: none;
}
</style>
