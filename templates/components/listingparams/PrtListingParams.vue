<!--
  PrtListingParams
  The spec sheet: drop product specs / entity attributes in and they
  look right — name/value rows on a real <dl> (<dt>/<dd> per row).
  Numeric values get the mono/tabular technical register automatically.
  Slot contract:
    value — { param, index } — per-row value override (chips, links,
            badges live here; this REPLACES any rich-value prop API)
-->
<template>
  <dl :class="cx(listingParamsRootVariants({ variant }), props.class)">
    <div
      v-for="(param, index) in params"
      :key="param.name"
      :class="listingParamsRowVariants({ variant, size })"
    >
      <dt :class="listingParamsNameVariants({ size })">{{ param.name }}</dt>
      <dd :class="listingParamsValueVariants({ size, mono: typeof param.value === 'number' })">
        <slot name="value" :param="param" :index="index">{{ param.value }}</slot>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { cx } from '../_shared/cx'
import type { PrtListingParamsProps } from './types'
import {
  listingParamsNameVariants,
  listingParamsRootVariants,
  listingParamsRowVariants,
  listingParamsValueVariants,
} from './variants'

const props = withDefaults(defineProps<PrtListingParamsProps>(), {
  variant: 'zebra',
  size: 'base',
  class: '',
})
</script>
