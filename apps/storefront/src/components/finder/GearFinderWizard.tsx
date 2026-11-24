"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FinderQuestion } from "@/types/storefront";
import { storeApi } from "@/lib/api";

interface GearFinderWizardProps {
  questions: FinderQuestion[];
}

export function GearFinderWizard({ questions }: GearFinderWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [answers, setAnswers] = useState<Record<string, string | number | boolean | string[]>>({
    activity_terrain: "weekend_trek",
    duration_days: 2,
    group_size: 2,
    climate_temp: "mild_temperate",
    need_cooking: true,
    cooking_preferences: ["pot_set", "gas_stove"],
    carry_priority: "comfort",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Restore answers from sessionStorage if present or reset if query has reset=1
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (searchParams.get("reset") === "1") {
        sessionStorage.removeItem("pg_finder_answers");
      } else {
        const saved = sessionStorage.getItem("pg_finder_answers");
        if (saved) {
          try {
            setAnswers((prev) => ({ ...prev, ...JSON.parse(saved) }));
          } catch {
            // ignore
          }
        }
      }
      setIsLoaded(true);
    }
  }, [searchParams]);

  // Persist answers
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      sessionStorage.setItem("pg_finder_answers", JSON.stringify(answers));
    }
  }, [answers, isLoaded]);

  // Dynamic dependsOn filter to calculate visible questions
  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (!q.dependsOn) return true;
      const parentVal = answers[q.dependsOn.questionId];
      if (q.dependsOn.operator === "not_equals") {
        return parentVal !== q.dependsOn.value;
      }
      if (q.dependsOn.operator === "in" && Array.isArray(q.dependsOn.value)) {
        return (q.dependsOn.value as unknown[]).includes(parentVal);
      }
      return parentVal === q.dependsOn.value;
    });
  }, [questions, answers]);

  // Ensure currentIndex stays within bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, visibleQuestions.length - 1));
  const currentQ = visibleQuestions[safeIndex];

  // No Config State: gracefully display fallback message + CTA to catalog
  if (isLoaded && questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#CBD5E1] flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
          ⚙️
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-2">Tư vấn đang được hoàn thiện</h2>
        <p className="text-xs text-[#64748B] mb-6 leading-relaxed">
          Hệ thống câu hỏi kỹ thuật cho hoạt động này đang được nhóm sản phẩm cập nhật. Quý khách vui lòng khám phá trực tiếp các trang bị leo núi &amp; dã ngoại trong danh mục.
        </p>
        <Link
          href="/collections/all"
          className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-xs bg-[#111827] text-white hover:bg-[#F97316] transition-colors"
        >
          Khám phá danh mục sản phẩm
        </Link>
      </div>
    );
  }

  // Loading Config State: Skeleton placeholder
  if (!isLoaded || !currentQ) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-4 skeleton w-1/3" />
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-8 space-y-4">
          <div className="h-6 skeleton w-2/3" />
          <div className="h-4 skeleton w-1/2" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="h-28 skeleton rounded-2xl" />
            <div className="h-28 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const isFirstStep = safeIndex === 0;
  const isLastStep = safeIndex === visibleQuestions.length - 1;

  // Validation check for current question
  const isCurrentValid = () => {
    if (!currentQ.required) return true;
    if (currentQ.type === "info") return true;

    const val = answers[currentQ.id];
    if (currentQ.type === "boolean") return typeof val === "boolean";
    if (currentQ.type === "number" || currentQ.type === "range") {
      return typeof val === "number" && !isNaN(val);
    }
    if (currentQ.type === "multi_select") {
      return Array.isArray(val) && val.length > 0;
    }
    return val !== undefined && val !== null && String(val).trim() !== "";
  };

  const handleNext = () => {
    if (!isCurrentValid()) {
      setValidationError("Vui lòng chọn hoặc hoàn tất câu trả lời bắt buộc trước khi tiếp tục.");
      return;
    }
    setValidationError(null);
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentIndex((prev) => Math.min(visibleQuestions.length - 1, prev + 1));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (!isFirstStep) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleSkip = () => {
    setValidationError(null);
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentIndex((prev) => Math.min(visibleQuestions.length - 1, prev + 1));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const rec = await storeApi.submitFinderAnswers(answers);
      setTimeout(() => {
        router.push(`/gear-finder/results/${rec.id}`);
      }, 1200);
    } catch (e) {
      console.error("Finder submit error:", e);
      setIsSubmitting(false);
      setSubmitError("Có lỗi xảy ra trong quá trình tính toán kết quả tư vấn. Vui lòng bấm thử lại.");
    }
  };

  const progressPercent = Math.round(((safeIndex + 1) / visibleQuestions.length) * 100);

  // Technical Calculation Shimmer Screen
  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#111827] text-[#F97316] flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-700">
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-[#111827] mb-2">
          Đang Phân Tích &amp; Tối Ưu Tải Trọng Trang Bị...
        </h2>
        <p className="text-xs text-[#64748B] max-w-md mx-auto mb-8">
          Thuật toán đang tính toán thể tích balo, phân bổ bộ The Big Three và kiểm tra tương thích thời tiết.
        </p>

        {/* Shimmer Skeletons (Zero AI-Glow) */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="h-4 skeleton w-full" />
          <div className="h-4 skeleton w-4/5 mx-auto" />
          <div className="h-4 skeleton w-3/5 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* API Error Retry Banner */}
      {submitError && (
        <div role="alert" className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{submitError}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white font-bold hover:bg-red-700 transition-colors shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Top Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-[#64748B] uppercase tracking-wider">
            Câu Hỏi {safeIndex + 1} / {visibleQuestions.length}
          </span>
          <span className="text-[#111827] font-mono tabular-nums">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#111827] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card (Hyperlite Technical Minimalist Style) */}
      <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
        <div className="mb-6">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#F97316] mb-2">
            {currentQ.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight leading-snug mb-3">
            {currentQ.title}
          </h1>
          {currentQ.description && (
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {currentQ.description}
            </p>
          )}
        </div>

        {/* Dynamic Input Renderers */}
        <div className="py-2">
          {/* TYPE 1: SINGLE SELECT */}
          {currentQ.type === "single_select" && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.value }))}
                    className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#111827] bg-[#111827]/5 ring-1 ring-[#111827]"
                        : "border-[#CBD5E1] bg-white hover:border-slate-400 hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{opt.icon || "⛰️"}</span>
                        {opt.tag && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#111827]">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#111827] mb-1">{opt.label}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">{opt.description}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className={isSelected ? "font-bold text-[#111827]" : "text-slate-400"}>
                        {isSelected ? "Đã chọn" : "Nhấn để chọn"}
                      </span>
                      {isSelected && <span className="font-bold text-[#111827]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 2: MULTI SELECT */}
          {currentQ.type === "multi_select" && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt) => {
                const currentVals: string[] = Array.isArray(answers[currentQ.id]) ? (answers[currentQ.id] as string[]) : [];
                const isSelected = currentVals.includes(opt.value);

                const toggleOption = () => {
                  setAnswers((prev) => {
                    const existing: string[] = Array.isArray(prev[currentQ.id]) ? (prev[currentQ.id] as string[]) : [];
                    const next = isSelected
                      ? existing.filter((v) => v !== opt.value)
                      : [...existing, opt.value];
                    return { ...prev, [currentQ.id]: next };
                  });
                };

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={toggleOption}
                    className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#111827] bg-[#111827]/5 ring-1 ring-[#111827]"
                        : "border-[#CBD5E1] bg-white hover:border-slate-400 hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{opt.icon || "📦"}</span>
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border text-xs font-bold ${
                            isSelected ? "bg-[#111827] border-[#111827] text-white" : "border-slate-400"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-[#111827] mb-1">{opt.label}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 3: NUMBER STEPPER */}
          {currentQ.type === "number" && (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-3">
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQ.id]: Math.max(currentQ.min || 1, (Number(prev[currentQ.id]) || 2) - 1),
                    }))
                  }
                  className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] font-bold text-lg text-[#111827] hover:bg-slate-100 transition-colors shadow-xs"
                >
                  -
                </button>
                <div className="w-28 text-center">
                  <div className="text-3xl font-black text-[#111827] tabular-nums font-mono">
                    {String(answers[currentQ.id] ?? currentQ.defaultValue ?? 2)}
                  </div>
                  <div className="text-xs font-semibold text-[#64748B]">{currentQ.unit || "ngày"}</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQ.id]: Math.min(currentQ.max || 14, (Number(prev[currentQ.id]) || 2) + 1),
                    }))
                  }
                  className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] font-bold text-lg text-[#111827] hover:bg-slate-100 transition-colors shadow-xs"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-[#64748B] mt-4">
                Phạm vi khuyến nghị: {currentQ.min || 1} đến {currentQ.max || 14} {currentQ.unit}
              </p>
            </div>
          )}

          {/* TYPE 4: RANGE SLIDER */}
          {currentQ.type === "range" && (
            <div className="py-6 max-w-md mx-auto">
              <div className="text-center mb-4">
                <span className="text-4xl font-black text-[#111827] font-mono tabular-nums">
                  {String(answers[currentQ.id] ?? currentQ.defaultValue ?? 2)}
                </span>
                <span className="text-sm font-semibold text-[#64748B] ml-2">{currentQ.unit || "người"}</span>
              </div>
              <input
                type="range"
                min={currentQ.min || 1}
                max={currentQ.max || 10}
                step={currentQ.stepSize || 1}
                value={Number(answers[currentQ.id] ?? currentQ.defaultValue ?? 2)}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQ.id]: parseInt(e.target.value, 10) }))
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#111827]"
              />
              <div className="flex justify-between text-xs text-[#64748B] mt-2 font-mono">
                <span>{currentQ.min || 1} {currentQ.unit}</span>
                <span>{currentQ.max || 10} {currentQ.unit}</span>
              </div>
            </div>
          )}

          {/* TYPE 5: BOOLEAN SWITCH */}
          {currentQ.type === "boolean" && (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto py-4">
              <button
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: true }))}
                className={`p-6 rounded-2xl border-2 text-center transition-all ${
                  answers[currentQ.id] === true
                    ? "border-[#111827] bg-[#111827]/5 ring-1 ring-[#111827]"
                    : "border-[#CBD5E1] bg-white hover:border-slate-400"
                }`}
              >
                <span className="text-2xl block mb-2">🍳</span>
                <span className="text-sm font-bold text-[#111827] block">CÓ NẤU ĂN</span>
                <span className="text-xs text-[#64748B] block mt-1">Cần trang bị bếp &amp; nồi</span>
              </button>

              <button
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: false }))}
                className={`p-6 rounded-2xl border-2 text-center transition-all ${
                  answers[currentQ.id] === false
                    ? "border-[#111827] bg-[#111827]/5 ring-1 ring-[#111827]"
                    : "border-[#CBD5E1] bg-white hover:border-slate-400"
                }`}
              >
                <span className="text-2xl block mb-2">🥪</span>
                <span className="text-sm font-bold text-[#111827] block">KHÔNG NẤU</span>
                <span className="text-xs text-[#64748B] block mt-1">Dùng đồ ăn khô chế biến sẵn</span>
              </button>
            </div>
          )}

          {/* TYPE 6: INFO TECHNICAL ADVISORY */}
          {currentQ.type === "info" && (
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
                <span className="text-lg">⚖️</span>
                <span>Tiêu Chuẩn Tải Trọng Quốc Tế</span>
              </div>
              <p className="text-[#64748B] leading-relaxed">
                {currentQ.infoContent || currentQ.description}
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[#111827] font-medium">
                ✓ Balo đề xuất sẽ được tự động giới hạn tải trọng theo đúng thể tích cung đường của bạn.
              </div>
            </div>
          )}
        </div>

        {/* Validation Error Banner right next to controls */}
        {validationError && (
          <div role="alert" className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-[#DC2626] flex items-center gap-2">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Wizard Bottom Controls */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {!isFirstStep && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#111827] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors"
            >
              ← Quay lại
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!currentQ.required && (
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#111827] transition-colors"
            >
              Bỏ qua bước này
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentValid()}
            className={`px-7 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
              isCurrentValid()
                ? "bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c] shadow-orange-500/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
            }`}
          >
            {isLastStep ? "TÍNH TOÁN & XEM ĐỀ XUẤT TRANG BỊ" : "TIẾP TỤC"}
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
