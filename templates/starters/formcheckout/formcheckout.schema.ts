/**
 * formcheckout — example validation schema (Valibot).
 *
 * The kit imports NO validator — this is YOUR file once copied; swap Valibot
 * for Zod v4 / regle / whatever you use. It's wired into `useForm({ schema })`
 * in the page; the field `name`s in PrtCheckoutAddressFields
 * ('shipping.address1', …) line up with these paths via toDotPath.
 *
 * Install the validator yourself: `bun add valibot`
 */
import * as v from 'valibot'

const address = v.object({
  fullName: v.pipe(v.string(), v.nonEmpty('Enter a name')),
  address1: v.pipe(v.string(), v.nonEmpty('Enter a street address')),
  address2: v.optional(v.string()),
  city: v.pipe(v.string(), v.nonEmpty('Enter a city')),
  state: v.pipe(v.string(), v.nonEmpty('Select a state / province')),
  postalCode: v.pipe(v.string(), v.nonEmpty('Enter a postal code')),
  country: v.pipe(v.string(), v.nonEmpty('Select a country')),
})

export const checkoutSchema = v.object({
  email: v.pipe(v.string(), v.email('Enter a valid email')),
  phone: v.optional(v.string()),
  shipping: address,
  method: v.picklist(['standard', 'express', 'pickup'], 'Choose a delivery method'),
  // billing is validated only when "same as shipping" is unchecked — the page
  // swaps this in dynamically, or use v.variant on a discriminator.
})

export type CheckoutValues = v.InferOutput<typeof checkoutSchema>
