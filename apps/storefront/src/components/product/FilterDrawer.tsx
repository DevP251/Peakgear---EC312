'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface FilterDrawerProps {
  handle: string
  selectedBrand?: string
  selectedPrice?: string
  inStockOnly: boolean
  brands: Array<{ name: string; value: string }>
}

export function FilterDrawer({
  handle,
  selectedBrand,
  selectedPrice,
  inStockOnly,
  brands,
}: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = {
      brand: selectedBrand,
      price: selectedPrice,
      stock: inStockOnly ? '1' : undefined,
      ...overrides,
    }
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, v)
    })
    const qs = params.toString()
    return `/collections/${handle}${qs ? `?${qs}` : ''}`
  }

  const activeCount = [selectedBrand, selectedPrice, inStockOnly ? '1' : undefined].filter(Boolean).length

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#111827] shadow-xs"
        aria-label="Mở bộ lọc tìm kiếm"
      >
        <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Bộ lọc</span>
        {activeCount > 0 && (
          <span className="size-5 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[10px] tabular-nums">
            {activeCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden" role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm">
          <div className="fixed inset-0 bg-[#111827]/60 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Bộ Lọc Sản Phẩm</h3>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-xs font-bold">
                    {activeCount} đã chọn
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#111827] text-lg font-bold"
                aria-label="Đóng bộ lọc"
              >
                ✕
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Category */}
              <div>
                <h4 className="font-bold text-[#111827] uppercase tracking-wider mb-2.5">Bộ Sưu Tập</h4>
                <div className="space-y-1">
                  {[
                    { label: 'Tất cả sản phẩm', key: 'all' },
                    { label: 'Trekking Khắc Nghiệt', key: 'trekking' },
                    { label: 'Hiking Cơ Động', key: 'hiking' },
                    { label: 'Camping & Dã Ngoại', key: 'camping' },
                  ].map((cat) => (
                    <Link
                      key={cat.key}
                      href={`/collections/${cat.key}`}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        handle === cat.key ? 'bg-[#111827] text-white font-semibold' : 'text-[#64748B] hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-[#CBD5E1]">
                <h4 className="font-bold text-[#111827] uppercase tracking-wider mb-2.5">Khoảng Giá</h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'Tất cả mức giá', value: undefined },
                    { label: 'Dưới 500.000 đ', value: 'under-500k' },
                    { label: '500.000 đ - 1.000.000 đ', value: '500k-1m' },
                    { label: '1.000.000 đ - 2.000.000 đ', value: '1m-2m' },
                    { label: 'Trên 2.000.000 đ', value: 'above-2m' },
                  ].map((opt) => {
                    const isSelected = selectedPrice === opt.value
                    return (
                      <Link
                        key={opt.label}
                        href={buildUrl({ price: opt.value })}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                          isSelected ? 'bg-[#F97316]/10 text-[#F97316] font-bold' : 'text-[#64748B] hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <span>✓</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="pt-4 border-t border-[#CBD5E1]">
                <h4 className="font-bold text-[#111827] uppercase tracking-wider mb-2.5">Thương Hiệu</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  <Link
                    href={buildUrl({ brand: undefined })}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-1.5 px-3 rounded ${
                      !selectedBrand ? 'bg-slate-100 font-bold text-[#111827]' : 'text-[#64748B]'
                    }`}
                  >
                    <span>Tất cả thương hiệu</span>
                  </Link>
                  {brands.map((b) => {
                    const isSelected = selectedBrand === b.value
                    return (
                      <Link
                        key={b.value}
                        href={buildUrl({ brand: isSelected ? undefined : b.value })}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between py-1.5 px-3 rounded ${
                          isSelected ? 'bg-[#111827] text-white font-semibold' : 'text-[#64748B] hover:bg-slate-50'
                        }`}
                      >
                        <span>{b.name}</span>
                        {isSelected && <span>✓</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Stock */}
              <div className="pt-4 border-t border-[#CBD5E1]">
                <Link
                  href={buildUrl({ stock: inStockOnly ? undefined : '1' })}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg border ${
                    inStockOnly ? 'border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A] font-semibold' : 'border-[#CBD5E1] text-[#64748B]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${inStockOnly ? 'bg-[#16A34A] border-[#16A34A] text-white' : 'border-slate-400'}`}>
                    {inStockOnly && <span className="text-[10px]">✓</span>}
                  </div>
                  <span>Chỉ hiển thị còn hàng</span>
                </Link>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#CBD5E1] bg-[#F8FAFC] flex gap-3">
              <Link
                href={`/collections/${handle}`}
                onClick={() => setIsOpen(false)}
                className="w-1/2 py-2.5 text-center rounded-xl border border-[#CBD5E1] font-semibold text-[#64748B] hover:text-[#DC2626] text-xs"
              >
                Xóa tất cả
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-[#111827] text-white font-bold text-xs hover:bg-[#F97316] transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
