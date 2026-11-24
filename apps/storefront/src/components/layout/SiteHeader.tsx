'use client'

// ─────────────────────────────────────────────────────────────────────────────
// SiteHeader Component
// STRICT PROHIBITIONS ENFORCED:
// - NO Smart Finder in Header
// - NO Finder in Search overlay
// - NO Bundle in Global Nav for MVP
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { SearchOverlay } from './SearchOverlay'
import { MobileNav } from './MobileNav'

const NAV_CATEGORIES = [
  { title: 'Trekking', href: '/collections/trekking', desc: 'Leo núi & Băng rừng' },
  { title: 'Hiking', href: '/collections/hiking', desc: 'Đi bộ dã ngoại trong ngày' },
  { title: 'Camping', href: '/collections/camping', desc: 'Cắm trại & Dã ngoại bờ hồ' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { cart, openDrawer } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const totalItemCount = cart.items.reduce((acc, it) => acc + it.quantity, 0)

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#111827] text-white text-xs py-2 px-4 border-b border-[#374151]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <p className="font-medium truncate">
            🏔️ Miễn phí vận chuyển toàn quốc cho đơn từ <strong>500.000 đ</strong> · Đổi trả 30 ngày
          </p>
          <div className="hidden sm:flex items-center gap-4 text-[#94A3B8] text-[11px]">
            <span>Hotline: [Chờ PO cập nhật]</span>
            <span>Hàng chính hãng Decathlon &amp; Fanfan</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#CBD5E1] shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#111827] hover:text-[#F97316]"
              aria-label="Mở menu di động"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 group" aria-label="PeakGear Trang chủ">
              <span className="flex items-center justify-center size-9 rounded bg-[#111827] text-white font-extrabold text-lg group-hover:bg-[#F97316] transition-colors">
                ▲
              </span>
              <span className="text-xl font-extrabold tracking-tight text-[#111827]">
                Peak<span className="text-[#F97316]">Gear</span>
              </span>
            </Link>
          </div>

          {/* Middle: Only High-level Activity Categories (Trekking, Hiking, Camping) */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Danh mục hoạt động">
            {NAV_CATEGORIES.map((cat) => {
              const isActive = pathname.startsWith(cat.href)
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'border-[#F97316] text-[#F97316]'
                      : 'border-transparent text-[#111827] hover:text-[#F97316]'
                  }`}
                >
                  {cat.title}
                </Link>
              )
            })}
          </nav>

          {/* Right: Search, Account & Cart Icon with Badge */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs text-[#64748B] hover:border-[#111827] hover:text-[#111827] transition-all"
              aria-label="Tìm kiếm sản phẩm"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="7" r="5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m11 11 4 4" />
              </svg>
              <span className="hidden sm:inline">Tìm balo, lều, túi ngủ...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded border border-[#CBD5E1] bg-white text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Account Trigger Button */}
            <button
              type="button"
              onClick={() => setIsAccountOpen(true)}
              className="p-2 rounded-lg text-[#111827] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Tài khoản khách hàng"
              title="Tài khoản"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Cart Icon & Drawer Trigger */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2 rounded-lg text-[#111827] hover:bg-[#F8FAFC] transition-colors"
              aria-label={`Giỏ hàng có ${totalItemCount} sản phẩm`}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white tabular-nums">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <MobileNav
          categories={NAV_CATEGORIES}
          onClose={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Account Info Modal */}
      {isAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/60 backdrop-blur-xs" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#CBD5E1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-[#111827] text-white text-sm font-bold">
                  👤
                </span>
                <h3 className="text-sm font-bold text-[#111827]">Tài Khoản PeakGear</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAccountOpen(false)}
                className="text-[#64748B] hover:text-[#111827] p-1 text-sm font-bold"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <p className="text-[#64748B]">
                Hệ thống hiện đang hỗ trợ thanh toán nhanh không cần đăng nhập (Guest Checkout).
              </p>
              <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-1">
                <p className="font-semibold text-[#111827]">Trạng thái: Khách vãng lai</p>
                <p className="text-[11px] text-[#64748B]">Đơn hàng được gửi mã tra cứu qua Email &amp; SMS.</p>
              </div>
              <Link
                href="/cart"
                onClick={() => setIsAccountOpen(false)}
                className="block text-center py-2.5 px-4 rounded-xl bg-[#111827] text-white font-bold hover:bg-[#F97316] transition-colors"
              >
                Xem giỏ hàng &amp; Thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
