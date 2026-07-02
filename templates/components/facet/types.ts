export interface PrtFacetProps {
  label: string
  // Active-selection count — the APP passes it (it owns the filter
  // state); the facet owns NO value, it is pure chrome.
  count?: number
  collapsible?: boolean
  // uncontrolled open state (the facet owns its own disclosure)
  defaultOpen?: boolean
  // shows the clear affordance when count > 0; `clear` is an emit the app handles
  clearable?: boolean
  // D13
  clearLabel?: string
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
