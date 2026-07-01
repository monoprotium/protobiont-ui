import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// Icons are class-based (`i-lucide-*`) via UnoCSS presetIcons +
// @iconify-json/lucide — no unplugin-icons, no icon components.
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
