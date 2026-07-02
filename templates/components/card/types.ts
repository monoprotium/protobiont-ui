export type PrtCardVariant = 'default' | 'raised' | 'outline'
export type PrtCardEdges = 'square' | 'rounded'

export interface PrtCardProps {
  variant?: PrtCardVariant
  edges?: PrtCardEdges
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
