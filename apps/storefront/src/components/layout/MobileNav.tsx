'use client'

// ─────────────────────────────────────────────────────────────────────────────
// MobileNav Drawer Component
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'

interface MobileNavProps {
  categories: Array<{ title: string; href: string; desc: string }>
  onClose: () => void
}

export function MobileNav({ categories, onClose }: MobileNavProps) {
  return (
    <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1]">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="flex items-center justify-center size-8 rounded bg-[#111827] text-white font-extrabold text-base">
              ▲
            </span>
            <span className="text-lg font-extrabold text-[#111827]">
              Peak<span className="text-[#F97316]">Gear</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#64748B] hover:text-[#111827] rounded-lg"
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <nav className="mt-6 flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-3 mb-2">
            Danh mục dã ngoại
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={onClose}
              className="flex flex-col px-3 py-2.5 rounded-lg text-[#111827] hover:bg-[#F8FAFC] transition-colors"
            >
              <span className="text-base font-bold">{cat.title}</span>
              <span className="text-xs text-[#64748B]">{cat.desc}</span>
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-[#CBD5E1] space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-3 mb-2">
              Chính sách khách hàng
            </p>
            <Link
              href="/policies/dieu-kien-giao-dich-chung"
              onClick={onClose}
              className="block px-3 py-2 text-xs text-[#64748B] hover:text-[#111827]"
            >
              Điều kiện giao dịch chung
            </Link>
            <Link
              href="/policies/van-chuyen-giao-nhan-kiem-hang"
              onClick={onClose}
              className="block px-3 py-2 text-xs text-[#64748B] hover:text-[#111827]"
            >
              Vận chuyển &amp; Kiểm hàng
            </Link>
            <Link
              href="/policies/doi-tra-hoan-tien"
              onClick={onClose}
              className="block px-3 py-2 text-xs text-[#64748B] hover:text-[#111827]"
            >
              Đổi trả trong 30 ngày
            </Link>
            <Link
              href="/policies/bao-ve-thong-tin-ca-nhan"
              onClick={onClose}
              className="block px-3 py-2 text-xs text-[#64748B] hover:text-[#111827]"
            >
              Bảo vệ thông tin cá nhân
            </Link>
            <Link
              href="/policies/phuong-thuc-thanh-toan"
              onClick={onClose}
              className="block px-3 py-2 text-xs text-[#64748B] hover:text-[#111827]"
            >
              Phương thức thanh toán
            </Link>
          </div>
        </nav>

        <div className="pt-4 border-t border-[#CBD5E1] text-xs text-[#64748B]">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F8FAFC] text-[#111827] font-bold mb-3 border border-[#CBD5E1]"
          >
            <span>Tài khoản &amp; Giỏ hàng</span>
            <span>→</span>
          </Link>
          <p>Hotline hỗ trợ: <strong className="text-[#111827]">[Chờ PO cập nhật]</strong></p>
          <p className="mt-0.5">08:00 – 21:00 hàng ngày</p>
        </div>
      </div>
    </div>
  )
}
