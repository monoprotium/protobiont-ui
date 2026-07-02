<!--
  PrtCheckoutAddressFields
  A markup grouping of PrtFormField rows with the standard address-form rules
  baked in (the autocomplete table, inputmode hints, Address-Line-2 behind a
  toggle, country→region combobox). It does not inject — the hard kit rule is that
  inputs never inject() form/field context, which rules out the injection-hijack
  bug class by construction. It declares no schema: the app's Standard Schema (on a
  surrounding PrtForm) drives validation, matched by the field `name`s
  (`shipping.address1`, …), which toDotPath normalizes.

  Values flow through one v-model of a flat address object (no per-field change
  events). The field→input channel is PrtFormField's slot-props / attr-fallthrough,
  the same pattern used elsewhere.

  Slots:
    address-extra — extra rows appended to the fieldset
    country-field (scoped { inputProps }) — override the country control
  emits: update:modelValue
-->
<template>
  <fieldset class="border-0 p-0 m-0 grid gap-3" :aria-label="ariaLabel">
    <PrtFormField :name="fieldName('fullName')" :label="L.fullName">
      <template #default="{ inputProps }">
        <PrtInput
          v-bind="inputProps"
          :model-value="modelValue.fullName ?? ''"
          :autocomplete="ac.fullName"
          @update:model-value="(v) => update('fullName', String(v))"
        />
      </template>
    </PrtFormField>

    <PrtFormField v-if="showEmailResolved" :name="fieldName('email')" :label="L.email">
      <template #default="{ inputProps }">
        <PrtInput
          v-bind="inputProps"
          type="email"
          inputmode="email"
          autocomplete="email"
          :model-value="modelValue.email ?? ''"
          @update:model-value="(v) => update('email', String(v))"
        />
      </template>
    </PrtFormField>

    <PrtFormField v-if="showPhone" :name="fieldName('phone')" :label="L.phone" :helper-text="L.phoneTip">
      <template #default="{ inputProps }">
        <PrtInput
          v-bind="inputProps"
          type="tel"
          inputmode="tel"
          :autocomplete="ac.phone"
          :model-value="modelValue.phone ?? ''"
          @update:model-value="(v) => update('phone', String(v))"
        />
      </template>
    </PrtFormField>

    <PrtFormField :name="fieldName('address1')" :label="L.address1">
      <template #default="{ inputProps }">
        <PrtInput
          v-bind="inputProps"
          :autocomplete="ac.address1"
          :model-value="modelValue.address1 ?? ''"
          @update:model-value="(v) => update('address1', String(v))"
        />
      </template>
    </PrtFormField>

    <!-- Address Line 2 hidden behind a toggle (Baymard: most addresses don't need it) -->
    <button
      v-if="!address2Open && !modelValue.address2"
      type="button"
      class="justify-self-start text-xs font-medium text-accent bg-transparent prt-motion-colors hover:underline underline-offset-2"
      @click="address2Open = true"
    >
      {{ L.address2Toggle }}
    </button>
    <PrtFormField v-else :name="fieldName('address2')" :label="L.address2">
      <template #default="{ inputProps }">
        <PrtInput
          v-bind="inputProps"
          :autocomplete="ac.address2"
          :model-value="modelValue.address2 ?? ''"
          @update:model-value="(v) => update('address2', String(v))"
        />
      </template>
    </PrtFormField>

    <div class="grid gap-3 sm:grid-cols-2">
      <PrtFormField :name="fieldName('city')" :label="L.city">
        <template #default="{ inputProps }">
          <PrtInput
            v-bind="inputProps"
            :autocomplete="ac.city"
            :model-value="modelValue.city ?? ''"
            @update:model-value="(v) => update('city', String(v))"
          />
        </template>
      </PrtFormField>

      <PrtFormField :name="fieldName('postalCode')" :label="L.postalCode">
        <template #default="{ inputProps }">
          <PrtInput
            v-bind="inputProps"
            type="text"
            inputmode="numeric"
            :autocomplete="ac.postalCode"
            :model-value="modelValue.postalCode ?? ''"
            @update:model-value="(v) => update('postalCode', String(v))"
          />
        </template>
      </PrtFormField>
    </div>

    <PrtFormField :name="fieldName('state')" :label="L.state">
      <template #default="{ inputProps }">
        <PrtCombobox
          v-if="regionOptions && regionOptions.length"
          v-bind="inputProps"
          :options="regionOptions"
          :model-value="modelValue.state ?? null"
          @update:model-value="(v) => update('state', v == null ? '' : String(v))"
        />
        <PrtInput
          v-else
          v-bind="inputProps"
          :autocomplete="ac.state"
          :model-value="modelValue.state ?? ''"
          @update:model-value="(v) => update('state', String(v))"
        />
      </template>
    </PrtFormField>

    <PrtFormField :name="fieldName('country')" :label="L.country">
      <template #default="{ inputProps }">
        <slot name="country-field" :input-props="inputProps">
          <PrtCombobox
            v-if="countryOptions && countryOptions.length"
            v-bind="inputProps"
            :options="countryOptions"
            :model-value="modelValue.country ?? null"
            @update:model-value="(v) => update('country', v == null ? '' : String(v))"
          />
          <PrtInput
            v-else
            v-bind="inputProps"
            autocomplete="country-name"
            :model-value="modelValue.country ?? ''"
            @update:model-value="(v) => update('country', String(v))"
          />
        </slot>
      </template>
    </PrtFormField>

    <slot name="address-extra" />
  </fieldset>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PrtCombobox from '../combobox/PrtCombobox.vue'
import PrtFormField from '../formfield/PrtFormField.vue'
import PrtInput from '../input/PrtInput.vue'
import type { CheckoutAddressLabels, PrtCheckoutAddressFieldsProps } from './types'

const props = withDefaults(defineProps<PrtCheckoutAddressFieldsProps>(), {
  mode: 'shipping',
  showPhone: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: PrtCheckoutAddressFieldsProps['modelValue']]
}>()

const ariaLabel = computed(() => (props.mode === 'billing' ? 'Billing address' : 'Shipping address'))
// the Baymard / WHATWG autocomplete tokens, section-prefixed in SCRIPT (string
// concat, not a template literal) so the no-runtime-class grep stays clean —
// these are autocomplete ATTRIBUTE values, never class strings.
const ac = computed(() => {
  const s = props.mode === 'billing' ? 'billing ' : 'shipping '
  return {
    fullName: s + 'name',
    phone: s + 'tel',
    address1: s + 'address-line1',
    address2: s + 'address-line2',
    city: s + 'address-level2',
    state: s + 'address-level1',
    postalCode: s + 'postal-code',
  }
})
const prefix = computed(() => props.namePrefix ?? props.mode)
const showEmailResolved = computed(() => props.showEmail ?? props.mode === 'shipping')
const address2Open = ref(false)

const defaults: CheckoutAddressLabels = {
  fullName: 'Full name',
  email: 'Email',
  phone: 'Phone',
  phoneTip: 'For delivery updates',
  address1: 'Address',
  address2Toggle: '+ Add apartment, suite, etc.',
  address2: 'Apartment, suite, etc.',
  city: 'City',
  state: 'State / Province',
  postalCode: 'Postal code',
  country: 'Country',
}
const L = computed<CheckoutAddressLabels>(() => ({ ...defaults, ...props.labels }))

function fieldName(key: keyof PrtCheckoutAddressFieldsProps['modelValue']): string {
  return prefix.value + '.' + String(key)
}

function update(key: keyof PrtCheckoutAddressFieldsProps['modelValue'], value: string) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
