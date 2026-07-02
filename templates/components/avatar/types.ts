import type { PrtEdges, PrtSeed, PrtSize } from '../_shared/types'

// avatar outgrows the shared scale: xl/2xl are profile-page sizes (this is not a table-row-only component)
export type PrtAvatarSize = PrtSize | 'xl' | '2xl'

export interface PrtAvatarProps {
  src?: string
  alt?: string
  // fallback initials, ~2 chars (D13: prop, no hardcoded default text)
  initials?: string
  // fallback icon when no initials
  icon?: string
  // decoration for the fallback pad — stable per user works nicely
  seed?: PrtSeed
  size?: PrtAvatarSize
  // default 'rounded' (squircle — technical); 'pill' (circle) is the opt-in exception, never the default
  edges?: PrtEdges
  // layout-only additions
  class?: string
}
