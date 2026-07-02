<!--
  PrtLanguageSwitcher
  App-owned state — modelValue locale in, update:modelValue out. The kit bakes in
  no locale data and imports no i18n library (presentation here, semantics in the
  app — the same boundary as the filter/checkout layers). The app passes the
  options (native endonyms) and reacts to the emitted code.

  Endonyms always render the native name with `translate="no"` + `:lang`, so
  browser auto-translate can't corrupt them and screen-reader pronunciation
  switches. Flags are opt-in per option (`flag` = a ready-made Iconify class like
  `i-circle-flags-es`): a flag is a country, not a language, so omit it for
  ecommerce/content and provide it for region routing or a language-learning app.
  No RTL/dir handling.

  presentation:
    'menu'      (default) — a trigger (current endonym + optional globe) → a list
    'segmented' (2–5)     — short endonyms in a joined bar
    'buttons'   (2)       — a row of buttons

  Slot contract: none.  emits: update:modelValue (locale code)
-->
<template>
  <PrtSegmented
    v-if="presentation === 'segmented'"
    type="single"
    :options="segmentOptions"
    :model-value="modelValue"
    :size="size"
    :icon-only="iconOnly"
    :label="ariaLabel"
    @update:model-value="(v) => emit('update:modelValue', String(v))"
  />

  <div
    v-else-if="presentation === 'buttons'"
    role="group"
    :aria-label="ariaLabel"
    class="inline-flex gap-2"
  >
    <PrtBtn
      v-for="opt in options"
      :key="opt.code"
      :variant="opt.code === modelValue ? 'solid' : 'ghost'"
      :seed="opt.code === modelValue ? '7' : undefined"
      :size="size"
      :lang="iconOnly && opt.flag ? undefined : opt.code"
      :translate="iconOnly && opt.flag ? undefined : 'no'"
      :aria-label="iconOnly && opt.flag ? opt.label : undefined"
      :aria-pressed="opt.code === modelValue"
      @click="emit('update:modelValue', opt.code)"
    >
      <span v-if="opt.flag" :class="[opt.flag, 'h-4 w-4 shrink-0']" aria-hidden="true" />
      <span v-if="!(iconOnly && opt.flag)">{{ opt.label }}</span>
    </PrtBtn>
  </div>

  <PrtMenu v-else :items="menuItems" @select="(v) => emit('update:modelValue', String(v))">
    <template #default="{ props: triggerProps }">
      <button
        type="button"
        v-bind="triggerProps"
        :aria-label="iconOnly && currentFlag ? currentLabel : ariaLabel"
        :class="languageTriggerClass"
      >
        <span v-if="currentFlag" :class="[currentFlag, 'h-4 w-4 shrink-0']" aria-hidden="true" />
        <span v-else-if="showGlobe" class="i-lucide-globe shrink-0 text-ink-faint" aria-hidden="true" />
        <span
          v-if="!(iconOnly && currentFlag)"
          :lang="modelValue"
          translate="no"
          class="min-w-0 truncate"
        >{{ currentLabel }}</span>
        <span class="i-lucide-chevron-down shrink-0 text-ink-faint" aria-hidden="true" />
      </button>
    </template>
  </PrtMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PrtOption } from '../_shared/types'
import PrtBtn from '../btn/PrtBtn.vue'
import PrtMenu from '../menu/PrtMenu.vue'
import type { PrtMenuItem } from '../menu/types'
import PrtSegmented from '../segmented/PrtSegmented.vue'
import type { PrtLanguageSwitcherProps } from './types'
import { languageTriggerClass } from './variants'

const props = withDefaults(defineProps<PrtLanguageSwitcherProps>(), {
  presentation: 'menu',
  ariaLabel: 'Language',
  showGlobe: true,
  iconOnly: false,
  size: 'base',
})

const emit = defineEmits<{
  'update:modelValue': [code: string]
}>()

// flags (when provided) ride the existing `icon` slot of every presentation —
// segment, menu row, button — so it's one mechanism, not per-presentation code.
const segmentOptions = computed<PrtOption[]>(() =>
  props.options.map((o) => ({ value: o.code, label: o.label, icon: o.flag })),
)

// the menu items carry `lang` → the row gets translate="no" + :lang (PrtMenu)
const menuItems = computed<PrtMenuItem[]>(() =>
  props.options.map((o) => ({ value: o.code, label: o.label, lang: o.code, icon: o.flag })),
)

const currentOption = computed(() => props.options.find((o) => o.code === props.modelValue))
const currentLabel = computed(() => currentOption.value?.label ?? props.modelValue)
// the trigger shows the current option's flag (if any) in place of the globe
const currentFlag = computed(() => currentOption.value?.flag)
</script>
