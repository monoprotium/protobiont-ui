<template>
  <DemoSection title="Live — hover the bar (panels mix with plain links)" min="100%">
    <DemoItem label="data-driven groups: icons + descriptions, Docs is a bare link">
      <PrtMegaMenu
        :items="[
          {
            id: 'gear',
            label: 'Gear',
            groups: [
              { label: 'Audio', links: [
                { label: 'Interfaces', href: '#', icon: 'i-lucide-cpu', description: 'USB & thunderbolt I/O' },
                { label: 'Monitors', href: '#', icon: 'i-lucide-speaker', description: 'Nearfield reference pairs' },
                { label: 'Microphones', href: '#', icon: 'i-lucide-mic', description: 'Condenser & dynamic' },
              ]},
              { label: 'Controllers', links: [
                { label: 'Keyboards', href: '#', icon: 'i-lucide-keyboard', description: '25 to 88 keys' },
                { label: 'Pad grids', href: '#', icon: 'i-lucide-layout-grid', description: '16-pad performance units' },
              ]},
              { label: 'Software', links: [
                { label: 'Instruments', href: '#', icon: 'i-lucide-waves' },
                { label: 'Effect racks', href: '#', icon: 'i-lucide-sliders-horizontal' },
              ]},
            ],
          },
          {
            id: 'support',
            label: 'Support',
            groups: [
              { label: 'Learn', links: [
                { label: 'Guides', href: '#', icon: 'i-lucide-book-open', description: 'Setup walkthroughs' },
                { label: 'API reference', href: '#', icon: 'i-lucide-braces' },
              ]},
              { label: 'Help', links: [
                { label: 'Community', href: '#', icon: 'i-lucide-users' },
                { label: 'Contact', href: '#', icon: 'i-lucide-life-buoy' },
              ]},
            ],
          },
          { id: 'docs', label: 'Docs', href: '#' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Panel slot override — a patch browser, not a link list" min="100%">
    <DemoItem label="#panel-{id} drops arbitrary content; close() is a slot prop">
      <PrtMegaMenu :items="[
        { id: 'patches', label: 'Patches' },
        { id: 'samples', label: 'Samples', href: '#' },
      ]">
        <template #panel-patches="{ close }">
          <div class="p-4 grid grid-cols-4 gap-1">
            <button
              v-for="n in 8"
              :key="n"
              type="button"
              class="h-14 rounded-control bg-surface-3 text-xs font-mono text-ink-muted hover:bg-accent hover:text-accent-ink prt-motion-colors cursor-pointer"
              @click="close()"
            >
              PCH-{{ String(n).padStart(2, '0') }}
            </button>
          </div>
        </template>
      </PrtMegaMenu>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Click trigger" min="100%">
    <DemoItem label='trigger="click" — no hover machinery, popovertarget does it all'>
      <PrtMegaMenu
        trigger="click"
        :items="[
          {
            id: 'sections',
            label: 'Sections',
            groups: [
              { links: [
                { label: 'Campaign', href: '#', icon: 'i-lucide-map' },
                { label: 'Skirmish', href: '#', icon: 'i-lucide-swords' },
                { label: 'Replays', href: '#', icon: 'i-lucide-film' },
              ]},
              { links: [
                { label: 'Settings', href: '#', icon: 'i-lucide-settings-2' },
                { label: 'Profiles', href: '#', icon: 'i-lucide-user' },
              ]},
            ],
          },
          { id: 'news', label: 'News', href: '#' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Row-bar hover — the opt-in (text-only is the default)" min="100%">
    <DemoItem label='link-hover="bar" — the surface-3 row highlight instead of the ink change'>
      <PrtMegaMenu
        link-hover="bar"
        :items="[
          {
            id: 'library',
            label: 'Library',
            groups: [
              { label: 'Sounds', links: [
                { label: 'Presets', href: '#', description: 'Factory + user banks' },
                { label: 'Samples', href: '#', description: 'One-shots & loops' },
              ]},
              { label: 'Projects', links: [
                { label: 'Recent', href: '#' },
                { label: 'Templates', href: '#' },
              ]},
            ],
          },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Rounded edges — the opt-in (square is the default)" min="100%">
    <DemoItem label='edges="rounded" — tab tops and panel bottom round; the tooth junction stays square'>
      <PrtMegaMenu
        edges="rounded"
        :items="[
          {
            id: 'catalog',
            label: 'Catalog',
            groups: [
              { label: 'Modules', links: [
                { label: 'Oscillators', href: '#' },
                { label: 'Filters', href: '#' },
              ]},
              { label: 'Racks', links: [
                { label: 'Presets', href: '#' },
                { label: 'User racks', href: '#' },
              ]},
            ],
          },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Alignment" min="100%">
    <DemoItem label="align=&quot;end&quot; — trigger row sits at the bar's end">
      <PrtMegaMenu
        align="end"
        :items="[
          { id: 'home', label: 'Home', href: '#' },
          {
            id: 'library',
            label: 'Library',
            groups: [
              { links: [
                { label: 'Playlists', href: '#', icon: 'i-lucide-list-music' },
                { label: 'Albums', href: '#', icon: 'i-lucide-disc-3' },
              ]},
            ],
          },
        ]"
      />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
