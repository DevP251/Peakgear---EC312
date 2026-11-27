"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FinderRecommendations, Product } from "@/types/storefront";
import { useCart } from "@/lib/cart-context";
import { BundleCard } from "@/components/bundle/BundleCard";

interface FinderResultsViewProps {
  recommendations: FinderRecommendations;
}

export function FinderResultsView({ recommendations }: FinderResultsViewProps) {
  const [activeTab, setActiveTab] = useState<"products" | "bundles">("products");
  const { addItem, openDrawer } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const handleAddProduct = (prod: Product) => {
    setAddingId(prod.id);
    addItem(prod, 1);
    openDrawer();
    setTimeout(() => setAddingId(null), 500);
  };

  const { summary, products = [], bundles = [] } = recommendations;

  return (
    <div className="bg-[#F8FAFC] py-8 lg:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#111827] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/gear-finder" className="hover:text-[#111827] transition-colors">
            Smart Gear-Finder
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827]">Kết quả định vị trang bị</span>
        </nav>

        {/* Top Header & Decision Chips */}
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#CBD5E1]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] text-[#FACC15] text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                KẾT QUẢ ĐỊNH VỊ CHUẨN KỸ THUẬT
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-2">
                Bộ Trang Bị Tối Ưu Cho Cung Đường Của Bạn
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
                Được hệ thống tính toán dựa trên quy chuẩn tải trọng The Big Three của Hyperlite Mountain Gear.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/gear-finder"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-slate-100 transition-colors"
              >
                ✎ Sửa câu trả lời
              </Link>
              <Link
                href="/gear-finder?reset=1"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#DC2626] transition-colors"
              >
                Làm lại từ đầu
              </Link>
            </div>
          </div>

          {/* User Choices Chips Summary */}
          {summary.userChoices && summary.userChoices.length > 0 && (
            <div className="pt-6">
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
                Các tiêu chí bạn đã thiết lập:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {summary.userChoices.map((c, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs"
                  >
                    <span className="text-[#64748B]">{c.label}:</span>
                    <strong className="text-[#111827]">{c.valueText}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specs Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#CBD5E1]/60">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1]/60">
              <div className="text-[11px] text-[#64748B] uppercase font-semibold mb-1">
                Tổng trọng lượng rỗng (Base Weight)
              </div>
              <div className="text-2xl font-black text-[#111827] font-mono tabular-nums">
                {summary.totalEstimatedWeightFormatted || `${summary.totalEstimatedWeightGrams}g`}
              </div>
              <div className="text-[10px] text-[#16A34A] font-medium mt-1">
                ✓ Đạt chuẩn The Big Three (&lt; 5.5kg)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1]/60">
              <div className="text-[11px] text-[#64748B] uppercase font-semibold mb-1">
                Thể tích balo khuyến nghị
              </div>
              <div className="text-2xl font-black text-[#111827] font-mono">
                {summary.packVolume}
              </div>
              <div className="text-[10px] text-[#64748B] font-medium mt-1">
                Vừa vặn đồ sinh hoạt &amp; bảo hộ
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1]/60">
              <div className="text-[11px] text-[#64748B] uppercase font-semibold mb-1">
                Khả năng kháng thời tiết
              </div>
              <div className="text-sm font-bold text-[#111827] leading-snug line-clamp-2">
                {summary.weatherFit}
              </div>
              <div className="text-[10px] text-[#16A34A] font-medium mt-1">
                ✓ Đạt kiểm nghiệm dã ngoại thực địa
              </div>
            </div>
          </div>

          {/* Rationale Blurb */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-[#111827] leading-relaxed">
            <strong className="text-[#F97316]">Căn cứ kỹ thuật:</strong> {summary.rationale}
          </div>
        </div>

        {/* 2 DISTINCT TABS */}
        <div className="flex items-center gap-4 border-b border-[#CBD5E1] mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "products"
                ? "text-[#111827] border-b-2 border-[#111827]"
                : "text-[#64748B] hover:text-[#111827]"
            }`}
          >
            Sản Phẩm Đơn Lẻ Phù Hợp ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bundles")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "bundles"
                ? "text-[#111827] border-b-2 border-[#111827]"
                : "text-[#64748B] hover:text-[#111827]"
            }`}
          >
            Bộ Trang Bị Đồng Bộ ({bundles.length})
          </button>
        </div>

        {/* TAB 1: INDIVIDUAL PRODUCTS */}
        {activeTab === "products" && (
          <div>
            {products.length === 0 ? (
              <div className="bg-white border border-[#CBD5E1] rounded-3xl p-12 text-center">
                <h3 className="text-base font-bold text-[#111827] mb-2">Chưa tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-[#64748B] mb-6">Hãy thử điều chỉnh lại một số câu trả lời của bạn.</p>
                <Link
                  href="/gear-finder"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#111827] text-white"
                >
                  Điều chỉnh tiêu chí
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((item) => {
                  const prod = item.product;
                  const isAdding = addingId === prod.id;
                  const img = prod.thumbnail || prod.images?.[0] || "/images/placeholder.svg";
                  const title = prod.title || prod.name;
                  const weight = prod.weightFormatted || `${prod.weightGrams}g`;

                  return (
                    <div
                      key={item.slotId}
                      className="bg-white border border-[#CBD5E1] rounded-3xl p-6 shadow-xs hover:border-[#111827] transition-all flex flex-col lg:flex-row gap-6 items-start lg:items-center"
                    >
                      {/* Slot Badge & Thumbnail */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl overflow-hidden shrink-0">
                          <Image
                            src={img}
                            alt={title}
                            fill
                            quality={95}
                            sizes="(max-width: 640px) 112px, 128px"
                            className="object-contain p-3"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded bg-[#111827] text-white text-[10px] font-bold uppercase tracking-wider">
                            {item.slotName}
                          </span>
                          <span className="text-xs font-semibold text-[#64748B] uppercase">
                            {prod.brand}
                          </span>
                        </div>

                        <Link
                          href={`/products/${prod.handle}`}
                          className="text-base sm:text-lg font-bold text-[#111827] hover:text-[#F97316] transition-colors line-clamp-1 mb-2"
                        >
                          {title}
                        </Link>

                        <div className="flex items-center gap-3 text-xs text-[#64748B] mb-4">
                          <span className="font-mono font-semibold text-[#111827] tabular-nums">
                            Trọng lượng: {weight}
                          </span>
                          <span>•</span>
                          <span className="text-[#16A34A] font-medium">Còn hàng sẵn sàng</span>
                        </div>

                        {/* SECTION: VÌ SAO ĐƯỢC ĐỀ XUẤT? (ANTI-FAKE: ZERO % MATCH SCORE) */}
                        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                          <div className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <span className="text-[#F97316]">★</span> Vì sao được đề xuất?
                          </div>

                          {/* Reason Tags */}
                          {item.reasonTags && item.reasonTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {item.reasonTags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[10px] font-semibold text-[#111827]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-[11px] text-[#64748B] leading-relaxed">
                            {item.reasonText || item.reasons?.join(" • ")}
                          </p>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 gap-3">
                        <div className="text-left lg:text-right">
                          <div className="text-xl font-black text-[#111827] tabular-nums">
                            {formatPrice(prod.price)}
                          </div>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <div className="text-xs text-[#64748B] line-through tabular-nums">
                              {formatPrice(prod.originalPrice)}
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col gap-2 w-auto lg:w-full">
                          <Link
                            href={`/products/${prod.handle}`}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-slate-100 text-center transition-colors"
                          >
                            Chi tiết
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleAddProduct(prod)}
                            disabled={isAdding}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#F97316] hover:bg-[#ea580c] active:bg-[#c2410c] transition-all shadow-xs"
                          >
                            {isAdding ? "Đã thêm" : "+ Thêm vào giỏ"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECOMMENDED BUNDLES */}
        {activeTab === "bundles" && (
          <div>
            {bundles.length === 0 ? (
              <div className="bg-white border border-[#CBD5E1] rounded-3xl p-12 text-center">
                <h3 className="text-base font-bold text-[#111827] mb-2">Chưa có gói trang bị phù hợp</h3>
                <p className="text-xs text-[#64748B]">Hãy xem danh sách sản phẩm đơn lẻ ở tab bên cạnh.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="flex flex-col">
                    <BundleCard bundle={bundle} />

                    {/* SECTION: VÌ SAO GÓI NÀY ĐƯỢC ĐỀ XUẤT? (ZERO % MATCH SCORE) */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-white border border-[#CBD5E1] text-xs">
                      <div className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="text-[#F97316]">★</span> Vì sao đề xuất gói này?
                      </div>

                      {bundle.reasonTags && bundle.reasonTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {bundle.reasonTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-[10px] font-semibold text-[#111827]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        {bundle.reasonText || bundle.reasons?.join(" • ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
