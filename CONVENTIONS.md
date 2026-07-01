# CONVENTIONS — Protobiont UI

Normative. MUST/NEVER means exactly that.

## Component anatomy

Every component lives in `templates/components/{base|composite}/<lowername>/`:

```
btn/
├── PrtBtn.vue        # the component (the only framework-specific file)
├── variants.ts       # CVA tables — pure TS, no Vue imports
├── types.ts          # props/emits types — pure TS, no Vue imports
├── index.ts          # exports: component + types + variants
├── component.json    # registry metadata (description, deps)
└── btn.demo.vue      # prerendered showcase (never installed by CLI)
```

`component.json`:

```json
{
  "name": "PrtBtn",
  "description": "Button with variant × seed × size matrix",
  "internalDependencies": [],
  "externalDependencies": ["class-variance-authority"]
}
```

## Styling — MUST / NEVER

- Every utility class is a complete literal string in source. Color rides CSS variables
  (`bg-[var(--seed,var(--surface-2))]`), never per-color class rows.
- NEVER construct classes at runtime — no `` `bg-${x}` ``, no `.replace()`, no string math
  on class names. **There is no safelist and never will be.**
- Semantic tokens only: `surface-0..3`, `ink`/`ink-muted`/`ink-faint`, `accent`/`accent-ink`,
  `danger`/`warning`/`info` (each with its `*-ink` pair for text on the intent surface),
  `edge`/`edge-strong`, `wash`, `scrim` (modal `::backdrop`), `rounded-control`/`-surface`/`-mark`,
  `shadow-raise`/`-float`, and the seed vars (`--seed`, `--seed-ink`, `--seed-hover`,
  `--seed-wash`, `--seed-body`) via arbitrary values.
- NEVER raw palette (`neutral-*`, `gray-*`, `blue-*`, hex) or `dark:`/`light:` classes.
  Modes live in token values only.
- **NEVER the `em` unit, anywhere** — it compounds down the cascade. Use `rem`/`px` for
  fixed lengths, `cap`/`lh`/`ex`/`ch` for font-tracking values (they scale with the type,
  no compounding), `%` for relative font-size. `rem` is fine. (Some UnoCSS `tracking-*`
  utilities emit `em`; don't rely on them where the value matters, and never write a literal
  `em`.)

## Seeds vs states

- **Decoration is seeds.** `seed?: PrtSeed` picks pad 1–10 from the rack in `tokens.css`;
  the component binds `data-seed` and its classes consume the derived set. Pads carry no
  intent — `seed="8"` is crimson because you want crimson, not because something is "dangerous".
- **States are semantic.** `error` on inputs, success/warning/danger on notices/toasts use
  their own tokens (`--danger`/`--warning`/`--info`). Bootstrap intent names
  (`primary`/`secondary`/…) are **banned as a design API** (see daisyUI #1174 — semantic
  tokens can't predict their canvas).
- **Derive once.** ink/hover/wash/body are derived in the `[data-seed]` block in `tokens.css`.
  A component doing its own `oklch(from …)` math is as wrong as a hardcoded hex. Derived ink
  is hue-tinted, never pure `#000`/`#fff`.
- **Derivation knobs are theme surface:** `--derive-ink-dark`/`-light`/`-chroma`,
  `--derive-hover-lift`, `--derive-wash-alpha`, `--derive-body-alpha` — any theme/wrapper/devtools
  session can re-declare them. Light mode sets `--derive-hover-lift` below 1 (hover darkens).
  Pure-binary ink is three knob declarations away.
- **Designed inks override per pad.** `--seed-N-ink` (anywhere in the cascade) gives pad N a
  hand-tuned ink; pads without one keep the derived tint, so a half-defined theme still works.
  Default: only pad 7 (`--seed-7-ink: var(--accent-ink)`). In CSS, never write `var(--seed-N-ink)`
  without a fallback. A theme re-declaring a designed pad MUST also re-declare `--seed-N-ink`
  (or reset it with `--seed-N-ink: initial`), or the stale ink lands on the new pad (dark-on-dark
  text).
- **Rack layout:** pad N and N+5 are near-complements; 1/2 neutral; 6/7 the identity pair.
  Themes reload the rack in pairs, per mode (light rack: same hues, shifted lightness). Derived
  ink polarity is mode-stable — pad 9 (amber) takes dark ink in both modes. Designed inks may
  flip: pad 7 is deep-emerald-on-emerald in dark, white-on-emerald in light.
- **`bun run lint:rack`** measures every pad × ink × mode with APCA (alpha washes composited
  first) — an instrument, not a gate. WARN under Lc 45, note under Lc 60. The eye decides on `/seeds`.
- **Cascade derivation:** components never reset `--seed` when the prop is unset, so descendants
  take their tint from a container's `data-seed` — one attribute themes a section. (Say "derive",
  not "inherit".)
