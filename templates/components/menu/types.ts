import type { PrtEdges, PrtSize } from '../_shared/types'

export interface PrtMenuItem {
  label: string
  // emitted on select
  value: string | number
  // icon class string, e.g. 'i-lucide-trash-2'
  icon?: string
  // ink rides --danger — a true state, NOT a seed
  danger?: boolean
  disabled?: boolean
  // BCP-47 code for the label's language (e.g. a language-switcher endonym).
  // When set, the row also emits `translate="no"` so browser auto-translate
  // can't corrupt the endonym, and `:lang()`/SR pronunciation switch. Added
  // for the switcher family (additive — every other menu omits it).
  lang?: string
}

export interface PrtMenuGroup {
  // faint uppercase mono heading
  label?: string
  items: PrtMenuItem[]
}

export type PrtMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface PrtMenuProps {
  // flat or grouped — groups render with hairline separation
  items: PrtMenuItem[] | PrtMenuGroup[]
  placement?: PrtMenuPlacement
  size?: PrtSize
  edges?: PrtEdges
  disabled?: boolean
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
