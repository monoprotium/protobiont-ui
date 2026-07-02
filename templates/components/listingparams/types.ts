import type { PrtSize } from '../_shared/types'

export interface PrtListingParam {
  name: string
  value: string | number
}

export interface PrtListingParamsProps {
  params: PrtListingParam[]
  // honest variants only — nothing else renders, nothing else is promised
  variant?: 'zebra' | 'hairline'
  size?: PrtSize
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
