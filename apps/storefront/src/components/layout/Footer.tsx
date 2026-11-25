// ─────────────────────────────────────────────────────────────────────────────
// Footer Component
// Full Vietnam E-Commerce Legal Compliance (NĐ 52/2013, 85/2021 & NĐ 13/2023)
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { SITE_LEGAL, POLICIES } from '@/config/site-legal'

export function Footer() {
  return (
    <footer className="bg-[#111827] text-[#94A3B8] border-t border-[#374151]">
      {/* 3 Core Trust Signals Bar */}
      <div className="border-b border-[#374151] bg-[#1E293B]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <span className="text-2xl mt-0.5">↩️</span>
              <div>
                <h4 className="text-sm font-bold text-white">Đổi trả 30 ngày miễn phí</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">Đổi size hoặc hoàn tiền nếu không vừa ý, hỗ trợ nhận hàng tận nơi.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="text-2xl mt-0.5">🛡️</span>
              <div>
                <h4 className="text-sm font-bold text-white">Bảo hành chính hãng 12–24 tháng</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">Đảm bảo khung lều, đường may chịu lực và van khóa dã ngoại.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="text-2xl mt-0.5">⚡</span>
              <div>
                <h4 className="text-sm font-bold text-white">Giao nhanh 2h nội thành</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">Freeship đơn từ 500.000 đ, hỗ trợ kiểm hàng trước khi thanh toán.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Details */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
          {/* Col 1: Brand & Verified Company Identity */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center size-8 rounded bg-white text-[#111827] font-extrabold text-base">
                ▲
              </span>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Peak<span className="text-[#F97316]">Gear</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed max-w-sm text-[#CBD5E1]">
              Hệ thống bán lẻ trang bị thể thao và dã ngoại chuyên nghiệp. Khung sản phẩm tối ưu hiệu năng và trọng lượng cho mọi cung đường tại Việt Nam.
            </p>

            <div className="mt-6 pt-4 border-t border-[#374151] space-y-1.5 text-xs">
              <p className="text-white font-bold">{SITE_LEGAL.companyName}</p>
              <p>Mã số thuế: <strong className="text-white font-mono">{SITE_LEGAL.taxId}</strong></p>
              <p>Ngày &amp; Nơi cấp: {SITE_LEGAL.issuedDateAndPlace}</p>
              <p>Trụ sở: {SITE_LEGAL.headquartersAddress}</p>
              <p>Hotline: <strong className="text-[#F97316] font-mono">{SITE_LEGAL.hotline}</strong> ({SITE_LEGAL.operatingHours})</p>
              <p>Email: <a href={`mailto:${SITE_LEGAL.email}`} className="text-white hover:underline">{SITE_LEGAL.email}</a></p>
            </div>
          </div>

          {/* Col 2: High-level Collections */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Khám phá hoạt động</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/collections/trekking" className="hover:text-white transition-colors">
                  Trang bị Trekking &amp; Leo núi
                </Link>
              </li>
              <li>
                <Link href="/collections/hiking" className="hover:text-white transition-colors">
                  Trang bị Hiking trong ngày
                </Link>
              </li>
              <li>
                <Link href="/collections/camping" className="hover:text-white transition-colors">
                  Lều trại &amp; Dã ngoại Basecamp
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-white transition-colors">
                  Tất cả sản phẩm dã ngoại (400+)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: 5 Vietnam E-Commerce Legal Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Chính sách pháp lý TMĐT</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {POLICIES.map((p) => (
                <li key={p.slug}>
                  <Link href={`/policies/${p.slug}`} className="hover:text-white transition-colors">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Bo Cong Thuong Official Badge & Customer Care */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Chứng nhận TMĐT</h3>
            <div className="mt-4 space-y-4">
              {/* Official MoIT SVG Badge */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[#374151] bg-[#1E293B]">
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden className="shrink-0">
                  <circle cx="24" cy="24" r="22" fill="#005BAA" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M24 6L28 18H40L30 25L34 38L24 30L14 38L18 25L8 18H20L24 6Z" fill="#D32F2F" stroke="#FFEB3B" strokeWidth="1" />
                  <circle cx="24" cy="24" r="10" fill="#FFEB3B" />
                  <path d="M24 16L26 22H32L27 26L29 32L24 28L19 32L21 26L16 22H22L24 16Z" fill="#D32F2F" />
                </svg>
                <div className="text-left">
                  <span className="block font-bold text-[10px] tracking-wider text-red-400 uppercase leading-tight">
                    ĐÃ THÔNG BÁO
                  </span>
                  <span className="block font-extrabold text-xs text-white uppercase tracking-tight">
                    BỘ CÔNG THƯƠNG
                  </span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                Website thương mại điện tử tuân thủ đầy đủ Nghị định 52/2013/NĐ-CP, Nghị định 85/2021/NĐ-CP và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#374151] flex flex-wrap items-center justify-between gap-4 text-xs">
          <p>© 2026 PeakGear.vn — Bản quyền thuộc về {SITE_LEGAL.companyName}</p>
          <p className="text-[11px] text-[#64748B]">Dữ liệu sản phẩm chuẩn hóa từ danh mục Decathlon VN &amp; Fanfan.vn</p>
        </div>
      </div>
    </footer>
  )
}
