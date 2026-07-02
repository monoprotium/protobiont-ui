export type PrtSkeletonShape = 'line' | 'block' | 'circle'

export interface PrtSkeletonProps {
  shape?: PrtSkeletonShape
  // layout-only additions (width/height/margin) — a skeleton's dimensions ARE layout
  class?: string
}
