import React, { Suspense } from "react";
import { storeApi } from "@/lib/api";
import { GearFinderWizard } from "@/components/finder/GearFinderWizard";

export const metadata = {
  title: "Smart Gear-Finder | PeakGear Equipment Advisor",
  description: "Hệ thống tư vấn định vị trang bị dã ngoại 60s theo chuẩn tải trọng The Big Three.",
};

export default async function GearFinderPage() {
  const questions = await storeApi.getFinderConfig("outdoor");

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#F97316] mb-2">
            TECHNICAL EDITORIAL ADVISOR • HYPERLITE METHOD
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mb-3">
            Hệ Thống Định Vị Trang Bị Dã Ngoại
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Trả lời các câu hỏi kỹ thuật bên dưới. Hệ thống sẽ tính toán thể tích balo, khả năng kháng thời tiết và gợi ý bộ trang bị chính xác nhất cho chuyến đi của bạn.
          </p>
        </div>

        {/* Wizard Engine (Wrapped in Suspense for useSearchParams) */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs text-[#64748B]">
              Đang tải hệ thống câu hỏi định vị trang bị...
            </div>
          }
        >
          <GearFinderWizard questions={questions} />
        </Suspense>
      </div>
    </div>
  );
}
