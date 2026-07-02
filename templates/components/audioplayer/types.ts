import type { PrtSeed } from '../_shared/types'

export interface PrtAudioPlayerProps {
  // audio source — always a prop, never a hardcoded sample
  src: string
  // display + Media Session metadata
  title?: string
  artist?: string
  // Media Session artwork + optional cover
  artwork?: string
  // attempt autoplay (browser policy may block until interaction)
  autoplay?: boolean
  loop?: boolean
  // opt-in Web-Audio waveform (raw AnalyserNode → canvas → rAF); default off
  waveform?: boolean
  // single slim control row (web-player bottom bar) — no title block / waveform
  compact?: boolean
  // no container chrome (border/bg/padding) — embed inside another surface (e.g. recorder review)
  bare?: boolean
  // fallback duration (s) when source has no metadata — MediaRecorder blobs report Infinity; used for readout + seek max
  duration?: number
  // wire navigator.mediaSession (feature-detected, additive); default true
  mediaSession?: boolean
  // set 'anonymous' when the server sends CORS headers — prevents the waveform AnalyserNode from being tainted (e.g. raw.githubusercontent.com)
  crossorigin?: string
  // decoration: tints the transport + waveform
  seed?: PrtSeed
  // play-button aria-label (D13 default)
  playLabel?: string
  // pause-button aria-label (D13 default)
  pauseLabel?: string
  // mute-button aria-label (D13 default)
  muteLabel?: string
  // unmute-button aria-label (D13 default)
  unmuteLabel?: string
  // waveform seek-bar aria-label (D13 default)
  seekLabel?: string
  // show prev/next buttons (emit `prev`/`next` + wire OS media keys); player stays single-track — consumer owns playlist
  skip?: boolean
  // disable the prev button at a playlist boundary (default true)
  hasPrev?: boolean
  // disable the next button at a playlist boundary (default true)
  hasNext?: boolean
  // start playback when a skip lands a new src (default true); set false to switch without auto-playing
  playOnSkip?: boolean
  // prev-track aria-label (D13 default)
  prevLabel?: string
  // next-track aria-label (D13 default)
  nextLabel?: string
  // layout-only additions
  class?: string
}
