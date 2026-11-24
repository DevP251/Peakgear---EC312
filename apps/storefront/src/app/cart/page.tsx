"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  // Double-submit protection for quantity controls
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleQtyChange = (itemId: string, newQty: number) => {
    if (updatingId) return;
    setUpdatingId(itemId);
    updateQuantity(itemId, newQty);
    setTimeout(() => setUpdatingId(null), 300);
  };

  const handleClearCart = () => {
    if (typeof window !== "undefined" && window.confirm("Quý khách có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?")) {
      clearCart();
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const freeshipThreshold = 500000;
  const progressPercent = Math.min(100, (cart.subtotal / freeshipThreshold) * 100);
  const remainingForFreeship = Math.max(0, freeshipThreshold - cart.subtotal);
  const itemCount = cart.itemCount ?? cart.items.reduce((acc, it) => acc + it.quantity, 0);

  // Group items by bundleId for BundleCartGroup rendering
  const { bundleGroups, standaloneItems } = useMemo(() => {
    const groups: Record<string, { bundleTitle: string; items: typeof cart.items }> = {};
    const standalone: typeof cart.items = [];

    cart.items.forEach((item) => {
      if (item.bundleId) {
        if (!groups[item.bundleId]) {
          groups[item.bundleId] = {
            bundleTitle: item.bundleTitle || "Gói Trang Bị Đồng Bộ",
            items: [],
          };
        }
        groups[item.bundleId].items.push(item);
      } else {
        standalone.push(item);
      }
    });

    return {
      bundleGroups: Object.entries(groups),
      standaloneItems: standalone,
    };
  }, [cart]);

  const handleRemoveBundleGroup = (itemsToRemove: typeof cart.items) => {
    itemsToRemove.forEach((item) => removeItem(item.id));
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#F8FAFC] min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white border border-[#CBD5E1] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
            <svg className="w-10 h-10 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mb-2">
            Giỏ Hàng Của Bạn Đang Trống
          </h1>
          <p className="text-sm text-[#64748B] mb-8 leading-relaxed">
            Chưa có trang bị nào được chọn. Hãy khám phá bộ sưu tập leo núi, trekking và camping để sẵn sàng cho hành trình của bạn.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm bg-[#F97316] text-white hover:bg-[#ea580c] transition-all shadow-md shadow-orange-500/20"
          >
            Khám phá 400+ sản phẩm
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-8 lg:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-8">
          <Link href="/" className="hover:text-[#111827] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827]">Giỏ hàng của bạn</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Giỏ Hàng ({itemCount} sản phẩm)
          </h1>
          <button
            onClick={handleClearCart}
            className="text-xs font-semibold text-[#64748B] hover:text-[#DC2626] transition-colors"
          >
            Xóa toàn bộ giỏ
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CART ITEMS LIST */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dynamic Freeship Progress Bar */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span>
                  {remainingForFreeship === 0 ? (
                    <span className="text-[#16A34A] flex items-center gap-1.5 font-bold">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Đủ điều kiện Miễn phí vận chuyển toàn quốc!
                    </span>
                  ) : (
                    <span>
                      Mua thêm{" "}
                      <span className="text-[#F97316] font-bold tabular-nums">
                        {formatPrice(remainingForFreeship)}
                      </span>{" "}
                      để được <strong className="text-[#111827]">Freeship</strong>
                    </span>
                  )}
                </span>
                <span className="text-[#64748B] tabular-nums font-mono text-[11px]">
                  Mốc 500.000 đ
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* BUNDLE GROUPS (BundleCartGroup) */}
            {bundleGroups.length > 0 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                  <span>📦</span> Các Gói Trang Bị Đồng Bộ ({bundleGroups.length} gói)
                </div>

                {bundleGroups.map(([bId, group]) => (
                  <div
                    key={bId}
                    className="bg-white border-2 border-[#111827] rounded-3xl overflow-hidden shadow-xs"
                  >
                    {/* Bundle Group Header */}
                    <div className="bg-[#111827] text-white px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                        <span className="text-xs font-bold uppercase tracking-wide text-[#FACC15]">
                          Gói Combo: {group.bundleTitle}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-200">
                          {group.items.length} món đồng bộ
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBundleGroup(group.items)}
                        className="text-xs text-slate-300 hover:text-[#DC2626] font-semibold transition-colors"
                      >
                        ✕ Xóa cả bộ
                      </button>
                    </div>

                    {/* Bundle Group Items */}
                    <div className="divide-y divide-[#CBD5E1]/60">
                      {group.items.map((item) => {
                        const img = item.thumbnail || item.image || item.product?.thumbnail || item.product?.images?.[0] || "/images/placeholder.svg";
                        const title = item.title || item.name || item.product?.title || item.product?.name || "Sản phẩm";
                        const weight = item.weightFormatted || (item.weightGrams ? `${item.weightGrams}g` : "400g");
                        const unitPrice = item.price || item.unitPrice || 0;

                        return (
                          <div key={item.id} className="p-4 sm:p-5 flex items-center gap-4 bg-[#F8FAFC]">
                            <div className="relative w-16 h-16 bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shrink-0">
                              <Image src={img} alt={title} fill className="object-contain p-2" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-[#111827] line-clamp-1">
                                {title}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                                <span>SL: {item.quantity}</span>
                                <span>•</span>
                                <span className="font-mono tabular-nums">{weight}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm font-bold text-[#111827] tabular-nums">
                                {formatPrice(unitPrice * item.quantity)}
                              </div>
                              <div className="text-[10px] text-[#16A34A] font-semibold">
                                Đã chiết khấu gói
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STANDALONE ITEMS TABLE */}
            {standaloneItems.length > 0 && (
              <div className="space-y-3">
                {bundleGroups.length > 0 && (
                  <div className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    Sản Phẩm Mua Lẻ ({standaloneItems.length} món)
                  </div>
                )}

                <div className="bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#CBD5E1]/60">
                  {standaloneItems.map((item) => {
                    const img = item.thumbnail || item.image || item.product?.thumbnail || item.product?.images?.[0] || "/images/placeholder.svg";
                    const title = item.title || item.name || item.product?.title || item.product?.name || "Sản phẩm";
                    const handle = item.product?.handle || item.productId;
                    const brand = item.product?.brand || "PeakGear";
                    const weight = item.weightFormatted || (item.weightGrams ? `${item.weightGrams}g` : "400g");
                    const unitPrice = item.price || item.unitPrice || 0;

                    return (
                      <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl overflow-hidden shrink-0">
                          <Image src={img} alt={title} fill className="object-contain p-2" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                              {brand}
                            </span>
                          </div>
                          <Link
                            href={`/products/${handle}`}
                            className="text-sm sm:text-base font-bold text-[#111827] hover:text-[#F97316] transition-colors line-clamp-2 mb-1.5"
                          >
                            {title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-[#64748B]">
                            <span className="font-mono tabular-nums">{weight}</span>
                            <span>•</span>
                            <span className="text-[#16A34A] font-medium">Sẵn kho giao ngay</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-black text-[#111827] tabular-nums">
                              {formatPrice(unitPrice * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-[#64748B] tabular-nums">
                                {formatPrice(unitPrice)} / món
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center border border-[#CBD5E1] rounded-lg overflow-hidden bg-white">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                disabled={updatingId === item.id}
                                aria-label="Giảm số lượng"
                                className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#111827] hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-bold tabular-nums text-[#111827]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                disabled={updatingId === item.id}
                                aria-label="Tăng số lượng"
                                className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#111827] hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-[#DC2626] transition-colors"
                              title="Xóa món này"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Link continue shopping */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/collections/all"
                className="inline-flex items-center text-xs font-bold text-[#111827] hover:text-[#F97316] transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tiếp tục chọn thêm trang bị
              </Link>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs sticky top-24">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#111827] pb-4 border-b border-[#CBD5E1] mb-5">
                Tóm Tắt Đơn Hàng
              </h2>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Tạm tính ({itemCount} món)</span>
                  <span className="font-semibold text-[#111827] tabular-nums">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                {(cart.bundleDiscount ?? 0) > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-semibold">
                    <span>Ưu đãi gói Bundle</span>
                    <span className="tabular-nums">-{formatPrice(cart.bundleDiscount!)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#64748B]">Phí vận chuyển dự tính</span>
                  <span className="font-semibold text-[#111827] tabular-nums">
                    {cart.shipping === 0 ? (
                      <span className="text-[#16A34A]">Miễn phí</span>
                    ) : (
                      formatPrice(cart.shipping)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#CBD5E1] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-[#111827]">Tổng thanh toán</span>
                    <div className="text-[11px] text-[#16A34A] font-medium mt-0.5">
                      Đã bao gồm thuế VAT (8%)
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#111827] tabular-nums">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>

              {/* Primary CTA Checkout */}
              <Link
                href="/checkout"
                className="w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c] transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 mb-6"
              >
                Tiến hành thanh toán
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              {/* Guarantees */}
              <div className="pt-5 border-t border-[#CBD5E1]/60 space-y-2.5 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  <span>Đổi trả 30 ngày miễn phí nếu không vừa size</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  <span>Bảo hành chính hãng Decathlon & FanFan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  <span>Kiểm tra hàng trước khi thanh toán (Đồng kiểm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
