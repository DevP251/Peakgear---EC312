'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Search Overlay Component
// STRICT: NO Finder questions or CTAs here. Only real product search.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { storeApi } from '@/lib/api'
import type { Product } from '@/types/storefront'

interface SearchOverlayProps {
  onClose: () => void
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    inputRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await storeApi.getProducts({ search: query, limit: 6 })
        setResults(res.products)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/collections/all?search=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111827]/70 backdrop-blur-xs p-4 sm:p-6 lg:p-12" role="dialog" aria-modal="true">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 border-b border-[#CBD5E1]">
          <svg width="20" height="20" fill="none" stroke="#64748B" strokeWidth="2" className="shrink-0 mr-3">
            <circle cx="8" cy="8" r="6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m13 13 4 4" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm balo, lều, túi ngủ..."
            className="w-full text-base text-[#111827] placeholder:text-[#64748B] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#64748B] hover:text-[#111827] text-xs font-semibold mr-2"
            >
              Xóa
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] border border-[#CBD5E1]"
          >
            Đóng (Esc)
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && (
            <div className="space-y-3 py-2">
              <div className="h-12 w-full skeleton" />
              <div className="h-12 w-full skeleton" />
              <div className="h-12 w-full skeleton" />
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-sm text-[#64748B]">
              Không tìm thấy sản phẩm khớp với từ khóa &ldquo;<strong className="text-[#111827]">{query}</strong>&rdquo;.
              <p className="mt-1 text-xs">Vui lòng thử từ khóa thông dụng hơn như &ldquo;balo&rdquo;, &ldquo;lều&rdquo;, &ldquo;bếp&rdquo;.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="divide-y divide-[#F1F5F9]">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.handle || product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="size-12 rounded bg-[#F8FAFC] border border-[#CBD5E1] overflow-hidden shrink-0 relative flex items-center justify-center">
                      <Image
                        src={product.images[0] || '/images/placeholder.svg'}
                        alt={product.name}
                        width={48}
                        height={48}
                        quality={95}
                        className="size-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{product.brand}</p>
                      <h4 className="text-sm font-semibold text-[#111827] truncate">{product.name}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-[#F97316] tabular-nums price-num">
                        {product.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="py-4 text-xs text-[#64748B]">
              <span className="font-semibold text-[#111827]">Gợi ý tìm kiếm nhanh:</span> Balo leo núi 45L, Lều cắm trại 2 người, Giày trekking chống nước, Túi ngủ cách nhiệt, Bếp dã ngoại mini.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
