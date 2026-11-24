// ─────────────────────────────────────────────────────────────────────────────
// Storefront & MedusaJS v2 Decoupled Types
// ─────────────────────────────────────────────────────────────────────────────

export type StockStatus = 'instock' | 'lowstock' | 'outofstock'

export interface CategoryInfo {
  id: string
  name: string
  subCategory?: string
  type?: string
}

export interface SpecItem {
  label: string
  value: string
}

export interface ProductVariant {
  id: string
  sku: string
  title: string
  color?: string | null
  size?: string | null
  price: number
  regularPrice?: number
  stock: number
  image?: string
}

export interface VariantOptions {
  colors: string[]
  sizes: string[]
}

export interface Product {
  id: string
  sku: string
  handle: string
  slug?: string
  name: string
  title?: string
  brand: string
  category: CategoryInfo
  activity?: string
  activities: string[]
  price: number
  originalPrice?: number
  regularPrice: number
  discountPercentage: number
  onSale: boolean
  badge?: string | null
  rating?: number
  reviewCount?: number
  stock: number
  stockStatus: StockStatus
  weightGrams: number
  weightFormatted?: string
  images: string[]
  thumbnail?: string
  description: string
  shortDescription?: string
  highlights?: string[]
  specs?: Record<string, string | undefined>
  specsList?: SpecItem[]
  variantOptions?: VariantOptions
  variants?: ProductVariant[]
  source?: 'decathlon' | 'fanfan'
  tags?: string[]
}

export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  bannerImage?: string
  itemCount?: number
}

export type BundleCategoryGroup = 'pack' | 'shelter' | 'sleep' | 'cook' | 'safety'

export interface BundleComponent {
  productId: string
  name: string
  title?: string
  image: string
  thumbnail?: string
  price: number
  originalPrice?: number
  weightGrams?: number
  weightFormatted?: string
  required: boolean
  quantity: number
  categoryGroup?: BundleCategoryGroup
  groupName?: string
  alternativeProductIds?: string[]
  alternativeProducts?: Product[]
  selectedVariant?: ProductVariant | null
}

export interface Bundle {
  id: string
  handle: string
  title: string
  subtitle: string
  description: string
  useCase: string
  category?: string
  activity: 'trekking' | 'hiking' | 'camping'
  tier?: 'day_hike' | 'weekend_trek' | 'alpine_summit' | 'basecamp_comfort'
  image: string
  price: number
  bundlePrice?: number
  originalPrice: number
  savings: number
  savingsAmount?: number
  discountPercentage: number
  discountPercent?: number
  tierDiscountRate?: number
  totalWeightGrams: number
  totalWeightFormatted?: string
  isCustomizable: boolean
  isAvailable: boolean
  isPopular?: boolean
  components: BundleComponent[]
  features?: {
    pack: string
    shelter: string
    sleep: string
    cook: string
    safety: string
  }
}

export interface CartItem {
  id: string
  productId: string
  sku: string
  name: string
  title?: string
  image: string
  thumbnail?: string
  price: number
  unitPrice?: number
  quantity: number
  variantColor?: string
  variantSize?: string
  weightGrams?: number
  weightFormatted?: string
  bundleId?: string
  bundleTitle?: string
  product?: Product
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  shippingFee?: number
  total: number
  itemCount?: number
  bundleDiscount?: number
  freeShippingThreshold: number
  isFreeShipping: boolean
  amountForFreeShipping: number
  vatAmount: number
}

export type FinderQuestionType = 'single_select' | 'multi_select' | 'range' | 'number' | 'boolean' | 'info'

export interface FinderOption {
  value: string
  label: string
  description: string
  icon?: string
  tag?: string
}

export interface FinderQuestionDependsOn {
  questionId: string
  value: string | number | boolean | string[]
  operator?: 'equals' | 'in' | 'not_equals'
}

export interface FinderQuestion {
  id: string
  step: number
  eyebrow: string
  title: string
  subtitle?: string
  description: string
  type: FinderQuestionType
  required: boolean
  options?: FinderOption[]
  min?: number
  max?: number
  stepSize?: number
  unit?: string
  defaultValue?: string | number | boolean | string[]
  infoContent?: string
  dependsOn?: FinderQuestionDependsOn
}

export interface FinderRecommendedProduct {
  slotId: 'pack' | 'shelter' | 'sleep' | 'cook' | 'safety' | 'essentials' | string
  slotName: string
  product: Product
  reasons: string[]
  reasonTags?: string[]
  reasonText?: string
}

export interface FinderRecommendations {
  id?: string
  summary: {
    packVolume: string
    totalEstimatedWeightGrams: number
    totalEstimatedWeightFormatted?: string
    weatherFit: string
    rationale: string
    userChoices?: Array<{ label: string; valueText: string; questionId?: string }>
  }
  products: FinderRecommendedProduct[]
  bundles: Array<Bundle & { reasons?: string[]; reasonTags?: string[]; reasonText?: string }>
}

export interface OrderItem {
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string
}

export interface ShippingOption {
  id: string
  name: string
  description?: string
  price: number
  estimatedDelivery: string
}

export interface CheckoutTotals {
  subtotal: number
  discountTotal: number
  shippingTotal: number
  total: number
  vatAmount: number
}

export interface OrderCustomer {
  email: string
  first_name: string
  phone: string
}

export interface OrderAddress {
  first_name: string
  address_1: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
}

export interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled'
  customer: OrderCustomer
  shipping_address: OrderAddress
  items: OrderItem[]
  shipping_method: {
    name: string
    price: number
  }
  payment_method: string
  payment_status?: string
  subtotal: number
  discount_total: number
  shipping_total: number
  total: number
}
