"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bundle, BundleComponent, Product } from "@/types/storefront";
import { useCart } from "@/lib/cart-context";
import { storeApi } from "@/lib/api";

interface BundleDetailViewProps {
  bundle: Bundle;
}

export function BundleDetailView({ bundle: initialBundle }: BundleDetailViewProps) {
  const { addBundle, openDrawer } = useCart();
  const [bundle, setBundle] = useState<Bundle>(initialBundle);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialBundle.components.map((c) => c.productId)
  );
  const [isPending, startTransition] = useTransition();
  const [swappingTarget, setSwappingTarget] = useState<BundleComponent | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  // Trigger server/adapter preview whenever component selection changes
  const updateSelection = (newSelectedIds: string[]) => {
    setSelectedIds(newSelectedIds);
    startTransition(async () => {
      try {
        const preview = await storeApi.previewBundleCustomization(initialBundle.id, newSelectedIds);
        setBundle(preview);
      } catch (err) {
        console.error("Bundle preview error:", err);
      }
    });
  };

  // Toggle optional component
  const handleToggleComponent = (comp: BundleComponent) => {
    if (comp.required) return; // Cannot toggle mandatory item
    const isCurrentlySelected = selectedIds.includes(comp.productId);
    const next = isCurrentlySelected
      ? selectedIds.filter((id) => id !== comp.productId)
      : [...selectedIds, comp.productId];
    updateSelection(next);
  };

  // Swap component with alternative in-stock product
  const handleSwapProduct = (oldProdId: string, newProduct: Product) => {
    const next = selectedIds.map((id) => (id === oldProdId ? newProduct.id : id));
    setSwappingTarget(null);
    updateSelection(next);
  };

  const handleAddBundleToCart = () => {
    if (!bundle.isAvailable) return;
    addBundle(bundle);
    openDrawer();
  };

  // Organize components by the 5 Near Zero categories
  const categories: Array<{
    groupKey: "pack" | "shelter" | "sleep" | "cook" | "safety";
    title: string;
    icon: string;
  }> = [
    { groupKey: "pack", title: "1. Balo & Mang Vác (The Pack)", icon: "🎒" },
    { groupKey: "shelter", title: "2. Nơi Trú Ẩn & Lều Trại (The Shelter)", icon: "⛺" },
    { groupKey: "sleep", title: "3. Giấc Ngủ & Đệm (The Sleep System)", icon: "🛏️" },
    { groupKey: "cook", title: "4. Bếp & Ẩm Thực (The Cook System)", icon: "🍳" },
    { groupKey: "safety", title: "5. An Toàn & Phụ Kiện (The Safety & Essentials)", icon: "🔦" },
  ];

  const discountRate = bundle.tierDiscountRate ?? bundle.discountPercent ?? bundle.discountPercentage;
  const currentItemCount = bundle.components.length;
  const savingsAmount = bundle.savingsAmount ?? bundle.savings;
  const totalWeightFormatted = bundle.totalWeightFormatted || `${(bundle.totalWeightGrams / 1000).toFixed(1)}kg`;

  // Incentive hint for next tier
  const tierIncentive =
    currentItemCount < 3
      ? "Chọn thêm món để nhận chiết khấu gói từ 10%!"
      : currentItemCount === 3
      ? "Chọn thêm 1 món để nâng mức giảm giá lên 15%!"
      : currentItemCount === 4
      ? "Chọn thêm 1 món nữa để nhận chiết khấu tối đa 20%!"
      : "🎉 Bạn đang nhận mức chiết khấu trọn bộ tối đa 20%!";

  return (
    <div className="bg-[#F8FAFC] py-8 lg:py-12 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#111827] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-[#111827] transition-colors">
            Gói trang bị
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827]">{bundle.title}</span>
        </nav>

        {/* TOP & HERO SECTION (AREAS 1, 2, 3) */}
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* HERO LEFT: BUNDLE IMAGE / COLLAGE */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-4/3 w-full bg-[#111827] rounded-2xl overflow-hidden border border-[#CBD5E1] flex items-center justify-center">
                <Image
                  src={bundle.image || "/images/placeholder.svg"}
                  alt={bundle.title}
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#FACC15]">
                    {bundle.activity} • {bundle.tier || "Standard"}
                  </span>
                  <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold">
                    {currentItemCount} trang bị đồng bộ
                  </span>
                </div>
              </div>

              {/* Components Mini Thumbnail Collage */}
              <div className="grid grid-cols-5 gap-2">
                {bundle.components.slice(0, 5).map((comp, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] overflow-hidden"
                    title={comp.title || comp.name}
                  >
                    <Image
                      src={comp.thumbnail || comp.image || "/images/placeholder.svg"}
                      alt={comp.title || comp.name}
                      fill
                      quality={95}
                      sizes="(max-width: 768px) 20vw, 100px"
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* HERO RIGHT: TITLE, METRICS & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#111827] text-[#FACC15] text-[11px] font-bold uppercase tracking-wider">
                    {bundle.isCustomizable ? "GÓI TÙY CHỈNH (CUSTOMIZABLE)" : "GÓI NGUYÊN BẢN (READY-MADE)"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#111827] text-[11px] font-semibold capitalize">
                    {bundle.activity}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-2 leading-snug">
                  {bundle.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                  {bundle.description}
                </p>

                {/* Price & Savings Box */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] mb-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-3xl font-black text-[#111827] tabular-nums">
                      {formatPrice(bundle.price)}
                    </span>
                    <span className="text-xs font-bold text-[#16A34A] px-2.5 py-1 rounded bg-[#16A34A]/10 tabular-nums">
                      Tiết kiệm {formatPrice(savingsAmount)} ({discountRate}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>Tổng giá niêm yết mua lẻ:</span>
                    <span className="line-through tabular-nums font-semibold">{formatPrice(bundle.originalPrice)}</span>
                  </div>
                </div>

                {/* 3 Core Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">1. Quy mô</span>
                    <span className="text-lg font-black text-[#111827] tabular-nums">{currentItemCount} món</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Không thiếu đồ</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">2. Trọng lượng</span>
                    <span className="text-lg font-black text-[#111827] font-mono tabular-nums">{totalWeightFormatted}</span>
                    <span className="text-[10px] text-[#16A34A] block mt-0.5">Cân bằng tải</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">3. Giảm giá</span>
                    <span className="text-lg font-black text-[#F97316] font-mono tabular-nums">-{discountRate}%</span>
                    <span className="text-[10px] text-[#111827] block mt-0.5 truncate" title={tierIncentive}>{tierIncentive}</span>
                  </div>
                </div>

                {/* Stock Warning Banner if Unavailable */}
                {!bundle.isAvailable && (
                  <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-[#111827] flex items-center gap-2.5">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <strong>Cảnh báo tồn kho:</strong> Một trong các sản phẩm trong bộ đang tạm hết hàng. Quý khách vui lòng nhấn <em>&quot;Đổi sản phẩm tương đương&quot;</em> bên dưới để hoàn tất gói.
                    </div>
                  </div>
                )}

                {/* Action button in Hero */}
                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  disabled={!bundle.isAvailable || isPending}
                  className={`w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 uppercase ${
                    !bundle.isAvailable
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300"
                      : "bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c] shadow-orange-500/20"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {!bundle.isAvailable
                    ? "TẠM HẾT HÀNG - VUI LÒNG ĐỔI MÓN"
                    : isPending
                    ? "ĐANG TÍNH TOÁN LẠI GÓI..."
                    : `THÊM CẢ BỘ VÀO GIỎ (${formatPrice(bundle.price)})`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 CATEGORY GROUPS (NEAR ZERO STRUCTURE) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111827]">
              Cấu Hình 5 Nhóm Trang Bị Trong Gói
            </h2>
            <div className="text-xs text-[#64748B]">
              {isPending ? "Đang tính toán lại chiết khấu..." : "Có thể tùy biến thành phần không bắt buộc"}
            </div>
          </div>

          {categories.map((cat) => {
            const groupComponents = bundle.components.filter(
              (c) => c.categoryGroup === cat.groupKey || (!c.categoryGroup && cat.groupKey === "pack")
            );

            if (groupComponents.length === 0) return null;

            return (
              <div
                key={cat.groupKey}
                className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 shadow-xs"
              >
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#CBD5E1]">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="text-base font-bold text-[#111827] uppercase tracking-wide">
                    {cat.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupComponents.map((comp) => {
                    const isSelected = selectedIds.includes(comp.productId);
                    const weight = comp.weightFormatted || `${comp.weightGrams}g`;

                    return (
                      <div
                        key={comp.productId}
                        className={`p-4 rounded-2xl border-2 transition-all flex gap-4 items-start ${
                          isSelected
                            ? "border-[#111827] bg-[#F8FAFC]"
                            : "border-slate-200 bg-white opacity-60"
                        }`}
                      >
                        {/* Checkbox toggle / Lock */}
                        <div className="pt-1">
                          {comp.required ? (
                            <span
                              className="w-5 h-5 rounded bg-[#111827] text-[#FACC15] flex items-center justify-center text-xs font-bold"
                              title="Trang bị bắt buộc của gói"
                            >
                              🔒
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleComponent(comp)}
                              className="w-5 h-5 rounded border-[#CBD5E1] text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                            />
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={comp.thumbnail || comp.image || "/images/placeholder.svg"}
                            alt={comp.title || comp.name}
                            fill
                            quality={95}
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {comp.required ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111827] text-[#FACC15] uppercase">
                                Bắt buộc
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#64748B]">
                                Tùy chọn
                              </span>
                            )}
                            <span className="text-[11px] font-mono text-[#64748B] tabular-nums">
                              {weight}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#111827] line-clamp-2 leading-snug mb-1">
                            {comp.title || comp.name}
                          </h4>

                          <div className="text-xs font-bold text-[#111827] tabular-nums mb-3">
                            {formatPrice(comp.price)}
                          </div>

                          {/* Swap button if alternatives exist */}
                          {comp.alternativeProducts && comp.alternativeProducts.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSwappingTarget(comp)}
                              className="text-[11px] font-semibold text-[#F97316] hover:underline flex items-center gap-1"
                            >
                              ⇄ Đổi sản phẩm tương đương ({comp.alternativeProducts.length} lựa chọn)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* AREA 7: EXPLANATION SECTION */}
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-xs mt-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#CBD5E1]">
            <span className="text-xl">🧭</span>
            <h3 className="text-base font-bold text-[#111827] uppercase tracking-wide">
              Cơ Sở Kỹ Thuật &amp; Lý Do Đồng Bộ Trang Bị
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#64748B] leading-relaxed">
            <div>
              <h4 className="font-bold text-[#111827] mb-2 text-sm">Ngữ cảnh sử dụng đề xuất</h4>
              <p className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#111827]">
                {bundle.useCase || `Gói trang bị được tối ưu cho các chuyến đi ${bundle.activity} dài ngày.`}
              </p>
            </div>

            {bundle.features && (
              <div>
                <h4 className="font-bold text-[#111827] mb-2 text-sm">5 Phân hệ The Big Three &amp; Essentials</h4>
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
                  <p><strong>1. Balo:</strong> {bundle.features.pack}</p>
                  <p><strong>2. Nơi trú ẩn:</strong> {bundle.features.shelter}</p>
                  <p><strong>3. Giấc ngủ:</strong> {bundle.features.sleep}</p>
                  <p><strong>4. Nấu nướng:</strong> {bundle.features.cook}</p>
                  <p><strong>5. An toàn:</strong> {bundle.features.safety}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SWAP ALTERNATIVE MODAL */}
        {swappingTarget && (
          <div className="fixed inset-0 z-50 bg-[#111827]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#CBD5E1]">
              <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1] mb-4">
                <h4 className="text-sm font-bold text-[#111827] uppercase">
                  Chọn Sản Phẩm Thay Thế Tương Thích
                </h4>
                <button
                  type="button"
                  onClick={() => setSwappingTarget(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-200"
                >
                  ×
                </button>
              </div>

              <p className="text-xs text-[#64748B] mb-4">
                Thay thế món &quot;<strong>{swappingTarget.title || swappingTarget.name}</strong>&quot; bằng một sản phẩm tương đương từ Decathlon/FanFan:
              </p>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {swappingTarget.alternativeProducts?.map((altProd) => (
                  <div
                    key={altProd.id}
                    className="p-3 rounded-2xl border border-[#CBD5E1] hover:border-[#111827] transition-all flex items-center justify-between gap-3 bg-[#F8FAFC]"
                  >
                    <div className="relative w-12 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={altProd.thumbnail || altProd.images[0] || "/images/placeholder.svg"}
                        alt={altProd.title || altProd.name}
                        fill
                        quality={95}
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-bold text-[#111827] truncate">
                        {altProd.title || altProd.name}
                      </div>
                      <div className="text-[#64748B] tabular-nums">
                        {altProd.weightFormatted || `${altProd.weightGrams}g`} • {formatPrice(altProd.price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwapProduct(swappingTarget.productId, altProd)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#111827] text-white hover:bg-[#F97316] transition-colors shrink-0"
                    >
                      Chọn món này
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM SUMMARY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="text-[11px] text-[#64748B] uppercase font-semibold">
                Tổng thanh toán trọn bộ ({currentItemCount} món):
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827] tabular-nums font-mono">
                  {formatPrice(bundle.price)}
                </span>
                <span className="text-xs text-[#64748B] line-through tabular-nums">
                  {formatPrice(bundle.originalPrice)}
                </span>
                <span className="text-xs font-bold text-[#16A34A] px-2 py-0.5 rounded bg-[#16A34A]/10">
                  Tiết kiệm {formatPrice(savingsAmount)}
                </span>
              </div>
            </div>

            <div className="hidden md:block pl-6 border-l border-[#CBD5E1] text-xs">
              <div className="text-[#64748B]">Tổng trọng lượng:</div>
              <div className="font-mono font-bold text-[#111827] tabular-nums">
                {totalWeightFormatted}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddBundleToCart}
              disabled={!bundle.isAvailable || isPending}
              className={`w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 uppercase ${
                !bundle.isAvailable
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300"
                  : "bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c] shadow-orange-500/20"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {!bundle.isAvailable
                ? "TẠM HẾT HÀNG - VUI LÒNG ĐỔI MÓN"
                : isPending
                ? "ĐANG CẬP NHẬT GÓI..."
                : `THÊM CẢ BỘ VÀO GIỎ (${formatPrice(bundle.price)})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
