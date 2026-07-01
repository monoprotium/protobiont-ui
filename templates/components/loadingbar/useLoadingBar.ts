import { readonly, ref } from 'vue'

// Loading-bar machinery — rides the component dir (house pattern, same as
// useToast). Module-scope state: copy-source means a per-app singleton by
// construction. The consumer mounts ONE <PrtLoadingBar /> (root, fixed top
// by default); useLoadingBar() anywhere.
//
// The behavior IS the point: simulated progress, the
// nprogress lineage — start() trickles toward ~90% with shrinking steps
// (the impression of significant work), finish() snaps to 100% and fades,
// error() completes in danger. NEVER a looping sweep/beam — a bar that
// ping-pongs signals nothing.
const progress = ref(0)
const visible = ref(false)
const failed = ref(false)

// a bar stalled at ~90 with no finish() reads broken — after this gap it
// beams to the end on its own (the floppy-era arc: grind, then leap)
const AUTO_FINISH_MS = 10000

let trickleTimer: ReturnType<typeof setInterval> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let autoFinishTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (trickleTimer) clearInterval(trickleTimer)
  trickleTimer = null
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = null
  if (autoFinishTimer) clearTimeout(autoFinishTimer)
  autoFinishTimer = null
}

function start() {
  clearTimers()
  failed.value = false
  visible.value = true
  progress.value = 8
  // shrinking increments, asymptote ~90 — completes only via finish()/
  // error() or the auto-finish rescue below
  trickleTimer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.max(0.4, (90 - progress.value) * 0.06)
    }
  }, 250)
  autoFinishTimer = setTimeout(() => complete(false), AUTO_FINISH_MS)
}

// manual mode for real progress (uploads etc.)
function set(value: number) {
  clearTimers()
  visible.value = true
  progress.value = Math.min(100, Math.max(0, value))
}

function complete(asError: boolean) {
  clearTimers()
  failed.value = asError
  visible.value = true
  progress.value = 100
  hideTimer = setTimeout(() => {
    visible.value = false
    progress.value = 0
    failed.value = false
  }, 600)
}

export function useLoadingBar() {
  return {
    progress: readonly(progress),
    visible: readonly(visible),
    failed: readonly(failed),
    start,
    set,
    finish: () => complete(false),
    error: () => complete(true),
  }
}
