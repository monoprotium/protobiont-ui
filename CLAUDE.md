# CLAUDE.md — Protobiont UI

## What this is

Personal Vue 3 component kit + `prt` CLI, distributed **copy-source** (shadcn model):
components are copied into the consuming project, not imported from a package.
A personal, single-author project, shared source-available. Built on NixOS, runs on Bun.

Testing is a thin, hand-run, pure-logic net (composables + CLI logic) — never coverage,
never CI, and not to be over-built. `templates/` is the single source of truth; the
registry is generated.

## Non-negotiable styling rules

1. **Never construct class names at runtime.** No `` `border-${color}` ``, no
   `color.replace('bg-','')`. Every utility class must exist as a complete literal
   string in source. **There is no safelist and there never will be** — if styles go
   missing, the component is wrong, not the config.
2. **Closed color API — the seed system.** Decorative color is `seed?: PrtSeed`
   (pads 1–10 from the rack in `tokens.css`); the component binds `data-seed` and
   classes consume `var(--seed*)` with surface fallbacks. Bootstrap intent vocabulary
   (`primary`/`secondary`) is BANNED as a design API; true states (`error` on inputs,
   warnings on notices) keep semantic tokens. Never `color?: string`. See
   CONVENTIONS.md "Seeds vs states".
3. **Truly dynamic colors go through CSS variables**, not generated classes:
   `class="bg-[var(--prt-c)]"` + `:style="{ '--prt-c': value }"`.
4. **Components reference only semantic tokens** (`surface-0..3`, `ink/-muted/-faint`,
   `accent`, `danger`, `edge`, `rounded-control`, `rounded-surface`) — never raw
   `neutral-800`, `gray-*`, or `blue-*`.
5. **NEVER the `em` unit — anywhere, for anything.** It compounds unpredictably down
   the cascade; banned outright (the hardest rule). Use `rem`/`px` for fixed lengths
   (`rem` is fine — it is not `em`), `cap`/`lh`/`ex`/`ch` for values that must track the
   type WITHOUT compounding (mark sizes in `cap`, vertical rhythm in `lh`, indents in
   `ch`, cap-centering via `calc((1lh − 1cap)/2 + 0.5cap)`), and `%` for relative
   font-size. Grep `[0-9.]+em\b` over hand-written `<style>`/arbitrary values before
   "done" — must be empty.

## Design stance

Dark-first, layered, restrained. Hairline borders over shadows, one accent, tabular data,
weight/size restraint over bold-everything — color is a deliberate pluck, never default
decoration. Applies everywhere.

- **One identity, ten seeds**: emerald `#1AC973` is the identity (focus rings, active
  nav, seed pad 7 — the fallback for an out-of-range seed). Decorative color on
  controls goes through the seed rack (pads 1–10, hand-tuned in complementary pairs, one
  rack per mode); the *default* unseeded control is a quiet surface — color is always a
  deliberate pluck, never noise. Text on a pad is **derived hue-tinted ink, never pure
  `#000`/`#fff`, never a free prop** — tunable via the `--derive-*` knobs, hand-designable
  per pad via `--seed-N-ink` (see CONVENTIONS "Seeds vs states").
- **Borders before shadows**: 1px `--edge` hairline on every surface; shadows only for
  things that float (popovers, drawers, toasts).
- **Three radii**: `--radius-control` (6px) for buttons/inputs/chips, `--radius-surface`
  (10px) for cards/panels, `--radius-mark` (3px) for small selection marks (checkbox
  box — control radius reads blobby at ~16px). Nothing else.
- **Pill/circle is NEVER the preferred/default shape.** Slightly rounded corners are
  fine, but they must read technical — never whimsical or cartoonish. Full circles and
  pills are deliberate, opt-in exceptions (`edges="pill"` where it earns its keep: avatar
  overlap stacks, chips inside tag-input boxes, an e-commerce cart counter — plus the
  status dot, the one circle by definition); EVERY component defaults to square-ish (mark
  or control radius per its scale). A small mark rendered as a literal circle is a design
  bug.
- **Typography hierarchy**: faint uppercase mono for metadata/labels, `tabular-nums` for
  data numerals, weight/size restraint over bold-everything.
- **One motion curve**: `150ms cubic-bezier(0.2, 0, 0, 1)` for all interactions.

Theming: primitives + semantic tokens live in theme CSS files (CSS custom properties);
swapping a theme file restyles everything. UnoCSS theme keys map utilities onto the
variables.

## Architecture

- **shadcn-style CLI**: components are copied into the consuming project, not imported
  from a package. `prt init` / `prt add <Component>` / `prt list`.
- **Base / composite / recipe split** with automatic internal dependency resolution via
  a JSON registry. Recipes are opinionated composed blocks that carry the visual identity.
- **Component anatomy**: `PrtComponent.vue` + `variants.ts` (CVA) + `types.ts` +
  `index.ts`, lowercase directory names.
- **No Storybook.** Visual verification happens in a plain Vue test app with demo pages.

## Tech stack

- **Runtime/package manager**: Bun (use `bun x`)
- **Framework target**: Vue 3 (framework-agnostic components; Nuxt-compatible, no Nuxt
  imports)
- **Styling**: UnoCSS + CVA
- **Icons**: unplugin-icons with Lucide (`i-lucide-*`)
- **CLI**: TypeScript, built with `bun run build`
- **Type checking**: TypeScript 7 native preview (`tsgo`) — `bun run typecheck` (strict +
  verbatimModuleSyntax). Scope is every pure-TS surface (scripts, cli/src, template `.ts`
  files — Vue-free by convention) per the root `tsconfig.json`; `.vue` SFC internals are
  out of scope (vue-tsc territory, not adopted). `types/vue-shim.d.ts` resolves the `.vue`
  re-exports in template index.ts files. No emit anywhere — Bun runs TS directly, Vite
  builds the demo.

## Comment style

**`*`-prefixed wrapped lines inside `/** */` blocks are forbidden.** Never write:

```ts
/**
 * Does a thing — scans the directory and
 * validates the output before emitting.
 */
```

For essay-length non-obvious context (architecture notes, design rationale), use `/* */` without `*` prefixes:

```ts
/*
Does a thing — scans the directory and
validates the output before emitting.
*/
```

For most long comment content prefer `//` lines — each line is independently toggleable. `//` is always preferred for one-liners, including interface prop docs in `types.ts`. `/** */` is never used for one-liners. In every other case: compact, maximally unintrusive comments; code should be self-explanatory. Long blocky comments are only justified for non-obvious context, future work, TODOs, or design notes.

## Normative rules

**[CONVENTIONS.md](./CONVENTIONS.md) is the authoritative MUST/NEVER document** for
component anatomy, styling rules, props vocabulary, and verification. Forms: validation
is Standard-Schema-attached at the form layer (`useForm`/`PrtForm`); inputs stay dumb and
never `inject()` form/field context — see CONVENTIONS "Forms".

`templates/` is the single source of truth; the registry is generated, never hand-edited.
