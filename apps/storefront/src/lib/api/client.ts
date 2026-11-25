// ─────────────────────────────────────────────────────────────────────────────
// MedusaJS v2 Store API Client
// Standard prefix: /store
// Publishable Key: x-publishable-api-key
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Product,
  Collection,
  Bundle,
  FinderQuestion,
  FinderRecommendations,
  Cart,
  ShippingOption,
  CheckoutTotals,
} from '@/types/storefront'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_test_peakgear_storefront'

async function medusaFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${MEDUSA_BACKEND_URL}/store${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    'x-publishable-api-key': PUBLISHABLE_API_KEY,
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Medusa API Error [${res.status}] ${endpoint}: ${errorBody}`)
  }
  return res.json()
}

export const medusaClient = {
  // Standard Medusa v2 Store endpoints
  async getProducts(params?: Record<string, string>): Promise<{ products: Product[]; count: number }> {
    const search = params ? `?${new URLSearchParams(params).toString()}` : ''
    return medusaFetch<{ products: Product[]; count: number }>(`/products${search}`)
  },

  async getProductByHandle(handle: string): Promise<{ product: Product }> {
    return medusaFetch<{ product: Product }>(`/products?handle=${encodeURIComponent(handle)}`)
  },

  async getCollections(): Promise<{ collections: Collection[] }> {
    return medusaFetch<{ collections: Collection[] }>('/collections')
  },

  async getCart(cartId: string): Promise<{ cart: Cart }> {
    return medusaFetch<{ cart: Cart }>(`/carts/${cartId}`)
  },

  async createCart(): Promise<{ cart: Cart }> {
    return medusaFetch<{ cart: Cart }>('/carts', { method: 'POST' })
  },

  // 5 Proposed Custom Endpoints (Section 15.1 of Specification)
  async getFinderConfig(activity = 'outdoor'): Promise<FinderQuestion[]> {
    return medusaFetch<FinderQuestion[]>(`/gear-finder/config?activity=${encodeURIComponent(activity)}`)
  },

  async submitFinderAnswers(answers: Record<string, unknown>): Promise<FinderRecommendations> {
    return medusaFetch<FinderRecommendations>('/gear-finder/recommendations', {
      method: 'POST',
      body: JSON.stringify(answers),
    })
  },

  async getFinderRecommendationsById(id: string): Promise<FinderRecommendations> {
    return medusaFetch<FinderRecommendations>(`/gear-finder/recommendations/${encodeURIComponent(id)}`)
  },

  async getBundleByHandle(handle: string): Promise<Bundle> {
    return medusaFetch<Bundle>(`/bundles/${encodeURIComponent(handle)}`)
  },

  async previewBundleCustomization(bundleId: string, selectedComponentIds: string[]): Promise<Bundle> {
    return medusaFetch<Bundle>(`/bundles/${encodeURIComponent(bundleId)}/preview`, {
      method: 'POST',
      body: JSON.stringify({ components: selectedComponentIds }),
    })
  },

  async addBundleToCart(cartId: string, bundleId: string, selectedComponentIds: string[], quantity = 1): Promise<Cart> {
    return medusaFetch<Cart>(`/carts/${encodeURIComponent(cartId)}/bundles`, {
      method: 'POST',
      body: JSON.stringify({ bundleId, components: selectedComponentIds, quantity }),
    })
  },

  async getShippingOptions(cartId: string): Promise<ShippingOption[]> {
    return medusaFetch<ShippingOption[]>(`/shipping-options?cart_id=${encodeURIComponent(cartId)}`)
  },

  async calculateCheckoutTotals(cartId: string, shippingOptionId: string): Promise<CheckoutTotals> {
    return medusaFetch<CheckoutTotals>(`/carts/${encodeURIComponent(cartId)}/totals?shipping_option_id=${encodeURIComponent(shippingOptionId)}`)
  },
}
