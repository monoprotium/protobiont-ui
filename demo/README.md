# demo

A Vite + Vue app that renders the components as a live gallery. It reads
`../templates` directly — no copy step, no build of the kit first. Edit a
component or its `.demo.vue` and the gallery hot-reloads.

## Run

```sh
bun install
bun dev
```

## How it works

- **Source in place.** `vite.config.ts` aliases `@ui` → `../templates/components`
  and opens the parent dir to Vite's file server. The demo is a window onto the
  real source, not a copy.
- **Auto-discovery.** `router.ts` globs `../../templates/components/*/*.demo.vue`,
  so any component folder with a `.demo.vue` shows up with zero registration. The
  gallery list and metadata come from `cli/src/registry.json`.
- **Source panel.** `plugins/vite-plugin-demo-source.ts` runs before the Vue
  plugin and injects each `<DemoItem>`'s slot markup as a `code` prop at build
  time. The live render and the shown source are the same text — one source of
  truth, no runtime template compiler in the bundle.
- **Concept pages.** `src/pages/*` holds hand-authored pages that aren't tied to
  one component (seeds, ink, theming, icons, forms, checkout…). `src/shell/*` is
  the gallery chrome.
