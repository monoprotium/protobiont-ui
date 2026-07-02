# Protobiont UI

Vue 3 component library with a `prt` CLI. Copy-source (like in shadcn) — components
are copied into the repo, not installed from a package.

## Usage

```sh
prt init          # write the tokens, config, and components directory
prt add PrtBtn    # copy a component in, with its dependencies
prt list          # list what's available
```

## Features

- **Three tiers** — base, composite, and recipe components.
- **Seed color** — decorative color is a `seed` prop, pads 1–10 from the token
  rack in `tokens.css`.
- **Dark-first, token-driven theming** — swap a theme file and everything
  restyles.

## Stack

Vue 3 (Nuxt-compatible) · UnoCSS + CVA · Lucide icons ·
TypeScript. `templates/` is the source of truth.

## Demo

A plain Vue app that renders every component from `templates/` 

```sh
bun install
bun --cwd demo dev
```


