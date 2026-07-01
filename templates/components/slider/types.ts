import type { ValueTaper } from '../_shared/useValueEngine'
import type { PrtSize } from '../_shared/types'

// narrowed — no pill: the thumb is a fader cap, a pill cap reads blobby
export type PrtSliderEdges = 'square' | 'rounded'

export interface PrtSliderProps {
  // number = single thumb; [number, number] = dual (range). The shape IS the contract — no `range` boolean.
  modelValue: number | [number, number]
  min?: number
  max?: number
  // value-domain quantization; arrows step by exactly this when set
  step?: number
  // enables dbl-click / Ctrl-click reset to this value
  defaultValue?: number
  // 'linear' | 'log' (min > 0) | 'db' (audio fader) | custom pair
  taper?: ValueTaper
  orientation?: 'horizontal' | 'vertical'
  // 'absolute' tracks the pointer; 'relative' accumulates deltas (DAW grab — no jump)
  interactionMode?: 'absolute' | 'relative'
  // 'jump' = hybrid (jump then drag); 'pickup' = grab nearest, no jump; 'none' = track inert
  trackClick?: 'jump' | 'pickup' | 'none'
  // px of drag for the full range in relative mode
  sensitivity?: number
  // magnetic value points (e.g. 0 dB) — drag sticks until it breaks free
  detents?: number[]
  // wheel adjusts while hovered; OFF by default (never hijack page scroll)
  wheel?: boolean
  // visual marks at these values (positioned through the taper)
  ticks?: number[]
  // live value readout next to the thumb while dragging
  readout?: boolean
  // formats the readout and aria-valuetext
  format?: (value: number) => string
  // dual-thumb crossing policy
  collision?: 'clamp' | 'push' | 'swap'
  size?: PrtSize
  edges?: PrtSliderEdges
  disabled?: boolean
  // layout-only additions (margin/width; vertical height) — appearance goes through variants
  class?: string
}
