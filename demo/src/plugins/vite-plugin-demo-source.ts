import { parse } from '@vue/compiler-sfc'
import { baseParse, type ElementNode, NodeTypes } from '@vue/compiler-dom'
import type { Plugin } from 'vite'

// Injects each <DemoItem>'s slot source as a `code` prop at build time, so the
// live render is the compiled slot and the source panel shows the exact text.
// Runs BEFORE @vitejs/plugin-vue (enforce: 'pre'). Only touches *.demo.vue and
// only DemoItems that have slot children and no explicit :code — so a file
// mid-migration (still string-form) is left untouched.
export function demoSource(): Plugin {
  return {
    name: 'demo-source',
    enforce: 'pre',
    transform(src, id) {
      if (!id.endsWith('.demo.vue')) return
      const { descriptor } = parse(src)
      const tmpl = descriptor.template
      if (!tmpl) return

      const content = tmpl.content // the <template> inner source
      const base = tmpl.loc.start.offset // offset of `content` within `src`
      const root = baseParse(content)

      // collect edits as { at: insertOffsetInSrc, text }
      const edits: { at: number; text: string }[] = []

      const walk = (node: any) => {
        if (node.type === NodeTypes.ELEMENT) {
          const el = node as ElementNode
          if (el.tag === 'DemoItem') {
            const hasCode = el.props.some(
              (p: any) =>
                (p.type === NodeTypes.ATTRIBUTE && p.name === 'code') ||
                (p.type === NodeTypes.DIRECTIVE && p.arg?.content === 'code'),
            )
            if (!hasCode && el.children.length) {
              const firstNode = el.children[0]
              const first = firstNode.loc.start.offset
              const last = el.children[el.children.length - 1].loc.end.offset
              // the slice starts AT the first child, dropping that line's leading
              // indent — restore it (column is 1-based) so dedent sees a uniform
              // block and normalizes the example to a flush-left snippet.
              const lead = ' '.repeat(firstNode.loc.start.column - 1)
              const raw = lead + content.slice(first, last)
              const code = dedent(raw).trim()
              // insert ` :code="<serialized>"` right after `<DemoItem`
              const tagOpen = base + el.loc.start.offset + '<DemoItem'.length
              edits.push({ at: tagOpen, text: ` :code=${serialize(code)}` })
            }
          }
        }
        node.children?.forEach(walk)
      }
      root.children.forEach(walk)

      if (!edits.length) return
      edits.sort((a, b) => b.at - a.at) // apply right-to-left so offsets stay valid
      let out = src
      for (const e of edits) out = out.slice(0, e.at) + e.text + out.slice(e.at)
      return { code: out, map: null }
    },
  }
}

// serialize a multi-line string as a Vue-safe bound attribute value.
// Two layers:
//   1. JS-string escaping — the value is a single-quoted JS literal, so escape
//      `\`, `'`, and newlines.
//   2. HTML-attribute escaping — the literal sits inside a double-quoted attr,
//      and the slot markup itself contains `"` (class="…"), so entity-encode
//      `&` and `"`. Vue decodes entities in attribute values (incl. :bindings)
//      before parsing the expression, so this round-trips back to the exact
//      source string. `<`/`>` are valid inside a quoted attr value, left as-is.
// Result: :code="'&lt;div class=&quot;…&quot;&gt;…'"  →  '<div class="…">…'
function serialize(s: string): string {
  const js = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
  const attr = `'${js}'`.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  return `"${attr}"`
}

function dedent(s: string): string {
  const lines = s.replace(/^\n/, '').split('\n')
  const indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length),
  )
  return lines.map((l) => l.slice(indent)).join('\n')
}
