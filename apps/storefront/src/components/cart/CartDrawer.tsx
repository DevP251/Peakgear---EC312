'use client'

// ─────────────────────────────────────────────────────────────────────────────
// CartDrawer Component
// Features: Slide-over, Freeship Progress Bar, BundleCartGroup, AOV Booster
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import type { CartItem } from '@/types/storefront'

export function CartDrawer() {
  const { cart, items, updateQuantity, removeItem, isDrawerOpen, closeDrawer, addItem } = useCart()
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleQtyChange = (itemId: string, newQty: number) => {
    if (updatingId) return
    setUpdatingId(itemId)
    updateQuantity(itemId, newQty)
    setTimeout(() => setUpdatingId(null), 300)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen, closeDrawer])

  // Group items by bundleId if applicable
  const { bundleGroups, standaloneItems } = useMemo(() => {
    const groups: Record<string, { bundleTitle: string; items: CartItem[] }> = {}
    const standalones: CartItem[] = []

    items.forEach((item) => {
      if (item.bundleId) {
        if (!groups[item.bundleId]) {
          groups[item.bundleId] = { bundleTitle: item.bundleTitle || 'Gói Bundle Trang Bị', items: [] }
        }
        groups[item.bundleId].items.push(item)
      } else {
        standalones.push(item)
      }
    })

    return { bundleGroups: Object.entries(groups), standaloneItems: standalones }
  }, [items])

  if (!isDrawerOpen) return null

  const freeshipProgress = Math.min(100, Math.round(((cart.freeShippingThreshold - cart.amountForFreeShipping) / cart.freeShippingThreshold) * 100))

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Giỏ hàng của bạn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-xs transition-opacity" onClick={closeDrawer} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#111827]">Giỏ hàng của bạn</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold text-[#111827] tabular-nums">
              {items.reduce((acc, it) => acc + it.quantity, 0)}
            </span>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="p-1.5 text-[#64748B] hover:text-[#111827] rounded-lg"
            aria-label="Đóng giỏ hàng"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Freeship Bar (CRO Standard) */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#CBD5E1]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {cart.isFreeShipping ? (
              <span className="font-bold text-[#16A34A]">
                🎉 Đơn hàng được Miễn phí vận chuyển toàn quốc!
              </span>
            ) : (
              <span className="text-[#64748B]">
                Mua thêm <strong className="text-[#111827] price-num tabular-nums">{cart.amountForFreeShipping.toLocaleString('vi-VN')} đ</strong> để được <strong className="text-[#16A34A]">Freeship</strong>
              </span>
            )}
            <span className="font-mono text-[11px] text-[#64748B]">{freeshipProgress}%</span>
          </div>
          <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                cart.isFreeShipping ? 'bg-[#16A34A]' : 'bg-[#F97316]'
              }`}
              style={{ width: `${freeshipProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#64748B] space-y-3">
              <span className="text-4xl block">🎒</span>
              <p className="font-semibold text-base text-[#111827]">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs max-w-xs mx-auto">
                Hãy khám phá các trang bị leo núi, dã ngoại hoặc bộ kit chọn sẵn từ PeakGear.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeDrawer()
                  router.push('/collections/trekking')
                }}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#111827] text-white text-xs font-bold hover:bg-[#F97316] transition-colors"
              >
                Khám phá sản phẩm ngay
              </button>
            </div>
          ) : (
            <>
              {/* Bundle Groups */}
              {bundleGroups.map(([bId, group]) => (
                <div key={bId} className="rounded-lg border-2 border-[#111827]/15 bg-[#F8FAFC] p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">📦</span>
                      <span className="text-xs font-extrabold text-[#111827]">{group.bundleTitle}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F97316]/10 text-[#F97316]">
                      Gói Combo
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {group.items.map((it) => (
                      <li key={it.id} className="flex gap-3 text-xs">
                        <Image
                          src={it.image || '/images/placeholder.svg'}
                          alt={it.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="size-12 rounded object-contain border border-[#CBD5E1] bg-white shrink-0 p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#111827] truncate">{it.name}</h4>
                          <span className="text-[11px] font-mono text-[#64748B]">SL: {it.quantity}</span>
                        </div>
                        <span className="font-bold text-[#111827] tabular-nums price-num">
                          {(it.price * it.quantity).toLocaleString('vi-VN')} đ
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Standalone Items */}
              {standaloneItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-[#CBD5E1] bg-white">
                  <Image
                    src={item.image || '/images/placeholder.svg'}
                    alt={item.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="size-16 rounded object-contain border border-[#CBD5E1] bg-[#F8FAFC] shrink-0 p-1"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#111827] line-clamp-1 leading-tight">{item.name}</h4>
                      {(item.variantColor || item.variantSize) && (
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          {[item.variantColor, item.variantSize].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded border border-[#CBD5E1]">
                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                          className="size-6 flex items-center justify-center text-xs hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                          className="size-6 flex items-center justify-center text-xs hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111827] tabular-nums price-num">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#DC2626] hover:underline text-[11px]"
                          aria-label="Xóa sản phẩm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 2 AOV Booster Accessories (Decathlon Standard) */}
              <div className="pt-4 border-t border-[#CBD5E1]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Mua kèm giá tốt cho chuyến đi
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs">
                    <div>
                      <p className="font-semibold text-[#111827]">Vớ thể thao dã ngoại kháng khuẩn</p>
                      <span className="font-bold text-[#F97316] tabular-nums">65.000 đ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: 'addon-socks',
                          sku: 'ADDON-SOCK',
                          handle: 'vo-the-thao-da-ngoai',
                          name: 'Vớ thể thao dã ngoại kháng khuẩn',
                          brand: 'Forclaz',
                          category: { id: 'apparel', name: 'Phụ kiện trang phục' },
                          activities: ['trekking', 'hiking'],
                          price: 65000,
                          regularPrice: 85000,
                          discountPercentage: 23,
                          onSale: true,
                          stock: 50,
                          stockStatus: 'instock',
                          weightGrams: 45,
                          images: ['/images/products/decathlon/placeholder.jpg'],
                          description: 'Chất liệu vi sợi thoáng khí chống phồng rộp bàn chân khi leo núi đường dài.',
                        })
                      }
                      className="px-2.5 py-1 rounded bg-[#111827] text-white font-bold text-xs hover:bg-[#F97316]"
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#CBD5E1] bg-white space-y-3">
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <dt>Tạm tính hàng hóa</dt>
                <dd className="font-mono text-[#111827] tabular-nums price-num">{cart.subtotal.toLocaleString('vi-VN')} đ</dd>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <dt>Phí vận chuyển</dt>
                <dd className="font-mono tabular-nums">
                  {cart.shipping === 0 ? <span className="text-[#16A34A] font-bold">Miễn phí</span> : `${cart.shipping.toLocaleString('vi-VN')} đ`}
                </dd>
              </div>
              <div className="flex justify-between text-[#64748B] text-[11px]">
                <dt>Thuế VAT 8% (đã bao gồm)</dt>
                <dd className="font-mono tabular-nums">{cart.vatAmount.toLocaleString('vi-VN')} đ</dd>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#111827] pt-2 border-t border-[#CBD5E1]">
                <dt>Tổng cộng</dt>
                <dd className="text-lg text-[#F97316] font-mono tabular-nums price-num">
                  {cart.total.toLocaleString('vi-VN')} đ
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex items-center justify-center w-full min-h-[48px] rounded-lg bg-[#F97316] text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              Tiến hành thanh toán →
            </Link>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="flex items-center justify-center w-full py-2 text-xs font-semibold text-[#64748B] hover:text-[#111827]"
            >
              Xem chi tiết giỏ hàng đầy đủ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
