// ─────────────────────────────────────────────────────────────────────────────
// Policy Detail Page (/policies/[slug])
// Renders the 5 verified Vietnamese E-Commerce legal policies
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { POLICIES, SITE_LEGAL } from '@/config/site-legal'

interface PolicyPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }))
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = POLICIES.find((p) => p.slug === slug)

  if (!policy) {
    notFound()
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-10 lg:py-16">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Đường dẫn" className="text-xs text-[#64748B] mb-6">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-[#111827]">Trang chủ</Link>
            </li>
            <li>/</li>
            <li>
              <span>Chính sách TMĐT</span>
            </li>
            <li>/</li>
            <li className="text-[#111827] font-semibold">
              {policy.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="pb-6 border-b border-[#CBD5E1]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Văn bản chính sách pháp lý chính thức
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] mt-2 tracking-tight">
            {policy.title}
          </h1>
          <p className="mt-2 text-xs text-[#64748B]">
            {policy.legalBasis} · Cập nhật ngày: <span className="font-mono">{policy.lastUpdated}</span>
          </p>
        </header>

        {/* Summary Card */}
        <div className="my-8 p-4 sm:p-5 rounded-lg border-l-4 border-[#111827] bg-[#F8FAFC]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Tóm lược nội dung</h2>
          <p className="mt-1 text-sm text-[#475569] leading-relaxed">
            {policy.summary}
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm text-[#334155] leading-relaxed">
          {policy.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-[#111827] pt-2">
                {section.heading}
              </h3>
              {section.content.map((p, pIdx) => (
                <p key={pIdx}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Contact Hotline & Support */}
        <div className="mt-12 pt-6 border-t border-[#CBD5E1] bg-[#F8FAFC] p-5 rounded-lg text-xs text-[#64748B] space-y-1">
          <p className="font-bold text-[#111827]">Bộ phận tiếp nhận khiếu nại &amp; Hỗ trợ khách hàng:</p>
          <p>Hotline: <strong className="text-[#F97316] font-mono">{SITE_LEGAL.hotline}</strong> ({SITE_LEGAL.operatingHours})</p>
          <p>Email: <a href={`mailto:${SITE_LEGAL.email}`} className="text-[#111827] underline">{SITE_LEGAL.email}</a></p>
          <p>Trụ sở: {SITE_LEGAL.headquartersAddress}</p>
        </div>
      </div>
    </div>
  )
}
