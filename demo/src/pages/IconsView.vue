<template>
  <DemoLayout>
    <div class="px-8 py-8 max-w-5xl">
    <div class="mb-8 border-l-2 border-accent pl-4">
      <h1 class="text-2xl font-light tracking-[0.15em] uppercase text-ink">
        Icons
      </h1>
      <p class="text-xs font-mono text-ink-faint mt-1">
        reference · the i-prt-* house collection — no component, build-time, no safelist
      </p>
    </div>

    <div class="mb-10 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        Icons are NOT a component. Drop an SVG into
        <code class="font-mono text-xs">./icons/&lt;name&gt;.svg</code> and
        <code class="font-mono text-xs">i-prt-&lt;name&gt;</code> resolves at
        <strong class="text-ink">build time</strong> through Iconify's
        FileSystemIconLoader — a literal class, never constructed, never
        safelisted. The loader rewrites <code class="font-mono text-xs">#fff</code>
        → <code class="font-mono text-xs">currentColor</code>, so each icon is a
        mask that tints live from <code class="font-mono text-xs">text-*</code>,
        a seed, or any <code class="font-mono text-xs">color</code> — one glyph,
        every theme.
      </p>
      <p class="text-ink-faint text-xs font-mono">
        the four below are real files in demo/icons/ — protobiont · seed ·
        terminal · stack. add one the same way; no rebuild ceremony, no registry.
      </p>
    </div>

    <DemoSection title="The collection — one glyph, drawn as currentColor" min="14rem">
      <DemoItem :label="collection[0].label" :code="collection[0].code">
        <span class="i-prt-protobiont text-3xl text-ink" />
      </DemoItem>
      <DemoItem :label="collection[1].label" :code="collection[1].code">
        <span class="i-prt-seed text-3xl text-ink" />
      </DemoItem>
      <DemoItem :label="collection[2].label" :code="collection[2].code">
        <span class="i-prt-terminal text-3xl text-ink" />
      </DemoItem>
      <DemoItem :label="collection[3].label" :code="collection[3].code">
        <span class="i-prt-stack text-3xl text-ink" />
      </DemoItem>
    </DemoSection>

    <DemoSection title="Tinting — the mask takes any colour" min="16rem">
      <DemoItem :label="tint[0].label" :code="tint[0].code">
        <span class="i-prt-seed text-3xl text-accent" />
      </DemoItem>
      <DemoItem :label="tint[1].label" :code="tint[1].code">
        <span class="i-prt-terminal text-3xl text-ink-faint" />
      </DemoItem>
      <DemoItem :label="tint[2].label" :code="tint[2].code">
        <span class="i-prt-stack text-3xl" :style="{ color: 'var(--seed-5)' }" />
      </DemoItem>
      <DemoItem :label="tint[3].label" :code="tint[3].code">
        <p class="text-2xl text-accent inline-flex items-center gap-2">
          <span class="i-prt-protobiont" /> Protobiont
        </p>
      </DemoItem>
    </DemoSection>

    <DemoSection title="Sizing — font-relative, so it tracks the text" min="16rem">
      <DemoItem :label="sizing[0].label" :code="sizing[0].code">
        <div class="flex items-center gap-4 text-ink">
          <span class="i-prt-protobiont text-base" />
          <span class="i-prt-protobiont text-xl" />
          <span class="i-prt-protobiont text-3xl" />
        </div>
      </DemoItem>
      <DemoItem :label="sizing[1].label" :code="sizing[1].code">
        <span class="i-prt-seed h-8 w-8 text-ink" />
      </DemoItem>
    </DemoSection>

    <div class="mt-2 max-w-2xl flex flex-col gap-3 text-sm text-ink-muted">
      <p>
        For per-PART live colour (two-tone), don't use the mask form — import the
        SVG with <code class="font-mono text-xs">?component</code> and have its
        parts read <code class="font-mono text-xs">currentColor</code> +
        <code class="font-mono text-xs">var(--prt-icon-2)</code>. At scale, compile
        <code class="font-mono text-xs">./icons</code> into a private
        <code class="font-mono text-xs">@prt/icons</code> set and load it as a
        collection — same class names, zero filesystem reads at build.
      </p>
    </div>
    </div>
  </DemoLayout>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'
import DemoLayout from '@demo/DemoLayout.vue'

const collection = [
  {
    label: 'i-prt-protobiont',
    code: `<span class="i-prt-protobiont text-3xl text-ink" />`,
  },
  {
    label: 'i-prt-seed',
    code: `<span class="i-prt-seed text-3xl text-ink" />`,
  },
  {
    label: 'i-prt-terminal',
    code: `<span class="i-prt-terminal text-3xl text-ink" />`,
  },
  {
    label: 'i-prt-stack',
    code: `<span class="i-prt-stack text-3xl text-ink" />`,
  },
]

const tint = [
  {
    label: 'text-accent — the identity emerald',
    code: `<span class="i-prt-seed text-3xl text-accent" />`,
  },
  {
    label: 'text-ink-faint — recede into metadata',
    code: `<span class="i-prt-terminal text-3xl text-ink-faint" />`,
  },
  {
    label: 'a seed pad — :style color',
    code: `<span class="i-prt-stack text-3xl" :style="{ color: 'var(--seed-5)' }" />`,
  },
  {
    label: 'inherits — sits in coloured text',
    code: `<p class="text-2xl text-accent inline-flex items-center gap-2">
  <span class="i-prt-protobiont" /> Protobiont
</p>`,
  },
]

const sizing = [
  {
    label: 'text-base · text-xl · text-3xl',
    code: `<div class="flex items-center gap-4 text-ink">
  <span class="i-prt-protobiont text-base" />
  <span class="i-prt-protobiont text-xl" />
  <span class="i-prt-protobiont text-3xl" />
</div>`,
  },
  {
    label: 'explicit box — h-8 w-8',
    code: `<span class="i-prt-seed h-8 w-8 text-ink" />`,
  },
]
</script>
