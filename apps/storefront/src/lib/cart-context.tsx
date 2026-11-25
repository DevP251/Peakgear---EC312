'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Cart Context & Slide-over Drawer State
// Decoupled calculations powered by storeApi.calculateCartTotals
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import type { Cart, CartItem, Product, Bundle } from '@/types/storefront'
import { storeApi } from '@/lib/api'

interface Toast {
  id: string
  text: string
}

interface CartContextType {
  cart: Cart
  items: CartItem[]
  addItem: (
    product: Product,
    quantity?: number,
    variantColor?: string,
    variantSize?: string,
    bundleId?: string,
    bundleTitle?: string,
    variantPrice?: number,
    variantSku?: string
  ) => void
  addBundle: (bundle: Bundle, quantity?: number) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toasts: Toast[]
  removeToast: (id: string) => void
}

const STORAGE_KEY = 'peakgear-next-cart-v1'

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // ignore storage access errors
    }
    setIsLoaded(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch {
        // ignore storage write errors
      }
    }
  }, [items, isLoaded])

  const addToast = useCallback((text: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, text }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const addItem = useCallback(
    (
      product: Product,
      quantity = 1,
      variantColor?: string,
      variantSize?: string,
      bundleId?: string,
      bundleTitle?: string,
      variantPrice?: number,
      variantSku?: string
    ) => {
      setItems((prev) => {
        const itemKey = `${product.id}_${variantColor || ''}_${variantSize || ''}_${bundleId || ''}`
        const existing = prev.find((it) => it.id === itemKey)
        if (existing) {
          return prev.map((it) =>
            it.id === itemKey ? { ...it, quantity: it.quantity + quantity } : it
          )
        }
        const effectivePrice = variantPrice !== undefined ? variantPrice : product.price
        return [
          ...prev,
          {
            id: itemKey,
            productId: product.id,
            sku: variantSku || product.sku,
            name: product.name || product.title || 'Sản phẩm',
            title: product.title || product.name || 'Sản phẩm',
            image: product.thumbnail || product.images[0] || '/images/placeholder.svg',
            thumbnail: product.thumbnail || product.images[0] || '/images/placeholder.svg',
            price: effectivePrice,
            unitPrice: effectivePrice,
            quantity,
            variantColor,
            variantSize,
            weightGrams: product.weightGrams,
            weightFormatted: product.weightFormatted,
            bundleId,
            bundleTitle,
            product,
          },
        ]
      })
      addToast(`Đã thêm "${product.title || product.name}" vào giỏ hàng`)
      openDrawer()
    },
    [addToast, openDrawer]
  )

  const addBundle = useCallback(
    (bundle: Bundle, quantity = 1) => {
      bundle.components.forEach((comp) => {
        setItems((prev) => {
          const itemKey = `${comp.productId}_bundle_${bundle.id}`
          const existing = prev.find((it) => it.id === itemKey)
          if (existing) {
            return prev.map((it) =>
              it.id === itemKey ? { ...it, quantity: it.quantity + comp.quantity * quantity } : it
            )
          }
          return [
            ...prev,
            {
              id: itemKey,
              productId: comp.productId,
              sku: `BUNDLE-${bundle.id}-${comp.productId}`,
              name: comp.title || comp.name,
              title: comp.title || comp.name,
              image: comp.thumbnail || comp.image || '/images/placeholder.svg',
              thumbnail: comp.thumbnail || comp.image || '/images/placeholder.svg',
              price: comp.originalPrice || comp.price,
              unitPrice: comp.originalPrice || comp.price,
              quantity: comp.quantity * quantity,
              weightGrams: comp.weightGrams,
              weightFormatted: comp.weightFormatted,
              bundleId: bundle.id,
              bundleTitle: bundle.title,
            },
          ]
        })
      })
      addToast(`Đã thêm gói "${bundle.title}" vào giỏ hàng`)
      openDrawer()
    },
    [addToast, openDrawer]
  )

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((it) => it.id !== itemId))
    } else {
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, quantity } : it))
      )
    }
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Calculate cart totals using adapter
  const cart = storeApi.calculateCartTotals(items)

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        addItem,
        addBundle,
        updateQuantity,
        removeItem,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toasts,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
