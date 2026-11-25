"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/storefront";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openDrawer } = useCart();
  const [imgSrc, setImgSrc] = useState(product.thumbnail || product.images?.[0] || "/images/placeholder.svg");
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const hasMultipleVariants = Boolean(product.variants && product.variants.length > 1);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0 || hasMultipleVariants) return;

    setIsAdding(true);
    addItem(product, 1);
    openDrawer();
    setTimeout(() => setIsAdding(false), 500);
  };

  const isOutOfStock = product.stock <= 0;
  const productTitle = product.title || product.name || "Sản phẩm";
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white border border-[#CBD5E1] rounded-xl overflow-hidden hover:border-[#111827] hover:shadow-md transition-all duration-200">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {discountPercent > 0 ? (
          <span className="px-2 py-0.5 text-xs font-semibold bg-[#F97316] text-white rounded-md tracking-tight">
            -{discountPercent}%
          </span>
        ) : (
          <span />
        )}

        {isOutOfStock ? (
          <span className="px-2 py-0.5 text-xs font-medium bg-[#111827]/80 text-white rounded-md backdrop-blur-xs">
            Hết hàng
          </span>
        ) : product.stock < 10 ? (
          <span className="px-2 py-0.5 text-xs font-medium bg-[#FACC15] text-[#111827] rounded-md">
            Còn {product.stock} món
          </span>
        ) : null}
      </div>

      {/* Image Container with 1:1 Ratio */}
      <Link href={`/products/${product.handle}`} className="relative block aspect-square bg-[#F8FAFC] overflow-hidden">
        <Image
          src={imgSrc}
          alt={productTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgSrc("/images/placeholder.svg")}
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Activity Tags */}
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[#64748B]">
            <span className="font-semibold text-[#111827] uppercase tracking-wider">
              {product.brand}
            </span>
            {product.activity && (
              <>
                <span>•</span>
                <span className="capitalize">{product.activity}</span>
              </>
            )}
            {product.weightFormatted && (
              <>
                <span>•</span>
                <span className="tabular-nums font-mono text-[11px] text-[#64748B]">
                  {product.weightFormatted}
                </span>
              </>
            )}
          </div>

          {/* Product Title (Max 2 lines) */}
          <Link href={`/products/${product.handle}`}>
            <h3 className="text-sm font-semibold text-[#111827] leading-snug line-clamp-2 hover:text-[#F97316] transition-colors mb-2">
              {productTitle}
            </h3>
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#CBD5E1]/50 mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#111827] tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#64748B] line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.handle}`}
              className="w-full text-center py-2 px-3 text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors"
            >
              Chi tiết
            </Link>
            {hasMultipleVariants && !isOutOfStock ? (
              <Link
                href={`/products/${product.handle}`}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 bg-[#111827] text-white hover:bg-[#F97316] text-center"
              >
                Chọn loại
              </Link>
            ) : (
              <button
                onClick={handleQuickAdd}
                disabled={isOutOfStock || isAdding}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  isOutOfStock
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c]"
                }`}
              >
                {isOutOfStock ? "Hết" : isAdding ? "Đã thêm" : "+ Giỏ hàng"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
