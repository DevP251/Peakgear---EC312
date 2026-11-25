'use client'

import React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface SortSelectProps {
  currentSort: string
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (newSort === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', newSort)
    }
    // Always reset page to 1 on sort change
    params.delete('page')

    const qs = params.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="flex items-center gap-2 ml-auto">
      <label htmlFor="sortSelect" className="text-xs text-[#64748B] font-medium whitespace-nowrap">
        Sắp xếp:
      </label>
      <div className="relative">
        <select
          id="sortSelect"
          value={currentSort}
          onChange={handleSortChange}
          className="text-xs font-semibold bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2 pr-8 text-[#111827] focus:outline-hidden focus:border-[#111827] cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
          <option value="rating">Được đánh giá cao</option>
        </select>
      </div>
    </div>
  )
}
