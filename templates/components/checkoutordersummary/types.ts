export interface CheckoutLineItem {
  id: string
  label: string
  quantity: number
  // app-formatted price strings — the kit does ZERO money math
  unitPriceFormatted: string
  totalFormatted: string
  imageUrl?: string
  imageAlt?: string
}

export interface PrtCheckoutOrderSummaryProps {
  lineItems: CheckoutLineItem[]
  subtotalFormatted: string
  // null → renders the "calculated at next step" label
  shippingFormatted: string | null
  // null → tax row hidden until known
  taxFormatted: string | null
  // only present when a promo is applied
  discountFormatted?: string
  totalFormatted: string
  // show −/+ quantity steppers per line (emits quantityChange); default false
  showQuantityControls?: boolean
  // ── D13 labels (English defaults) ──
  title?: string
  labelSubtotal?: string
  labelShipping?: string
  labelTax?: string
  labelDiscount?: string
  labelTotal?: string
  shippingPendingText?: string
  promoToggleText?: string
  promoPlaceholder?: string
  decreaseLabel?: string
  increaseLabel?: string
}
