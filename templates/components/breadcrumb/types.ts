import type { PrtSize } from '../_shared/types'

export interface PrtBreadcrumbItem {
  label: string
  // absent → plain text (a non-navigable trail segment)
  href?: string
}

export interface PrtBreadcrumbProps {
  items: PrtBreadcrumbItem[]
  size?: PrtSize
  // D13: the nav landmark label
  label?: string
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
