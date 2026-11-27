"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bundle } from "@/types/storefront";
import { useCart } from "@/lib/cart-context";

interface BundleCardProps {
  bundle: Bundle;
}

export function BundleCard({ bundle }: BundleCardProps) {
  const { addBundle, openDrawer } = useCart();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const handleAddBundle = () => {
    addBundle(bundle);
    openDrawer();
  };

  const discount = bundle.discountPercent ?? bundle.discountPercentage;
  const bundlePrice = bundle.bundlePrice ?? bundle.price;
  const savings = bundle.savingsAmount ?? bundle.savings;
  const weightFormatted =
    bundle.totalWeightFormatted ??
    (bundle.totalWeightGrams > 1000
      ? `${(bundle.totalWeightGrams / 1000).toFixed(1)}kg`
      : `${bundle.totalWeightGrams}g`);

  return (
    <div className="flex flex-col bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden hover:border-[#111827] hover:shadow-lg transition-all duration-200">
      {/* Top Banner Tag */}
      <div className="bg-[#111827] text-white px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15]">
            Gói Tiết Kiệm {discount}%
          </span>
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-300">
          Tổng TL: {weightFormatted}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-[#64748B] uppercase tracking-wide">
              {bundle.activity}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-[#64748B]">
              {bundle.components.length} trang bị trọn bộ
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#111827] mb-2 leading-snug">
            {bundle.title}
          </h3>
          <p className="text-xs text-[#64748B] mb-4 line-clamp-2">
            {bundle.description}
          </p>

          {/* Component Item Thumbnails */}
          <div className="mb-4">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Bao gồm trong bộ:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {bundle.components.map((comp) => {
                const img = comp.thumbnail || comp.image || "/images/placeholder.svg";
                const title = comp.title || comp.name;
                const weight =
                  comp.weightFormatted ||
                  (comp.weightGrams ? `${comp.weightGrams}g` : "400g");

                return (
                  <div
                    key={comp.productId}
                    className="p-2 border border-[#CBD5E1]/60 rounded-lg bg-[#F8FAFC] flex flex-col items-center text-center group"
                  >
                    <div className="relative w-12 h-12 mb-1.5">
                      <Image
                        src={img}
                        alt={title}
                        fill
                        quality={95}
                        sizes="96px"
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-[#111827] line-clamp-1">
                      {title}
                    </span>
                    <span className="text-[9px] text-[#64748B] tabular-nums">
                      x{comp.quantity} • {weight}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-[#CBD5E1]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xl font-bold text-[#111827] tabular-nums">
                {formatPrice(bundlePrice)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] line-through tabular-nums">
                  {formatPrice(bundle.originalPrice)}
                </span>
                <span className="text-xs font-semibold text-[#16A34A] tabular-nums">
                  Tiết kiệm {formatPrice(savings)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/bundles/${bundle.handle}`}
              className="w-full text-center py-2.5 px-3 text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg hover:bg-slate-100 transition-colors"
            >
              Xem chi tiết
            </Link>
            <button
              onClick={handleAddBundle}
              className="w-full py-2.5 px-3 text-xs font-semibold rounded-lg bg-[#F97316] text-white hover:bg-[#ea580c] transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              + Chọn trọn bộ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
