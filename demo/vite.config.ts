import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { demoSource } from './src/plugins/vite-plugin-demo-source'

// The demo consumes templates/ DIRECTLY — no copy step. Editing a template
// component hot-reloads the gallery: the demo is a live view of the source of truth.
export default defineConfig({
  // demoSource is enforce:'pre' — it injects each slot-model DemoItem's source
  // as a :code prop before plugin-vue compiles the SFC.
  plugins: [demoSource(), vue(), UnoCSS()],
  resolve: {
    alias: {
      // no esm-bundler alias: demos are slot markup compiled at build time, so
      // the runtime template compiler is no longer needed in the bundle.
      '@ui': resolve(__dirname, '../templates/components'),
      '@demo': resolve(__dirname, 'src/shell'),
      // Vite's dep scanner regex-extracts import-looking LINES from .vue
      // scripts — including ones inside display-only snippet STRINGS
      // (FormsView's valibot example imports '@/components/ui/form';
      // SplashView's snippet imports '@/composables/useSplashDismiss').
      // Resolving the consumer-app aliases to the real source keeps the
      // scan green; nothing real ever imports these paths in the demo.
      '@/components/ui': resolve(__dirname, '../templates/components'),
      '@/composables': resolve(__dirname, '../templates/starters/splashscreen'),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..')],
    },
  },
})
