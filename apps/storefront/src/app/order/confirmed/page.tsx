import React from "react";
import Link from "next/link";
import { storeApi } from "@/lib/api";
import { SITE_LEGAL } from "@/config/site-legal";

interface OrderConfirmedProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedProps) {
  const { id } = await searchParams;

  let order = null;
  if (id) {
    order = await storeApi.getOrder(id);
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const orderId = order?.id || id || `PG-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-8899`;

  return (
    <div className="bg-[#F8FAFC] py-12 lg:py-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 shadow-xs text-center mb-8">
          <div className="w-16 h-16 bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#16A34A]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-[#111827] text-xs font-semibold mb-3">
            Giao dịch thành công
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-2">
            Cảm Ơn Quý Khách Đã Đặt Hàng!
          </h1>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto mb-6">
            Đơn hàng của quý khách đã được tiếp nhận vào hệ thống kho vận PeakGear và đang được nhân viên chuẩn bị đóng gói.
          </p>

          <div className="inline-flex items-center gap-2 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono">
            <span className="text-[#64748B]">Mã đơn hàng:</span>
            <span className="font-bold text-[#111827] text-sm">{orderId}</span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] pb-3 border-b border-[#CBD5E1] mb-5">
            Thông Tin Chi Tiết Đơn Hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-6">
            <div>
              <span className="text-[#64748B] block mb-1">Người nhận hàng:</span>
              <div className="font-bold text-[#111827]">{order?.customer.first_name || "Quý khách hàng"}</div>
              <div className="text-[#64748B]">{order?.customer.phone || "09xx xxx xxx"}</div>
              <div className="text-[#64748B]">{order?.customer.email || "email@domain.com"}</div>
            </div>

            <div>
              <span className="text-[#64748B] block mb-1">Địa chỉ nhận hàng:</span>
              <div className="font-semibold text-[#111827]">
                {order?.shipping_address.address_1 || "Địa chỉ nhận hàng đã đăng ký"}
              </div>
              <div className="text-[#64748B]">
                {order?.shipping_address.province}, {order?.shipping_address.city}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-4 border-t border-[#CBD5E1]/60 mb-6">
            <div>
              <span className="text-[#64748B] block mb-1">Phương thức vận chuyển:</span>
              <div className="font-semibold text-[#111827]">
                {order?.shipping_method.name || "Giao Tiêu Chuẩn Toàn Quốc"}
              </div>
              <div className="text-[#16A34A] font-medium mt-0.5">
                Dự kiến giao trong 2 - 4 ngày làm việc
              </div>
            </div>

            <div>
              <span className="text-[#64748B] block mb-1">Phương thức thanh toán:</span>
              <div className="font-semibold text-[#111827] uppercase">
                {order?.payment_method === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : order?.payment_method === "bank_transfer"
                  ? "Chuyển khoản VietQR"
                  : "Thẻ ngân hàng"}
              </div>
              <div className="text-[#64748B] mt-0.5">
                {order?.payment_status === "captured" ? "Đã thanh toán" : "Chờ thanh toán khi nhận hàng"}
              </div>
            </div>
          </div>

          {/* Items summary */}
          {order?.items && order.items.length > 0 && (
            <div className="pt-4 border-t border-[#CBD5E1]/60 mb-6">
              <span className="text-xs font-bold text-[#111827] block mb-3">Sản phẩm trong đơn:</span>
              <div className="space-y-2 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-[#111827]">
                      {item.title} <span className="text-[#64748B]">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-[#111827] tabular-nums">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total summary */}
          <div className="pt-4 border-t border-[#CBD5E1] flex justify-between items-baseline">
            <div>
              <span className="text-sm font-bold text-[#111827]">Tổng số tiền thanh toán:</span>
              <div className="text-[11px] text-[#16A34A]">Đã bao gồm thuế GTGT (VAT 8%)</div>
            </div>
            <span className="text-2xl font-black text-[#111827] tabular-nums">
              {formatPrice(order?.total || 0)}
            </span>
          </div>
        </div>

        {/* Customer Support Notice & Navigation */}
        <div className="bg-[#111827] text-white rounded-2xl p-6 text-center mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-[#FACC15]">
            Hỗ Trợ Khách Hàng 24/7
          </h3>
          <p className="text-xs text-slate-300 mb-3">
            Nếu cần thay đổi địa chỉ hoặc thời gian nhận hàng, quý khách vui lòng liên hệ tổng đài:
          </p>
          <div className="text-base font-bold tracking-wider text-[#F97316]">
            HOTLINE: {SITE_LEGAL.hotline}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/collections/all"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs font-bold bg-[#F97316] text-white hover:bg-[#ea580c] transition-colors"
          >
            Tiếp tục mua sắm trang bị
          </Link>
          <Link
            href="/policies/chinh-sach-doi-tra-hoan-tien"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs font-semibold bg-white border border-[#CBD5E1] text-[#111827] hover:bg-slate-50 transition-colors"
          >
            Chính sách đổi trả &amp; Bảo hành
          </Link>
        </div>
      </div>
    </div>
  );
}
