<template>
  <DemoSection title="Menu — the default (trigger shows the current endonym + a globe)" min="22rem">
    <DemoItem label="v-model is the locale code — pick one and the trigger updates">
      <div class="flex flex-col items-start gap-2">
        <PrtLanguageSwitcher
          v-model="locale"
          :options="[
            { code: 'en', label: 'English' },
            { code: 'es', label: 'Español' },
            { code: 'ja', label: '日本語' },
            { code: 'de', label: 'Deutsch' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">locale = {{ locale }}</span>
      </div>
    </DemoItem>
    <DemoItem label='without the globe (show-globe="false")'>
      <PrtLanguageSwitcher
        v-model="locale"
        :show-globe="false"
        :options="[
          { code: 'en', label: 'English' },
          { code: 'es', label: 'Español' },
          { code: 'ja', label: '日本語' },
          { code: 'de', label: 'Deutsch' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Segmented — 2–5 short endonyms in a joined bar" min="24rem">
    <DemoItem label='presentation="segmented"'>
      <div class="flex flex-col items-start gap-2">
        <PrtLanguageSwitcher
          v-model="locale"
          presentation="segmented"
          :options="[
            { code: 'en', label: 'English' },
            { code: 'es', label: 'Español' },
            { code: 'ja', label: '日本語' },
            { code: 'de', label: 'Deutsch' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">locale = {{ locale }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Buttons — a small row (2 languages)" min="20rem">
    <DemoItem label='presentation="buttons"'>
      <PrtLanguageSwitcher
        v-model="locale"
        presentation="buttons"
        :options="[
          { code: 'en', label: 'English' },
          { code: 'es', label: 'Español' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Flags — opt-in (region routing / language-learning apps)" min="24rem">
    <DemoItem label="flag = a ready-made Iconify class (i-circle-flags-*) per option — menu">
      <div class="flex flex-col items-start gap-2">
        <PrtLanguageSwitcher
          v-model="locale"
          :options="[
            { code: 'en', label: 'English', flag: 'i-circle-flags-gb' },
            { code: 'es', label: 'Español', flag: 'i-circle-flags-es' },
            { code: 'ja', label: '日本語', flag: 'i-circle-flags-jp' },
            { code: 'de', label: 'Deutsch', flag: 'i-circle-flags-de' },
            { code: 'fr', label: 'Français', flag: 'i-circle-flags-fr' },
          ]"
        />
        <span class="text-xs font-mono text-ink-faint">locale = {{ locale }}</span>
      </div>
    </DemoItem>
    <DemoItem label="same flags, segmented — they ride the existing icon slot">
      <PrtLanguageSwitcher
        v-model="locale"
        presentation="segmented"
        :options="[
          { code: 'en', label: 'English', flag: 'i-circle-flags-gb' },
          { code: 'es', label: 'Español', flag: 'i-circle-flags-es' },
          { code: 'ja', label: '日本語', flag: 'i-circle-flags-jp' },
        ]"
      />
    </DemoItem>
    <DemoItem label="icon-only — FLAG ONLY, no text (endonym stays the accessible name) — menu">
      <PrtLanguageSwitcher
        v-model="locale"
        icon-only
        :options="[
          { code: 'en', label: 'English', flag: 'i-circle-flags-gb' },
          { code: 'es', label: 'Español', flag: 'i-circle-flags-es' },
          { code: 'ja', label: '日本語', flag: 'i-circle-flags-jp' },
          { code: 'de', label: 'Deutsch', flag: 'i-circle-flags-de' },
          { code: 'fr', label: 'Français', flag: 'i-circle-flags-fr' },
        ]"
      />
    </DemoItem>
    <DemoItem label="icon-only flags — segmented and buttons (a pure flag row)">
      <div class="flex flex-col items-start gap-3">
        <PrtLanguageSwitcher
          v-model="locale"
          presentation="segmented"
          icon-only
          :options="[
            { code: 'en', label: 'English', flag: 'i-circle-flags-gb' },
            { code: 'es', label: 'Español', flag: 'i-circle-flags-es' },
            { code: 'ja', label: '日本語', flag: 'i-circle-flags-jp' },
          ]"
        />
        <PrtLanguageSwitcher
          v-model="locale"
          presentation="buttons"
          icon-only
          :options="[
            { code: 'en', label: 'English', flag: 'i-circle-flags-gb' },
            { code: 'es', label: 'Español', flag: 'i-circle-flags-es' },
          ]"
        />
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const locale = ref('en')
</script>
