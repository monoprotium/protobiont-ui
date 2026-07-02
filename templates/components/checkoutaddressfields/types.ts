import type { PrtOption } from '../_shared/types'

export interface CheckoutAddressValues {
  fullName?: string
  email?: string
  phone?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface CheckoutAddressLabels {
  fullName: string
  email: string
  phone: string
  phoneTip: string
  address1: string
  address2Toggle: string
  address2: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PrtCheckoutAddressFieldsProps {
  // v-model — a FLAT address object. No inject, no per-field emit.
  modelValue: CheckoutAddressValues
  // drives the autocomplete section token ('shipping '/'billing ') + the default name prefix
  mode?: 'shipping' | 'billing'
  // PrtFormField name prefix for error lookup — default = mode (e.g. 'shipping.address1')
  namePrefix?: string
  // when given, the State/Province field swaps free text for a PrtCombobox
  regionOptions?: PrtOption[]
  // when given, Country swaps free text for a PrtCombobox
  countryOptions?: PrtOption[]
  // include the email field — default true on 'shipping' (contact), false on 'billing'
  showEmail?: boolean
  // include the phone field — default true
  showPhone?: boolean
  // D13 label overrides
  labels?: Partial<CheckoutAddressLabels>
}
