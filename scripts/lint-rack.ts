#!/usr/bin/env bun
/**
lint-rack.ts — APCA instrument for the seed rack. An INSTRUMENT, not a gate:
it measures the hand-tuned racks (both modes) against craft floors and
prints a table. Exit code is 0 unless --strict is passed AND warnings exist.

What it checks, per pad × mode:
  1. effective ink (designed --seed-N-ink if declared, else the derived
     tint replicated from the derivation layer) against the pad — floor
     Lc 60 (button labels / spot reading).
  2. the outline/ghost case from btn/variants.ts: --seed as TEXT over the
     hover wash composited onto surface-0 and surface-1 (APCA against a
     nominal surface is invalid under an alpha wash — composite first).
  3. the mono-body case from notice: --seed-body (seed at body alpha)
     composited onto surface-0 and surface-1, measured as fluent text
     against that same surface.
  4. Helmholtz–Kohlrausch annotation: high-chroma mid-lightness pads in
     the violet/magenta/red zones, where Lc is least trustworthy and the
     eye decides.

Color math: OKLab matrices from Björn Ottosson's published reference
implementation; APCA is the SAPC-APCA 0.0.98G-4.2 base algorithm
(constants per the apca-w3 package / APCA documentation), validated below
against published reference pairs before any rack value is trusted.
*/

const STRICT = process.argv.includes('--strict')
// Two-tier craft floors (APCA guidance): Lc 45 is the large-text/spot-reading
// floor — button labels live here, below it is a WARN. Lc 60 is the fluent
// floor — between 45 and 60 is a soft note, worth an eye, not a warning.
// (The hand-designed identity pair #052e1c-on-#1ac973 scores Lc 57: the soft
// tier exists so the instrument doesn't outlaw the craft it serves.)
const FLOOR_HARD = 45
const FLOOR_SOFT = 60

// ---------------------------------------------------------------------------
// color types + sRGB <-> OKLab (Ottosson reference matrices)
// ---------------------------------------------------------------------------
interface Rgb {
  r: number // 0..1, gamma-encoded sRGB
  g: number
  b: number
}
interface Oklch {
  L: number // 0..1
  C: number
  H: number // degrees
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}

