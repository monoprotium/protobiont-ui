import type { PrtSeed } from '../_shared/types'

export interface PrtCountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface PrtCountdownUnitLabels {
  days: string
  hours: string
  minutes: string
  seconds: string
}

export interface PrtCountdownProps {
  // target instant — ISO string, epoch ms, or Date (date-countdown mode)
  to?: string | number | Date
  // countdown a DURATION in seconds instead of to a fixed instant — the
  // interactive timer mode (start/pause/reset); default render is a mm:ss clock
  duration?: number
  // show built-in start/pause/reset buttons (duration mode only)
  controls?: boolean
  // duration mode only: start the timer on mount instead of waiting for a click.
  // (date `to` mode is always live and ignores this.) NOTE: this is a Boolean
  // prop, so an omitted value is `false`, never undefined — see PrtCountdown.vue.
  autostart?: boolean
  // default-render unit labels (D13 — English defaults, overridable)
  unitLabels?: PrtCountdownUnitLabels
  // control button labels (D13 defaults)
  startLabel?: string
  pauseLabel?: string
  resumeLabel?: string
  resetLabel?: string
  // decoration
  seed?: PrtSeed
  // layout-only additions
  class?: string
}
