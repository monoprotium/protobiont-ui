import type { PrtEdges } from '../_shared/types'

export interface PrtMegaMenuLink {
  label: string
  href: string
  // icon class string, e.g. 'i-lucide-box'
  icon?: string
  // optional second line under the label, ink-muted
  description?: string
}

export interface PrtMegaMenuGroup {
  // faint uppercase mono group heading
  label?: string
  links: PrtMegaMenuLink[]
}

export interface PrtMegaMenuItem {
  id: string
  label: string
  // plain nav link — an item with `href` and no `groups` renders as a bare <a>, no panel
  href?: string
  // panel content for the common case; the `#panel-{id}` slot overrides it
  groups?: PrtMegaMenuGroup[]
}

export interface PrtMegaMenuProps {
  items: PrtMegaMenuItem[]
  // 'hover' (default): panels open on trigger hover after `openDelay` and
  // close after `closeDelay` once the pointer leaves the bar+panel region.
  // Clicking a trigger always toggles too (declarative popovertarget) —
  // 'click' mode simply skips the hover machinery.
  trigger?: 'hover' | 'click'
  /** hover mode: ms before a panel opens on trigger hover */
  openDelay?: number
  /** hover mode: ms before the open panel closes after leaving bar+panel */
  closeDelay?: number
  /** trigger row alignment in the bar */
  align?: 'start' | 'center' | 'end'
  // panel link hover: 'text' (default) — muted ink brightens, no bar;
  // 'bar' — the surface-3 row highlight
  linkHover?: 'text' | 'bar'
  edges?: PrtEdges
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
