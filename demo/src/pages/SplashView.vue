<template>
  <DemoLayout>
    <div class="px-8 py-8 max-w-5xl">
      <div class="mb-8 border-l-2 border-accent pl-4">
        <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
          Splashscreen
        </h1>
        <p class="text-xs font-mono text-ink-faint mt-1">
          starter · two modes — first-paint splash (A) + in-app transition mask (B)
        </p>
      </div>

      <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
        <p>
          A copied-source <strong class="text-ink">starter</strong>, not a component:
          the splash kills the blank-flash of a freshly-loaded copied app.
          <strong class="text-ink">Mode A</strong> paints a static
          <code class="font-mono text-xs">#prt-splash</code> node on the very first
          layout pass (the shared <code class="font-mono text-xs">_boot</code>
          snippet, a sibling of <code class="font-mono text-xs">#app</code>, zero JS)
          and <code class="font-mono text-xs">useSplashDismiss</code> fades + removes
          it once fonts/images/a committed frame are ready.
          <strong class="text-ink">Mode B</strong> is
          <code class="font-mono text-xs">PrtTransitionMask</code> — an in-app
          overlay for the wait during a heavy navigation. Click a
          <span class="text-ink-muted">source →</span> label to load its code on the right.
        </p>
      </div>

      <!-- MODE A — interactive, contained to a frame -->
      <DemoSection title="Mode A — first-paint splash, replayed in a frame" min="22rem">
        <template #default>
          <div class="flex flex-col gap-3 min-w-0">
            <div class="relative h-56 rounded-surface border border-edge bg-surface-1 overflow-hidden">
              <!-- the real, painted app the splash sits in front of (NOT a
                   loading skeleton — the splash hides a ready app, not a half-built one) -->
              <div class="p-5 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="i-prt-protobiont h-5 w-5 text-accent" />
                  <span class="text-sm font-light tracking-[0.15em] uppercase text-ink">Protobiont</span>
                </div>
                <p class="text-sm text-ink-muted mt-1 max-w-sm">
                  The app is painted and interactive. The splash held in front of
                  this until fonts and the first frame were ready, then dismissed.
                </p>
              </div>
              <!-- the first-paint splash, contained to the frame (not the viewport) -->
              <Transition name="prt-boot">
                <div
                  v-if="booting"
                  class="absolute inset-0 grid place-items-center bg-surface-0"
                  role="status"
                  aria-busy="true"
                >
                  <svg class="prt-splash-mark text-accent" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect class="prt-splash-track" x="9" y="9" width="30" height="30" stroke="currentColor" stroke-width="1.5" />
                    <rect class="prt-splash-run" x="9" y="9" width="30" height="30" stroke="currentColor" stroke-width="1.5" />
                    <rect class="prt-splash-core" x="19" y="19" width="10" height="10" fill="currentColor" />
                  </svg>
                </div>
              </Transition>
            </div>
            <button
              type="button"
              class="self-start inline-flex items-center gap-2 rounded-control bg-surface-2 border border-edge px-4 py-2 text-sm text-ink hover:bg-surface-3 prt-motion-colors prt-ring"
              @click="boot"
            >
              <span class="i-prt-protobiont h-4 w-4 text-accent" />
              Replay first-paint
            </button>
            <button
              type="button"
              class="self-start text-xs font-mono cursor-pointer select-none prt-motion-colors prt-ring rounded-control"
              :class="isActive(snippetA) ? 'text-accent' : 'text-ink-faint hover:text-ink-muted'"
              @click="show(snippetA)"
            >
              useSplashDismiss + _boot snippet source →
            </button>
          </div>
        </template>
      </DemoSection>

      <!-- MODE B — the real full-viewport mask -->
      <DemoSection title="Mode B — the in-app transition mask (live)" min="22rem">
        <template #default>
          <div class="flex flex-col gap-3">
            <button
              type="button"
              class="self-start inline-flex items-center gap-2 rounded-control bg-surface-2 border border-edge px-4 py-2 text-sm text-ink hover:bg-surface-3 prt-motion-colors prt-ring"
              @click="replay"
            >
              <span class="i-prt-protobiont h-4 w-4 text-accent" />
              Replay the mask
            </button>
            <p class="text-xs font-mono text-ink-faint">
              covers the viewport, holds a minimum, then fades out — JS-driven
              opacity (no allow-discrete; FF Bug 1882408). reduced-motion → instant.
            </p>
            <button
              type="button"
              class="self-start text-xs font-mono cursor-pointer select-none prt-motion-colors prt-ring rounded-control"
              :class="isActive(snippetB) ? 'text-accent' : 'text-ink-faint hover:text-ink-muted'"
              @click="show(snippetB)"
            >
              PrtTransitionMask source →
            </button>
          </div>
        </template>
      </DemoSection>

      <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
        <p>
          Same-document View Transitions smooth the FINAL cross-fade (wire them in
          the router) — but they freeze the DOM during the callback, so they can't
          replace the mask, which covers the actual wait. a11y:
          <code class="font-mono text-xs">role=status</code> +
          <code class="font-mono text-xs">aria-busy</code>, no focus trap (passive).
        </p>
      </div>

      <!-- the real Mode B mask, driven by the replay button.
           the brand mark IS the loader — a square segment marching the perimeter +
           a pulsing core; no separate generic spinner (empty #indicator slot). -->
      <PrtTransitionMask v-model="masking" :delay-ms="0" :min-ms="1400">
        <template #brand>
          <svg
            class="prt-splash-mark text-accent"
            width="56"
            height="56"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <rect class="prt-splash-track" x="9" y="9" width="30" height="30" stroke="currentColor" stroke-width="1.5" />
            <rect class="prt-splash-run" x="9" y="9" width="30" height="30" stroke="currentColor" stroke-width="1.5" />
            <rect class="prt-splash-core" x="19" y="19" width="10" height="10" fill="currentColor" />
          </svg>
        </template>
        <!-- a hidden (display:none) node, NOT an empty slot: Vue renders the
             fallback <PrtLoader/> when a slot is empty, so this kills the spinner
             without adding a flex item or gap. -->
        <template #indicator><span class="hidden" /></template>
      </PrtTransitionMask>
    </div>
  </DemoLayout>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DemoSection from '@demo/DemoSection.vue'
import DemoLayout from '@demo/DemoLayout.vue'
import { activeSnippet, showSnippet, showSnippetIfEmpty, type ActiveSnippet } from '@demo/sourceStore'
import PrtTransitionMask from '../../../templates/starters/splashscreen/PrtTransitionMask.vue'

// ── Mode B: the real full-viewport mask ──
const masking = ref(false)
function replay() {
  masking.value = true
  // a real navigation would flip this off in router.afterEach; here we fake the wait
  setTimeout(() => {
    masking.value = false
  }, 1600)
}

// ── Mode A: a contained first-paint replay (splash → readiness → dismiss) ──
const booting = ref(false)
let bootTimer: ReturnType<typeof setTimeout> | undefined
function boot() {
  clearTimeout(bootTimer)
  booting.value = true
  // stand-in for fonts.ready → decode → committed frame → minMs hold
  bootTimer = setTimeout(() => {
    booting.value = false
  }, 1200)
}
onBeforeUnmount(() => clearTimeout(bootTimer))

// ── source panel: code lives on the right, never in the body ──
// Mode A is composable/script wiring — shown raw (no <template> scaffold)
const modeACode = `// App.vue — <script setup>
import { useSplashDismiss } from '@/composables/useSplashDismiss'

// dismisses #prt-splash once fonts -> image decode -> a committed
// frame are ready, after a minMs hold. compositor-only opacity fade.
useSplashDismiss({ minMs: 600 })

/* index.html — painted on the first layout pass, a sibling of #app
   (zero JS, so it shows before the bundle even parses):

   <div id="prt-splash"><!-- brand mark + inline CSS --></div>  */`

const modeBCode = `<PrtTransitionMask v-model="loading" :min-ms="1400">
  <template #brand>
    <span class="i-prt-protobiont text-5xl text-accent" />
  </template>
</PrtTransitionMask>`

const snippetA: ActiveSnippet = { title: 'Mode A — useSplashDismiss', code: modeACode, imports: [], raw: true, lang: 'ts' }
const snippetB: ActiveSnippet = { title: 'Mode B — PrtTransitionMask', code: modeBCode, imports: ['PrtTransitionMask'] }

function show(s: ActiveSnippet) {
  showSnippet(s)
}
function isActive(s: ActiveSnippet) {
  return activeSnippet.value?.code === s.code
}

// DemoLayout clears the panel onBeforeMount; seed Mode A so it isn't empty
onMounted(() => showSnippetIfEmpty(snippetA))
</script>

<style scoped>
/* The brand mark doubles as the loader — square + technical, never a blobby
   spinner. A bright segment marches the 30×30 perimeter (length 120) over a dim
   full-outline track, while the inner core breathes. Pure compositor work. */
.prt-splash-track {
  opacity: 0.16;
}
.prt-splash-run {
  stroke-dasharray: 28 92;
  animation: prt-splash-run 1.4s linear infinite;
}
.prt-splash-core {
  transform-box: fill-box;
  transform-origin: center;
  animation: prt-splash-core 1.4s ease-in-out infinite;
}
@keyframes prt-splash-run {
  to {
    stroke-dashoffset: -120;
  }
}
@keyframes prt-splash-core {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.78);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mode A dismiss: first paint is instant (no enter), the dismiss fades — the
   same compositor-only opacity move the real starter uses. */
.prt-boot-leave-active {
  transition: opacity 320ms cubic-bezier(0.2, 0, 0, 1);
}
.prt-boot-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .prt-splash-run,
  .prt-splash-core {
    animation: none;
  }
  .prt-splash-run {
    stroke-dasharray: none;
  }
  .prt-splash-core {
    opacity: 1;
    transform: none;
  }
  .prt-boot-leave-active {
    transition: none;
  }
}
</style>
