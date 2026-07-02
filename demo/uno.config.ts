import { mergeConfigs } from 'unocss'
import base from '../templates/config/uno.config'

// Single source of truth: the template uno config, extended so the extractor
// also scans the templates themselves (they live outside the demo root).
export default mergeConfigs([
  base,
  {
    content: {
      filesystem: ['../templates/components/**/*.{vue,ts}'],
    },
  },
])
