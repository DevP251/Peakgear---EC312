"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Bundle, ProductVariant } from "@/types/storefront";
import { useCart } from "@/lib/cart-context";
import { BundleCard } from "@/components/bundle/BundleCard";

interface ProductDetailViewProps {
  product: Product;
  relatedBundles: Bundle[];
}

export function ProductDetailView({ product, relatedBundles }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();

  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || product.thumbnail || "/images/placeholder.svg"
  );
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentOriginalPrice = selectedVariant?.regularPrice ?? product.originalPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const productTitle = product.title || product.name || "Sản phẩm";
  const discountPercent =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : product.discountPercentage || 0;

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image) {
      setActiveImage(v.image);
    }
    // Limit quantity to available variant stock
    if (quantity > v.stock) {
      setQuantity(Math.max(1, v.stock));
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addItem(
      product,
      quantity,
      selectedVariant?.color || undefined,
      selectedVariant?.size || undefined,
      undefined,
      undefined,
      currentPrice,
      selectedVariant?.sku
    );
    openDrawer();
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      product,
      quantity,
      selectedVariant?.color || undefined,
      selectedVariant?.size || undefined,
      undefined,
      undefined,
      currentPrice,
      selectedVariant?.sku
    );
    router.push("/checkout");
  };

  return (
    <div className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#111827] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href={`/collections/${product.activity || "all"}`} className="hover:text-[#111827] capitalize">
            {product.activity || "Trang bị"}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827] truncate max-w-xs">{productTitle}</span>
        </nav>

        {/* 2-Column Product Main Area */}
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 lg:p-10 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT: GALLERY */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Active Image with Zoom/1:1 container */}
              <div className="relative aspect-square w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl overflow-hidden flex items-center justify-center">
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-xs font-bold bg-[#F97316] text-white rounded-lg">
                    Giảm {discountPercent}%
                  </span>
                )}
                <Image
                  src={activeImage}
                  alt={productTitle}
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-6"
                  onError={() => setActiveImage("/images/placeholder.svg")}
                />
              </div>

              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#F8FAFC] border-2 transition-all shrink-0 ${
                        activeImage === img ? "border-[#F97316] ring-2 ring-[#F97316]/20" : "border-[#CBD5E1] hover:border-slate-400"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${productTitle} - thumb ${idx + 1}`}
                        fill
                        quality={95}
                        sizes="80px"
                        className="object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: DETAILS & ACTIONS */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Brand & SKU Bar */}
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#111827] text-white font-bold tracking-wider uppercase text-[11px]">
                      {product.brand}
                    </span>
                    {product.activity && (
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-[#111827] font-medium">
                        {product.activity}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-4 leading-snug">
                  {productTitle}
                </h1>

                {/* Price Box */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-[#111827] tabular-nums tracking-tight">
                      {formatPrice(currentPrice)}
                    </span>
                    {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                      <span className="text-base text-[#64748B] line-through tabular-nums">
                        {formatPrice(currentOriginalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#16A34A] font-semibold mt-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Đã bao gồm thuế giá trị gia tăng (VAT 8%) theo quy định
                  </div>
                </div>

                {/* Key Spec Highlight */}
                {product.weightFormatted && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-[#111827] mb-6">
                    <span className="text-[#64748B]">Trọng lượng kỹ thuật:</span>
                    <span className="font-mono tabular-nums text-[#111827]">{product.weightFormatted}</span>
                  </div>
                )}

                {/* Variants (if applicable) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
                      Chọn tùy chọn:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleVariantSelect(v)}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                            selectedVariant?.id === v.id
                              ? "bg-[#111827] text-white border-[#111827]"
                              : "bg-white text-[#111827] border-[#CBD5E1] hover:border-slate-400"
                          }`}
                        >
                          {v.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status & Quantity Stepper */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                      Số lượng:
                    </span>
                    <span className="text-xs font-semibold">
                      {isOutOfStock ? (
                        <span className="text-[#DC2626]">Tạm hết hàng</span>
                      ) : (
                        <span className="text-[#16A34A]">Còn {currentStock} sản phẩm sẵn sàng</span>
                      )}
                    </span>
                  </div>

                  {!isOutOfStock && (
                    <div className="inline-flex items-center border border-[#CBD5E1] rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-base font-bold text-[#111827] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-sm font-bold tabular-nums text-[#111827]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                        disabled={quantity >= currentStock}
                        className="w-10 h-10 flex items-center justify-center text-base font-bold text-[#111827] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-8">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    className={`w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                        : "bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c] shadow-orange-500/20"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {isOutOfStock ? "TẠM THỜI HẾT HÀNG" : isAdding ? "ĐÃ THÊM VÀO GIỎ..." : "THÊM VÀO GIỎ HÀNG"}
                  </button>

                  {!isOutOfStock && (
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full min-h-[48px] py-3 px-6 rounded-xl font-bold text-sm text-[#111827] bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-slate-100 hover:border-[#111827] transition-all"
                    >
                      MUA NGAY (GIAO HỎA TỐC 2H)
                    </button>
                  )}
                </div>

                {/* 3 MANDATORY TRUST SIGNALS */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1]">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-5 h-5 text-[#16A34A] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.038 8.038 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-[11px] font-bold text-[#111827]">Đổi trả 30 ngày</span>
                    <span className="text-[10px] text-[#64748B]">Miễn phí tận nơi</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-[#CBD5E1]">
                    <svg className="w-5 h-5 text-[#F97316] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-[11px] font-bold text-[#111827]">Bảo hành chuẩn</span>
                    <span className="text-[10px] text-[#64748B]">Chính hãng 100%</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-5 h-5 text-[#111827] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-[11px] font-bold text-[#111827]">Giao nhanh 2h</span>
                    <span className="text-[10px] text-[#64748B]">Nội thành HN & HCM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Tab & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#111827] mb-4 pb-3 border-b border-[#CBD5E1]">
              Mô Tả Kỹ Thuật Chi Tiết
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-[#111827] leading-relaxed">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#111827] mb-4 pb-3 border-b border-[#CBD5E1]">
              Thông Số Kỹ Thuật (Specs)
            </h2>
            <div className="divide-y divide-[#CBD5E1]/60 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#64748B]">Thương hiệu</span>
                <span className="font-semibold text-[#111827]">{product.brand}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#64748B]">Trọng lượng</span>
                <span className="font-mono font-semibold text-[#111827] tabular-nums">
                  {product.weightFormatted || `${product.weightGrams}g`}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#64748B]">Hoạt động phù hợp</span>
                <span className="font-semibold text-[#111827] capitalize">{product.activity}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#64748B]">Mã quản lý (SKU)</span>
                <span className="font-mono font-semibold text-[#111827]">{product.sku}</span>
              </div>
              {product.specs &&
                Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="py-2.5 flex justify-between">
                    <span className="text-[#64748B] capitalize">{k}</span>
                    <span className="font-semibold text-[#111827]">{String(v)}</span>
                  </div>
                ))}
              <div className="py-2.5 flex justify-between">
                <span className="text-[#64748B]">Bảo hành</span>
                <span className="font-semibold text-[#111827]">12 - 24 tháng chính hãng</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION "COMPLETE YOUR KIT / HOÀN THIỆN BỘ TRANG BỊ CỦA BẠN" */}
        {relatedBundles && relatedBundles.length > 0 && (
          <section className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                  Complete Your Kit • Tiết Kiệm Gói
                </span>
                <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight mt-1">
                  Hoàn Thiện Bộ Trang Bị Của Bạn
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Sản phẩm này nằm trong các gói trang bị đồng bộ. Mua cả bộ để nhận mức chiết khấu tốt nhất và tránh mua trùng lặp.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBundles.map((b) => {
                const isCurrentProductInside = b.components.some((c) => c.productId === product.id);
                return (
                  <div key={b.id} className="flex flex-col">
                    {isCurrentProductInside && (
                      <div className="mb-2 px-3 py-1.5 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/20 text-[11px] font-bold text-[#16A34A] flex items-center gap-1.5">
                        <span>✓</span>
                        <span>
                          Sản phẩm bạn đang xem đã nằm trong gói này — chọn trọn gói để tiết kiệm {b.discountPercent}%!
                        </span>
                      </div>
                    )}
                    <BundleCard bundle={b} />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
