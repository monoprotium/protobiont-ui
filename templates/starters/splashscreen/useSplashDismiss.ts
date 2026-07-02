import { onMounted } from 'vue'

/**
 * Splashscreen — Mode A (first-paint).
 *
 * The static `#prt-splash` node is painted by the shared boot snippet
 * (starters/_boot, a SIBLING of #app) on the first layout pass — zero JS, no
 * Vue involvement. This composable's ONLY job is to wait for genuine readiness
 * (fonts → image decode → a committed frame), respect a minimum display, then
 * fade + REMOVE the node.
 *
 * Removal is JS-driven (opacity → transitionend → .remove()), NOT a pure-CSS
 * `allow-discrete` display animation — that path is buggy in Firefox
 * (Bug 1882408): the display snaps. JS removal is identical in both engines.
 */
export interface SplashOptions {
  /** minimum time the brand is shown (ms) — default 600 */
  minMs?: number
  /** hard ceiling: force-dismiss if readiness never resolves — default 10000 */
  failsafeMs?: number
  /** called once with the dismiss reason ('ready' | 'failsafe-timeout') */
  onDismiss?: (reason: 'ready' | 'failsafe-timeout') => void
}

export function useSplashDismiss(opts: SplashOptions = {}) {
  const minMs = opts.minMs ?? 600
  const failsafeMs = opts.failsafeMs ?? 10000
  let done = false

  function removeNode(node: HTMLElement, reason: 'ready' | 'failsafe-timeout') {
    if (done) return
    done = true
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      node.remove()
      opts.onDismiss?.(reason)
      return
    }
    // compositor-only fade, then remove via JS (no allow-discrete — FF bug)
    node.style.opacity = '0'
    let removed = false
    const finish = () => {
      if (removed) return
      removed = true
      node.remove()
    }
    node.addEventListener('transitionend', finish, { once: true })
    // fallback in case transitionend never fires (e.g. opacity already 0)
    setTimeout(finish, 400)
    opts.onDismiss?.(reason)
  }

  // readiness chain — a missing font/image must NOT block forever
  async function waitForPaint() {
    if (document.fonts?.ready) await document.fonts.ready
    const imgs = [
      ...document.querySelectorAll<HTMLImageElement>('[data-splash-ready]'),
    ]
    await Promise.all(imgs.map((i) => i.decode().catch(() => {})))
    // double-rAF = a frame actually committed
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  }

  function dismiss() {
    const node = document.getElementById('prt-splash')
    if (node) removeNode(node, 'ready')
  }
  function forceDismiss(reason: 'ready' | 'failsafe-timeout' = 'failsafe-timeout') {
    const node = document.getElementById('prt-splash')
    if (node) removeNode(node, reason)
  }

  onMounted(() => {
    const node = document.getElementById('prt-splash')
    if (!node) return // nothing painted (mode-init-only install) — no-op
    const shownAt = performance.now()
    const failsafe = setTimeout(() => forceDismiss('failsafe-timeout'), failsafeMs)
    waitForPaint().then(async () => {
      const elapsed = performance.now() - shownAt
      if (elapsed < minMs) {
        await new Promise((r) => setTimeout(r, minMs - elapsed))
      }
      clearTimeout(failsafe)
      dismiss()
    })
  })

  return { dismiss, forceDismiss }
}
