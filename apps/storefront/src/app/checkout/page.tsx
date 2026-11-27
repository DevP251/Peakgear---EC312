"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { storeApi } from "@/lib/api";
import type { ShippingOption } from "@/types/storefront";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  // Step 1: Contact
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Shipping Address
  const [province, setProvince] = useState("Thành phố Hồ Chí Minh");
  const [district, setDistrict] = useState("Thành phố Thủ Đức");
  const [ward, setWard] = useState("Phường Linh Trung");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  // Step 3: Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer" | "card">("cod");

  // Step 5: Mandatory Legal Agreement Checkbox (Unchecked by default per Decree 52/2013 and Decree 13/2023)
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);

  useEffect(() => {
    storeApi.getShippingOptions(cart.subtotal).then(setShippingOptions).catch(() => {});
  }, [cart.subtotal]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  // Decoupled business calculations from storeApi adapter
  const checkoutTotals = storeApi.calculateCheckoutTotals(cart, shippingMethod);
  const { subtotal, discountTotal, shippingTotal, total: grandTotal } = checkoutTotals;
  const itemCount = cart.itemCount ?? cart.items.reduce((acc, it) => acc + it.quantity, 0);

  // VN Phone number regex: 10 digits starting with 03, 05, 07, 08, 09 or +84
  const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Vui lòng nhập địa chỉ email hợp lệ để nhận thông tin đơn hàng.";
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Vui lòng nhập họ và tên người nhận hàng.";
    }

    if (!phone.trim() || !vnPhoneRegex.test(phone.trim())) {
      errs.phone = "Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09).";
    }

    if (!address.trim() || address.trim().length < 5) {
      errs.address = "Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường, khu phố).";
    }

    if (!agreeTerms) {
      errs.terms = "Quý khách bắt buộc phải đọc và đồng ý với Điều kiện giao dịch chung và Chính sách bảo vệ dữ liệu cá nhân trước khi hoàn tất đặt hàng.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return;

    if (!validate()) {
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await storeApi.createOrder({
        customer: {
          email: email.trim(),
          first_name: fullName.trim(),
          phone: phone.trim(),
        },
        shipping_address: {
          first_name: fullName.trim(),
          address_1: address.trim(),
          city: province,
          province: district,
          postal_code: "70000",
          country_code: "vn",
          phone: phone.trim(),
        },
        items: cart.items.map((item) => ({
          title: item.title || item.name || item.product?.title || "Sản phẩm",
          quantity: item.quantity,
          unit_price: item.price || item.unitPrice || 0,
          thumbnail: item.thumbnail || item.image || item.product?.thumbnail,
        })),
        shipping_method: {
          name: shippingMethod === "express" ? "Giao Hỏa Tốc 2H Nội Thành" : "Giao Tiêu Chuẩn Toàn Quốc",
          price: shippingTotal,
        },
        payment_method: paymentMethod,
        subtotal,
        discount_total: discountTotal,
        shipping_total: shippingTotal,
        total: grandTotal,
      });

      // Clear local cart
      clearCart();

      // Redirect to Order Confirmed
      router.push(`/order/confirmed?id=${order.id}`);
    } catch (error) {
      console.error("Order creation error:", error);
      setErrors({ form: "Có lỗi xảy ra trong quá trình xử lý đơn hàng. Vui lòng thử lại sau giây lát." });
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#F8FAFC] min-h-[60vh] flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-[#111827] mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-[#64748B] mb-6">Vui lòng chọn sản phẩm trước khi tiến hành thanh toán.</p>
          <Link
            href="/collections/all"
            className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-xs bg-[#F97316] text-white"
          >
            Quay lại cửa hàng
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
          <Link href="/cart" className="hover:text-[#111827] transition-colors">
            Giỏ hàng
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827]">Thanh toán đơn hàng</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-8">
          Tiến Hành Đặt Hàng & Thanh Toán
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: 5 STEPS */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: CONTACT INFO */}
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#CBD5E1]">
                  <span className="w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-[#111827] uppercase tracking-wide">
                    Thông Tin Khách Hàng
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">
                      Địa chỉ Email <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vd: nguyenvana@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:bg-white focus:outline-none focus:border-[#111827]"
                    />
                    {errors.email && <p className="text-[11px] text-[#DC2626] mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#111827] mb-1">
                        Họ và tên người nhận <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:bg-white focus:outline-none focus:border-[#111827]"
                      />
                      {errors.fullName && <p className="text-[11px] text-[#DC2626] mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[#111827] mb-1">
                        Số điện thoại liên hệ <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:bg-white focus:outline-none focus:border-[#111827]"
                      />
                      {errors.phone && <p className="text-[11px] text-[#DC2626] mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: SHIPPING ADDRESS */}
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#CBD5E1]">
                  <span className="w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-[#111827] uppercase tracking-wide">
                    Địa Chỉ Giao Hàng
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-[#111827] mb-1">Tỉnh / Thành phố</label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:outline-none focus:border-[#111827]"
                      >
                        <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
                        <option value="Thành phố Hà Nội">Thành phố Hà Nội</option>
                        <option value="Thành phố Đà Nẵng">Thành phố Đà Nẵng</option>
                        <option value="Tỉnh Lâm Đồng">Tỉnh Lâm Đồng</option>
                        <option value="Tỉnh Bình Dương">Tỉnh Bình Dương</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#111827] mb-1">Quận / Huyện</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:outline-none focus:border-[#111827]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#111827] mb-1">Phường / Xã</label>
                      <input
                        type="text"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:outline-none focus:border-[#111827]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">
                      Địa chỉ cụ thể (Số nhà, tên đường) <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="vd: Khu phố 6, Đường Hàn Thuyên"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:bg-white focus:outline-none focus:border-[#111827]"
                    />
                    {errors.address && <p className="text-[11px] text-[#DC2626] mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] mb-1">Ghi chú giao hàng (nếu có)</label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="vd: Giao giờ hành chính, gọi trước khi giao"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111827] focus:bg-white focus:outline-none focus:border-[#111827]"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: SHIPPING METHOD */}
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#CBD5E1]">
                  <span className="w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-[#111827] uppercase tracking-wide">
                    Phương Thức Vận Chuyển
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  {shippingOptions.length > 0 ? (
                    shippingOptions.map((opt) => {
                      const isSelected = shippingMethod === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#111827] bg-slate-50 ring-1 ring-[#111827]"
                              : "border-[#CBD5E1] hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => setShippingMethod(opt.id as "standard" | "express")}
                              className="text-[#F97316] focus:ring-[#F97316]"
                            />
                            <div>
                              <div className="font-bold text-[#111827] flex items-center gap-2">
                                <span>{opt.name}</span>
                                {opt.id === "express" && (
                                  <span className="px-1.5 py-0.5 rounded bg-[#FACC15] text-[#111827] text-[10px] font-bold">
                                    Nhanh Nhất
                                  </span>
                                )}
                              </div>
                              <div className="text-[#64748B]">{opt.description || opt.estimatedDelivery}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            {opt.price === 0 ? (
                              <span className="font-bold text-[#16A34A]">Miễn phí</span>
                            ) : (
                              <span className="font-bold text-[#111827] tabular-nums">{formatPrice(opt.price)}</span>
                            )}
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <label
                      className="flex items-center justify-between p-4 rounded-xl border border-[#111827] bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked
                          readOnly
                          className="text-[#F97316]"
                        />
                        <div>
                          <div className="font-bold text-[#111827]">Giao Tiêu Chuẩn Toàn Quốc</div>
                          <div className="text-[#64748B]">Dự kiến nhận hàng trong 2 - 4 ngày</div>
                        </div>
                      </div>
                      <span className="font-bold text-[#16A34A]">Miễn phí</span>
                    </label>
                  )}
                </div>
              </div>

              {/* STEP 4: PAYMENT METHOD */}
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#CBD5E1]">
                  <span className="w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="text-base font-bold text-[#111827] uppercase tracking-wide">
                    Phương Thức Thanh Toán
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#111827] bg-slate-50 ring-1 ring-[#111827]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-0.5 text-[#F97316] focus:ring-[#F97316]"
                    />
                    <div>
                      <div className="font-bold text-[#111827]">Thanh toán tiền mặt khi nhận hàng (COD)</div>
                      <div className="text-[#64748B] mt-0.5">
                        Kiểm tra hàng (đồng kiểm ngoại quan) và thanh toán trực tiếp cho nhân viên bưu tá.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-[#111827] bg-slate-50 ring-1 ring-[#111827]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="mt-0.5 text-[#F97316] focus:ring-[#F97316]"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[#111827] flex items-center gap-2">
                        <span>Chuyển khoản ngân hàng qua VietQR</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold">
                          Xác nhận tự động 24/7
                        </span>
                      </div>
                      <div className="text-[#64748B] mt-0.5">
                        Quét mã QR tiện lợi bằng mọi ứng dụng ngân hàng hoặc ví điện tử.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-[#111827] bg-slate-50 ring-1 ring-[#111827]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-0.5 text-[#F97316] focus:ring-[#F97316]"
                    />
                    <div>
                      <div className="font-bold text-[#111827]">Thẻ ATM nội địa / Visa / Master / JCB</div>
                      <div className="text-[#64748B] mt-0.5">
                        Bảo mật mã hóa chuẩn PCI-DSS qua cổng thanh toán bảo mật.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* STEP 5: MANDATORY LEGAL COMPLIANCE CLAUSE */}
              <div
                className={`bg-white border rounded-2xl p-6 shadow-xs transition-colors ${
                  errors.terms ? "border-[#DC2626] bg-red-50/20" : "border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="termsAgreementCheckbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (e.target.checked && errors.terms) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.terms;
                          return n;
                        });
                      }
                    }}
                    className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                  />
                  <label htmlFor="termsAgreementCheckbox" className="text-xs text-[#111827] leading-relaxed cursor-pointer select-none">
                    <span className="font-bold">Bắt buộc:</span> Tôi đã đọc kỹ, hiểu rõ quyền và nghĩa vụ của người mua hàng, và hoàn toàn đồng ý với{" "}
                    <Link
                      href="/policies/dieu-kien-giao-dich-chung"
                      target="_blank"
                      className="font-bold text-[#F97316] underline hover:text-[#ea580c]"
                    >
                      Điều kiện giao dịch chung
                    </Link>{" "}
                    cùng{" "}
                    <Link
                      href="/policies/bao-ve-thong-tin-ca-nhan"
                      target="_blank"
                      className="font-bold text-[#F97316] underline hover:text-[#ea580c]"
                    >
                      Chính sách bảo vệ thông tin cá nhân
                    </Link>{" "}
                    (theo Nghị định 52/2013/NĐ-CP &amp; Nghị định 13/2023/NĐ-CP) của PeakGear.
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-[11px] font-semibold text-[#DC2626] mt-2 pl-7">
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & SUBMIT */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs sticky top-24">
                <h2 className="text-base font-bold uppercase tracking-wider text-[#111827] pb-4 border-b border-[#CBD5E1] mb-5">
                  Đơn Hàng Của Bạn ({itemCount} món)
                </h2>

                {/* Items mini list */}
                <div className="max-h-64 overflow-y-auto divide-y divide-[#CBD5E1]/50 mb-5 pr-1">
                  {cart.items.map((item) => {
                    const img = item.thumbnail || item.image || item.product?.thumbnail || "/images/placeholder.svg";
                    const title = item.title || item.name || item.product?.title || "Sản phẩm";
                    const unitPrice = item.price || item.unitPrice || 0;

                    return (
                      <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                        <div className="relative w-12 h-12 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] overflow-hidden shrink-0">
                          <Image
                            src={img}
                            alt={title}
                            fill
                            quality={95}
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#111827] truncate">{title}</div>
                          <div className="text-[#64748B] tabular-nums">
                            SL: {item.quantity} x {formatPrice(unitPrice)}
                          </div>
                        </div>
                        <div className="font-bold text-[#111827] tabular-nums text-right">
                          {formatPrice(unitPrice * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs pt-4 border-t border-[#CBD5E1] mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Tạm tính hàng hóa</span>
                    <span className="font-semibold text-[#111827] tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discountTotal > 0 && (
                    <div className="flex justify-between text-[#16A34A] font-semibold">
                      <span>Chiết khấu gói Bundle</span>
                      <span className="tabular-nums">-{formatPrice(discountTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[#64748B]">
                      Phí vận chuyển ({shippingMethod === "express" ? "Hỏa tốc 2H" : "Tiêu chuẩn"})
                    </span>
                    <span className="font-semibold text-[#111827] tabular-nums">
                      {shippingTotal === 0 ? <span className="text-[#16A34A]">Miễn phí</span> : formatPrice(shippingTotal)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#CBD5E1] flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-[#111827]">Tổng thanh toán</span>
                      <div className="text-[11px] text-[#16A34A] font-medium mt-0.5">
                        Đã bao gồm thuế GTGT (VAT 8%)
                      </div>
                    </div>
                    <span className="text-2xl font-black text-[#111827] tabular-nums">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {errors.form && (
                  <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626]">
                    {errors.form}
                  </div>
                )}

                {/* Submit button with anti-double-submit protection */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full min-h-[48px] py-4 px-6 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-slate-400 cursor-wait"
                      : "bg-[#F97316] hover:bg-[#ea580c] active:bg-[#c2410c] shadow-orange-500/20"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      ĐANG XỬ LÝ ĐẶT HÀNG...
                    </>
                  ) : (
                    <>
                      XÁC NHẬN ĐẶT HÀNG NGAY
                      <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#64748B] text-center mt-3">
                  Quý khách sẽ nhận được email xác nhận ngay khi đơn hàng được ghi nhận vào hệ thống.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