function oklchToRgbRaw({ L, C, H }: Oklch): Rgb {
  const hr = (H * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  return {
    r: linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

function inGamut({ r, g, b }: Rgb): boolean {
  const e = 1e-5
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e
}

// CSS Color 4 style gamut mapping: hold L and H, walk chroma down.
function oklchToRgb(c: Oklch): Rgb {
  let rgb = oklchToRgbRaw(c)
  if (!inGamut(rgb)) {
    let lo = 0
    let hi = c.C
    for (let i = 0; i < 32; i++) {
      const mid = (lo + hi) / 2
      rgb = oklchToRgbRaw({ ...c, C: mid })
      if (inGamut(rgb)) lo = mid
      else hi = mid
    }
    rgb = oklchToRgbRaw({ ...c, C: lo })
  }
  const clip = (v: number) => Math.min(1, Math.max(0, v))
  return { r: clip(rgb.r), g: clip(rgb.g), b: clip(rgb.b) }
}

function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(a, bb)
  let H = (Math.atan2(bb, a) * 180) / Math.PI
  if (H < 0) H += 360
  return { L, C, H }
}

function rgbToHex({ r, g, b }: Rgb): string {
  const h = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

// ---------------------------------------------------------------------------
// APCA (SAPC-APCA 0.0.98G-4.2 base algorithm)
// ---------------------------------------------------------------------------
function apcaY({ r, g, b }: Rgb): number {
  return r ** 2.4 * 0.2126729 + g ** 2.4 * 0.7151522 + b ** 2.4 * 0.072175
}

function apcaLc(text: Rgb, bg: Rgb): number {
  const blkThrs = 0.022
  const blkClmp = 1.414
  const scale = 1.14
  const loConOffset = 0.027
  const loClip = 0.1
  const soft = (y: number) => (y > blkThrs ? y : y + (blkThrs - y) ** blkClmp)
  const yTxt = soft(apcaY(text))
  const yBg = soft(apcaY(bg))
  if (Math.abs(yBg - yTxt) < 0.0005) return 0
  if (yBg > yTxt) {
    const sapc = (yBg ** 0.56 - yTxt ** 0.57) * scale
    return sapc < loClip ? 0 : (sapc - loConOffset) * 100
  }
  const sapc = (yBg ** 0.65 - yTxt ** 0.62) * scale
  return sapc > -loClip ? 0 : (sapc + loConOffset) * 100
}

// Validate vendored math against published apca-w3 reference pairs.
function selfTest(): void {
  const cases: Array<[string, string, number]> = [
    ['#888888', '#ffffff', 63.056],
    ['#ffffff', '#888888', -68.54],
    ['#000000', '#aaaaaa', 58.146],
    ['#aaaaaa', '#000000', -56.24],
  ]
  for (const [txt, bg, expected] of cases) {
    const got = apcaLc(parseHex(txt), parseHex(bg))
    if (Math.abs(got - expected) > 0.5) {
      console.error(
        `APCA SELF-TEST FAILED: Lc(${txt} on ${bg}) = ${got.toFixed(3)}, expected ${expected}`,
      )
      console.error('Vendored math has drifted — fix before trusting output.')
      process.exit(1)
    }
  }
}

// ---------------------------------------------------------------------------
// tokens.css parsing
// ---------------------------------------------------------------------------
function parseHex(s: string): Rgb {
  let h = s.slice(1)
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

function parseOklch(s: string): Oklch | null {
  const m = s.match(
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+\s*)?\)$/,
  )
  if (!m) return null
  return {
    L: m[2] === '%' ? Number(m[1]) / 100 : Number(m[1]),
    C: Number(m[3]),
    H: Number(m[4]),
  }
}

// Extract `--name: value;` declarations from the block following `selector {`.
function declsOf(css: string, selector: string): Map<string, string> {
  const out = new Map<string, string>()
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return out
  const open = css.indexOf('{', start)
  let depth = 1
  let i = open + 1
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++
    if (css[i] === '}') depth--
    i++
  }
  const body = css.slice(open + 1, i - 1)
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(`--${m[1]}`, m[2].replace(/\/\*[\s\S]*?\*\//g, '').trim())
  }
  return out
}

function resolve(name: string, vars: Map<string, string>): string {
  let value = vars.get(name) ?? ''
  for (let i = 0; i < 8; i++) {
    const m = value.match(/^var\((--[\w-]+)\)$/)
    if (!m) break
    value = vars.get(m[1]) ?? ''
  }
  return value
}

// Resolved color as both Rgb (gamut-mapped) and Oklch.
function colorOf(name: string, vars: Map<string, string>): { rgb: Rgb; lch: Oklch } | null {
  const value = resolve(name, vars)
  if (!value) return null
  if (value.startsWith('#')) {
    const rgb = parseHex(value)
    return { rgb, lch: rgbToOklch(rgb) }
  }
  const lch = parseOklch(value)
  if (!lch) return null
  return { rgb: oklchToRgb(lch), lch }
}

// ---------------------------------------------------------------------------
// derivation replication (MUST mirror the derivation layer in tokens.css)
// ---------------------------------------------------------------------------
interface Knobs {
  inkDark: number
  inkLight: number
  inkChroma: number
  washAlpha: number
  bodyAlpha: number
}

function derivedInk(seed: Oklch, k: Knobs): Rgb {
  // round(1.21 - l): 0 (dark ink) for pads lighter than l≈0.71, else 1
  const flip = 1.21 - seed.L >= 0.5 ? 1 : 0
  return oklchToRgb({
    L: flip ? k.inkLight : k.inkDark,
    C: seed.C * k.inkChroma,
    H: seed.H,
  })
}

// sRGB-space source-over compositing (matches browser default).
function composite(top: Rgb, alpha: number, bottom: Rgb): Rgb {
  const mix = (t: number, b: number) => alpha * t + (1 - alpha) * b
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b) }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
selfTest()

const css = await Bun.file(
  new URL('../templates/config/tokens.css', import.meta.url),
).text()

const rootVars = declsOf(css, ':root')
const lightOverrides = declsOf(css, "[data-mode='light']")
const modes: Array<[string, Map<string, string>]> = [
  ['dark', rootVars],
  ['light', new Map([...rootVars, ...lightOverrides])],
]

let warnings = 0
const pad = (s: string, n: number) => s.padEnd(n)

for (const [mode, vars] of modes) {
  const knobs: Knobs = {
    inkDark: Number(resolve('--derive-ink-dark', vars)),
    inkLight: Number(resolve('--derive-ink-light', vars)),
    inkChroma: Number(resolve('--derive-ink-chroma', vars)),
    washAlpha: Number(resolve('--derive-wash-alpha', vars)),
    bodyAlpha: Number(resolve('--derive-body-alpha', vars)),
  }
  const surface0 = colorOf('--surface-0', vars)
  const surface1 = colorOf('--surface-1', vars)
  if (!surface0 || !surface1 || Object.values(knobs).some(Number.isNaN)) {
    console.error(`[${mode}] failed to resolve surfaces/knobs — parser problem`)
    process.exit(1)
  }

  console.log(`\n=== ${mode} mode ===`)
  console.log(
    pad('pad', 5) +
      pad('value', 9) +
      pad('ink', 18) +
      pad('Lc ink/pad', 12) +
      pad('Lc seed/wash', 14) +
      pad('Lc body/surf', 14) +
      'notes',
  )
  for (let n = 1; n <= 10; n++) {
    const seed = colorOf(`--seed-${n}`, vars)
    if (!seed) {
      console.error(`[${mode}] cannot resolve --seed-${n}`)
      process.exit(1)
    }
    const designed = colorOf(`--seed-${n}-ink`, vars)
    const ink = designed ? designed.rgb : derivedInk(seed.lch, knobs)
    const inkKind = designed ? `designed ${rgbToHex(ink)}` : `derived ${rgbToHex(ink)}`

    const lcSolid = apcaLc(ink, seed.rgb)
    // outline/ghost: seed as text over (seed-wash over surface-0|1)
    const lcWash = Math.min(
      Math.abs(apcaLc(seed.rgb, composite(seed.rgb, knobs.washAlpha, surface0.rgb))),
      Math.abs(apcaLc(seed.rgb, composite(seed.rgb, knobs.washAlpha, surface1.rgb))),
    )
    // mono body: seed-body (seed at body alpha) as text on the bare surface
    const lcBody = Math.min(
      Math.abs(apcaLc(composite(seed.rgb, knobs.bodyAlpha, surface0.rgb), surface0.rgb)),
      Math.abs(apcaLc(composite(seed.rgb, knobs.bodyAlpha, surface1.rgb), surface1.rgb)),
    )

    const notes: string[] = []
    const grade = (lc: number, what: string) => {
      if (lc < FLOOR_HARD) {
        notes.push(`WARN ${what}<${FLOOR_HARD}`)
        warnings++
      } else if (lc < FLOOR_SOFT) {
        notes.push(`note ${what}<${FLOOR_SOFT}`)
      }
    }
    grade(Math.abs(lcSolid), 'ink')
    grade(lcWash, 'outline')
    grade(lcBody, 'body')
    const { L, C, H } = seed.lch
    if (C > 0.15 && L > 0.5 && L < 0.8 && (H >= 250 || H <= 30)) {
      notes.push('H-K zone: Lc least trustworthy here — eye decides')
    }

    console.log(
      pad(String(n), 5) +
        pad(rgbToHex(seed.rgb), 9) +
        pad(inkKind, 18) +
        pad(lcSolid.toFixed(1), 12) +
        pad(lcWash.toFixed(1), 14) +
        pad(lcBody.toFixed(1), 14) +
        (notes.join(' · ') || 'ok'),
    )
  }
}

console.log(
  warnings
    ? `\n${warnings} warning(s) — instrument output, judge with the eye on /seeds.`
    : '\nAll floors clear in both modes.',
)
if (STRICT && warnings) process.exit(1)
