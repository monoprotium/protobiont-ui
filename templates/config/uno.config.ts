import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineConfig, presetIcons, presetUno } from 'unocss'

// UnoCSS config — utilities map onto the CSS custom properties in tokens.css.
// No safelist, by design: every class a component emits is a literal string in
// source. If styles go missing, fix the component — never add a safelist.
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      // icons resolve from local @iconify-json/* packages — no CDN
      // a bare icon span needs its own box: outside a flex parent an
      // inline span swallows the 1.2em sizing and renders zero-size
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        // i-prt-* — house icon namespace. Drop ./icons/<name>.svg and i-prt-<name>
        // resolves at build time (no safelist, no runtime class construction). The
        // transform rewrites #fff/white → currentColor, so a mask icon tints via
        // text-* / seeds / :style; for two-tone, import the SVG ?component and use
        // currentColor + var(--prt-icon-2).
        prt: FileSystemIconLoader('./icons', (svg) =>
          svg.replace(/#fff|#ffffff|white/gi, 'currentColor'),
        ),
      },
    }),
  ],

  theme: {
    colors: {
      surface: {
        0: 'var(--surface-0)',
        1: 'var(--surface-1)',
        2: 'var(--surface-2)',
        3: 'var(--surface-3)',
      },
      ink: {
        DEFAULT: 'var(--ink)',
        muted: 'var(--ink-muted)',
        faint: 'var(--ink-faint)',
      },
      accent: {
        DEFAULT: 'var(--accent)',
        ink: 'var(--accent-ink)',
      },
      danger: {
        DEFAULT: 'var(--danger)',
        ink: 'var(--danger-ink)',
      },
      warning: {
        DEFAULT: 'var(--warning)',
        ink: 'var(--warning-ink)',
      },
      info: {
        DEFAULT: 'var(--info)',
        ink: 'var(--info-ink)',
      },
      edge: {
        DEFAULT: 'var(--edge)',
        strong: 'var(--edge-strong)',
      },
      wash: 'var(--wash)',
      // categorical palette — data-viz/tags only, never on controls
      cat: {
        teal: 'var(--p-cat-teal)',
        purple: 'var(--p-cat-purple)',
        magenta: 'var(--p-cat-magenta)',
      },
    },
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
    borderRadius: {
      control: 'var(--radius-control)',
      surface: 'var(--radius-surface)',
      mark: 'var(--radius-mark)',
    },
    boxShadow: {
      raise: 'var(--shadow-raise)',
      float: 'var(--shadow-float)',
      overlay: 'var(--shadow-overlay)',
    },
  },

  shortcuts: {
    // the one motion curve — use this, never ad-hoc durations
    'prt-motion':
      'transition-all duration-[var(--motion-duration)] ease-[var(--motion-ease)]',
    'prt-motion-colors':
      'transition-colors duration-[var(--motion-duration)] ease-[var(--motion-ease)]',
    // the one focus ring
    'prt-ring':
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
  },

  content: {
    pipeline: {
      include: ['**/*.{vue,ts,tsx,html}'],
    },
  },
})
