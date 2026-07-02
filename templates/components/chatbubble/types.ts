import type { PrtSeed } from '../_shared/types'

export type PrtChatBubbleSide = 'sent' | 'received'

export interface PrtChatBubbleProps {
  // drives alignment + theming; default 'received'
  side?: PrtChatBubbleSide
  // the arrow tail; default ON (opt-out, not opt-in)
  tail?: boolean
  // this message is a CONTINUATION — another from the same sender follows it.
  // Suppresses the tail and tightens spacing. Derive it from ADJACENCY in your
  // v-model loop (next item same sender), NEVER a hand-set per-bubble flag.
  grouped?: boolean
  // decoration: sent default = seed/accent bubble; received = surface
  seed?: PrtSeed
  // layout-only additions
  class?: string
}
