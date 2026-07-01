<!--
  PrtBreadcrumb
  Trail nav. Last item is ALWAYS the current page (aria-current, ink,
  never a link — even with an href); prior items link when href is
  given, otherwise render as muted text. The separator is its own list
  item (aria-hidden), never glued to the link node — multi-line trails
  wrap cleanly that way.
  No truncation logic — recorded non-goal; long trails wrap.
  Links are plain <a>; SPA routing rides a consumer wrapper if ever
  needed (no emit — links are links).
  Slot contract:
    separator — replaces the house `/` glyph
-->
<template>
  <nav :aria-label="label" :class="cx('w-full', props.class)">
    <ol :class="breadcrumbListVariants({ size })">
      <template v-for="(item, i) in items" :key="i">
        <li v-if="i > 0" aria-hidden="true" :class="breadcrumbSeparatorClass">
          <slot name="separator">/</slot>
        </li>
        <li class="min-w-0">
          <a
            v-if="item.href && i < items.length - 1"
            :href="item.href"
            :class="breadcrumbLinkClass"
          >{{ item.label }}</a>
          <span
            v-else
            :aria-current="i === items.length - 1 ? 'page' : undefined"
            :class="i === items.length - 1 ? breadcrumbCurrentClass : breadcrumbTextClass"
          >{{ item.label }}</span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtBreadcrumbProps } from './types'
import {
  breadcrumbCurrentClass,
  breadcrumbLinkClass,
  breadcrumbListVariants,
  breadcrumbSeparatorClass,
  breadcrumbTextClass,
} from './variants'

const props = withDefaults(defineProps<PrtBreadcrumbProps>(), {
  size: 'base',
  label: 'Breadcrumb',
  class: '',
})
</script>
