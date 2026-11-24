'use client'

import { useCart } from '@/lib/cart-context'

export function ToastContainer() {
  const { toasts, removeToast } = useCart()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg bg-[#111827] text-white text-xs shadow-xl border border-[#374151]"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#16A34A] shrink-0" />
            <span>{toast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-[#94A3B8] hover:text-white p-0.5"
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