- **Browser floor:** current Chrome AND current Firefox, weighted equally (incl. Chromium/Firefox
  forks — Zen, Brave, Vivaldi, Opera). Safari never dictates architecture: no WebKit polyfills, no
  JS positioning libraries. A feature is usable only if both Chrome and Firefox ship it stable (CSS
  anchor positioning — Cr 125+/Fx 147+; `popover=hint` — Cr 133+/Fx 149+); if recent Firefox lacks
  it, it's out (`interestfor`, anchored container queries). Token floor: CSS relative color
  (Baseline: cross-browser since 2024). `contrast-color()` is unused on purpose — WCAG-2-chained
  and binary, it would undo the ink tint. Don't re-add it.
- **No IDE color preview** for `seed="5"` — use the `/seeds` demo page; `tokens.css` names each pad.
- **Escape hatch:** an arbitrary value like `bg-[#ff0055]` in consumer code is fine. The constraints
  shape the default path; they don't forbid the occasional one-off.
- Motion via `prt-motion`/`prt-motion-colors`; focus via `prt-ring` (always `focus-visible`).
- `<style>` blocks only for what utilities can't express (keyframes, scrollbar pseudo-elements).
  Never `@apply`, never BEM, never layout leaking (max-width/margin centering is the consumer's).
- Runtime user-picked colors: bind a CSS variable (`class="bg-[var(--prt-c)]"` + `:style`), never
  generate classes.

## Props & API

- Shared prop types from `_shared/types.ts`: `size?: PrtSize` (`'sm'|'base'|'lg'`),
  `seed?: PrtSeed` (closed union, 1–10), `variant?` per-component, `edges?: PrtEdges`,
  `disabled?`, `loading?`, `fullWidth?`.
- NEVER an open color prop (`color?: string`, or any string-typed appearance prop). A wrong seed
  MUST be a type error.
- `v-model` via `modelValue` + `update:modelValue` only — never a parallel `change` emit. One
  `v-model` per component where possible.
- `class?: string` is for layout only (margin, width, grid placement); appearance goes through
  variants. `cx()` does no conflict resolution, on purpose.
- Icons: `i-lucide-*` class strings only. Never icon-component imports or `Component`-typed icon props.
- **Custom icons:** house namespace `i-prt-*`. It's a build-time Iconify collection, not a
  component — `prt init` scaffolds a `prt` collection (`FileSystemIconLoader('./icons', …)`) in
  `uno.config.ts` + `./icons/.gitkeep`; drop `spark.svg` → `i-prt-spark` resolves as a literal
  class (no safelist). Mask icons tint via `currentColor`/`text-*`/seeds; `?bg` icons keep fixed
  colors; for per-part color, import the SVG `?component` and use `currentColor` + `var(--prt-icon-2)`.
  No `<PrtIcon>` dispatcher (it would force `i-${name}` or a `Component` prop — both banned).
- `tag?: string` for polymorphic roots (typed `string`, never a Vue type).

## Forms

Opt-in. Ownership is fixed — crossing a row is a bug:

| layer | owns |
|---|---|
| user state | the reactive object — never wrapped, never mutated by the kit |
| `useForm()` | schema runs, dot-path error map, display gating, submit/reset |
| `PrtForm` | the `<form>` + `provide()` — requires `:form`, emits nothing |
| `PrtFormField` | anatomy, the `name`, error resolution |
| inputs | nothing |

- Bare inputs never validate. Validation attaches at the form layer via Standard Schema v1
  (types inlined in `_shared/form.ts`).
- The validator is the consumer's dependency — the kit imports none. Docs default to Valibot
  (Zod v4 shown once).
- Explicit `error`/`errorMessage` props always beat the injected error.
- Transforms apply to the submit output only — state stays what was typed.
- **Input components never `inject()` form or field context.** The field→input channel is slot
  props / attr fallthrough (`v-bind="inputProps"` on the native element). This rule — not a runtime
  guard — is what makes the injection-hijack bug impossible.
- Wrapper-rooted controls (checkbox, toggle, select, inputnumber, radiogroup):
  `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` on the native element (fieldset for
  radiogroup, trigger button for select) so `inputProps` reaches the real control.
- Generated-form markup (stable, E2E-targetable): `name` + `data-field` on the input; label `for`;
  `field-${name}` ids; error node `field-${name}-error` with `aria-describedby` pointing at it.
- Zero hardcoded user-facing strings — each is a prop with an English default.
- Never disable submit on invalid. Display gating (blur or submit reveals, fixing clears debounced)
  is the timing model; `submitting` guards double-submit.

Schema → component (generation contract; modelValue types are normative):

| schema field | component | modelValue |
|---|---|---|
| `string` | `PrtInput` / `PrtTextarea` (long) | `string` |
| `number` | `PrtInputNumber` | **`number \| null`** — empty is null, never a silent 0 |
| `boolean` (submitted) | `PrtCheckbox` | `boolean` |
| `boolean` (applies immediately) | `PrtToggle` | `boolean` |
| enum / picklist | `PrtSelect` (many) / `PrtRadioGroup` (≤ ~5) / `PrtCombobox` (searchable/huge) | `string \| number \| null` / `string \| number` / `string \| number \| null` |
| ISO date string | `PrtInput type="date"` | `string` |
| `string[]` (tags/tokens) | `PrtTagsInput` | `string[]` — new arrays, never mutation |
| array items | indexed paths (`tags.0`) + `error-pattern` on the field | — |

When a form outgrows the copied composable (wizards, field arrays, dependent async validation),
use vee-validate (v4) or regle for that form — fields and inputs still work, they only consume attrs.

## Dependencies

Components are copied into the consumer, so a component's runtime deps become theirs — declared
per-component in `component.json` `externalDependencies`, installed by `prt add`. A well-chosen
library is a fine, tracked choice; the consumer's build tree-shakes it.

- **VueUse** (`@vueuse/core`) is the default for wiring imperative browser APIs into reactivity
  (scroll, Resize/Intersection observers, pointer, `useMediaControls`, `useEventListener`). Prefer
  it over hand-rolled `addEventListener` + `onBeforeUnmount` — free SSR guards (Nuxt-compatible)
  and cleanup.
- **Native first** for what the platform does well: Popover API, `<dialog>`/`useModalDialog`, CSS
  anchor positioning, `loading="lazy"`, `line-clamp`, View Transitions. Don't wrap these.
- **Raw/custom** for opinionated primitives and 60fps hot paths where a wrapper gets in the way.
  Standing exceptions, never retrofit: `PrtSlider` + `useValueEngine` (pointer/drag math, custom
  emits); audio/visual hot paths (`AnalyserNode` → canvas → rAF); trivial one-offs
  (`navigator.clipboard.writeText()`). `PrtInfiniteScroll` stays raw — its `IntersectionObserver`
  needs `scrollMargin` (Cr 120/Fx 141) for nested scroll containers, which VueUse's
  `useIntersectionObserver` drops.
- A heavier domain dep (e.g. `embla-carousel-vue`) is fine when it's the best option — declare it;
  prefer research over reinventing a battle-tested lib.
- Adopt deps forward — don't churn working code to swap in an equivalent.
- The validator stays the consumer's dependency (see Forms).

## Portability

- `variants.ts` and `types.ts` import nothing from Vue.
- Document each component's slot contract (names + slot props) in a comment atop the `.vue` file.
- Keep `defineExpose` minimal (no clean React analog).
- Behavior lives in composables (`_shared/use*.ts`), not in templates.

## Demos

- `<name>.demo.vue` next to the component. Prerendered showcase only — static sections, no knobs,
  no reactive controls. Uses the demo shell's `DemoSection`.

## Verification (per component, before "done")

1. Renders in the demo gallery; eyeball dark + a one-click light spot-check.
2. `bun run verify:fresh` passes (CLI install in a throwaway app).
3. Invariant greps are clean:
   `grep -rE "safelist|el-[0-9]|neutral-[0-9]|gray-[0-9]|dark:|\$\{" templates/components --include="*.ts" --include="*.vue" --exclude="*.test.ts"`
   (a template literal in class context = bug; `--exclude="*.test.ts"` keeps tests from
   false-positiving on `${}` fixtures or `dark:` assertions).
