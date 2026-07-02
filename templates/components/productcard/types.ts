import type { PrtSeed } from '../_shared/types'

export interface PrtProduct {
  id: string | number
  title: string
  description?: string
  // PRE-FORMATTED by the app — the kit never owns locale/currency.
  // Any number/currency formatting inside the component is a design violation.
  price: string
  image?: string
  rating?: number
}

export interface PrtProductCardProps {
  product: PrtProduct
  // accent on the action button via the rack
  seed?: PrtSeed
  // CONTROLLED-only: the card holds no internal favorite state — wire
  // `:favorite` + `@update:favorite` (v-model:favorite) or leave both off.
  favorite?: boolean
  // the one boolean that earns its keep — hides the overlay heart
  showFavorite?: boolean
  // optional v-model; internal state (default 1) when unset
  quantity?: number
  // the add-to-cart button's accessible label — used as the aria-label since the button is a compact cart icon
  cartLabel?: string
  // the add-to-cart icon class (compact; a text label wraps and breaks narrow cards)
  cartIcon?: string
  // the favorite button's aria-label
  favoriteLabel?: string
  // layout-only additions (margin/width) — appearance goes through variants
  class?: string
}
