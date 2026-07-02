import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import '../../templates/config/tokens.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

// register every template component globally so DemoItem's runtime-compiled
// snippets can use any of them without per-demo wiring
const components = import.meta.glob('../../templates/components/*/Prt*.vue', {
  eager: true,
}) as Record<string, { default: { name?: string } }>
for (const [path, mod] of Object.entries(components)) {
  const name = path.split('/').pop()?.replace('.vue', '')
  if (name) app.component(name, mod.default)
}

app.use(router).mount('#app')
