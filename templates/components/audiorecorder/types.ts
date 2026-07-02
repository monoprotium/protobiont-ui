import type { PrtSeed } from '../_shared/types'

export type PrtRecorderState =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'paused'
  | 'stopped'

// D13 reason codes — the consumer renders the message, the kit ships none
export type PrtRecorderError = 'permission-denied' | 'no-device' | 'unsupported'

export interface PrtAudioRecorderMeta {
  // the ACTUAL Blob mime type (trusted, not the requested one)
  mimeType: string
  // file extension DERIVED from the Blob type — never '.mp3' (MediaRecorder makes no MP3)
  extension: string
  // recorded length in seconds
  duration: number
}

export interface PrtAudioRecorderProps {
  // seconds; auto-stop at the limit
  maxDuration?: number
  // the `audio` value passed to getUserMedia — default `true` (browser
  // defaults: autoGainControl / echoCancellation / noiseSuppression on). Pass a
  // MediaTrackConstraints object for control, e.g.
  // `{ autoGainControl: false, noiseSuppression: false }` for flatter capture,
  // or `{ deviceId }` to pick a mic.
  constraints?: MediaTrackConstraints | boolean
  // opt-in live level meter (raw AnalyserNode → canvas → rAF); default off
  meter?: boolean
  // review the take in a player before saving; default true
  playback?: boolean
  // slim single-row form for embedding in a composer/toolbar; default false
  compact?: boolean
  // show a built-in download/export button (saves the blob with its real ext)
  downloadable?: boolean
  // download filename stem (extension is derived from the Blob type); default 'recording'
  downloadName?: string
  // decoration: tints controls + meter
  seed?: PrtSeed
  // button aria-labels (D13 defaults)
  recordLabel?: string
  pauseLabel?: string
  resumeLabel?: string
  stopLabel?: string
  saveLabel?: string
  eraseLabel?: string
  exportLabel?: string
  // layout-only additions
  class?: string
}
