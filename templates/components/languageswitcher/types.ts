import type { PrtSize } from '../_shared/types'

export interface LanguageOption {
  // BCP-47 locale code, e.g. 'en', 'ja', 'de'
  code: string
  // the NATIVE endonym (e.g. '日本語', 'Español') — never a translated name
  label: string
  // OPT-IN flag icon class, e.g. 'i-circle-flags-es'. App-provided, ready-made
  // (an Iconify set like circle-flags — NOT a custom icon). UnoCSS presetIcons
  // is atomic: only the flag classes you actually use are inlined, never the
  // whole set. Semantically flags are COUNTRIES, not languages (research is
  // unanimous) — only sensible for region routing or language-LEARNING apps.
  // Omit it and the switcher stays endonym-only.
  flag?: string
}

export interface PrtLanguageSwitcherProps {
  // v-model — the current locale code (app-owned state)
  modelValue: string
  // the app provides these; the kit bakes in NO locale data, NO i18n dep
  options: LanguageOption[]
  // 'menu' (default) | 'segmented' (2–5 short endonyms) | 'buttons' (2)
  presentation?: 'menu' | 'segmented' | 'buttons'
  // group/trigger aria-label — default 'Language'
  ariaLabel?: string
  // show a globe on the menu trigger — default true. Superseded by the current
  // option's `flag` when one is provided (region/learning use).
  showGlobe?: boolean
  // FLAG-ONLY minimalist: hide the endonym TEXT, show only the flag (the
  // endonym stays the accessible name). Needs `flag` on the options; falls back
  // to the endonym where a flag is missing. Menu dropdown rows keep their text
  // (you must read names to pick).
  iconOnly?: boolean
  size?: PrtSize
}

// No RTL/dir handling — the kit does not target RTL languages (owner
// decision). Endonyms still carry translate="no" + :lang for auto-translate
// safety; writing direction is the app's concern if it ever needs it.
