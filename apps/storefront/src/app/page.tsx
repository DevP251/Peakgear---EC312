import React from "react";
import Link from "next/link";
import Image from "next/image";
import { storeApi } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { BundleCard } from "@/components/bundle/BundleCard";

export default async function HomePage() {
  // Fetch initial featured products and bundles via decoupled Store API
  const [productsRes, bundles] = await Promise.all([
    storeApi.getProducts({ limit: 8, sort: "rating" }),
    storeApi.getBundles(),
  ]);

  const featuredProducts = productsRes.products || [];

  const activityCategories = [
    {
      handle: "trekking",
      title: "Trekking Khắc Nghiệt",
      desc: "Trang bị chuyên sâu cho hành trình dài ngày, địa hình hiểm trở và tải trọng lớn.",
      badge: "Kỹ Thuật Cao",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop",
    },
    {
      handle: "hiking",
      title: "Hiking Cuối Tuần",
      desc: "Gọn nhẹ, thoáng khí và cơ động cho những cung đường dốc ngắn và dạo bộ địa hình.",
      badge: "Siêu Nhẹ & Thoáng Khí",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&auto=format&fit=crop",
    },
    {
      handle: "camping",
      title: "Cắm Trại & Sinh Tồn",
      desc: "Lều trại, túi ngủ ấm áp, bếp nấu dã ngoại và phụ kiện tiện nghi ngoài trời.",
      badge: "Tiện Nghi & Bền Bỉ",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 2: HERO CHÍNH SPORT / PERFORMANCE */}
      <section className="relative bg-[#111827] text-white overflow-hidden py-20 lg:py-28 border-b border-[#CBD5E1]/20">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop"
            alt="PeakGear Outdoor Background"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FACC15] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
              Tiêu Chuẩn Outdoor & Sports Toàn Cầu
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
              CHINH PHỤC MỌI ĐỊA HÌNH VỚI TRANG BỊ CHUẨN KỸ THUẬT
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              Tuyển chọn hơn 400 trang bị chuyên dụng từ Decathlon & FanFan. Tối ưu trọng lượng, bền bỉ trong mọi điều kiện thời tiết khắc nghiệt tại Việt Nam.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-bold text-white bg-[#F97316] hover:bg-[#ea580c] active:bg-[#c2410c] transition-colors shadow-lg shadow-[#F97316]/20"
              >
                Khám phá sản phẩm
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a
                href="#activities"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-white/5 border border-white/20 hover:bg-white/10 transition-colors"
              >
                Chọn theo hoạt động
              </a>
            </div>

            {/* Quick Specs Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-white/10 text-xs">
              <div>
                <div className="font-bold text-white text-base tabular-nums">400+</div>
                <div className="text-slate-400">Sản phẩm sẵn kho</div>
              </div>
              <div>
                <div className="font-bold text-white text-base tabular-nums">30 Ngày</div>
                <div className="text-slate-400">Đổi trả miễn phí</div>
              </div>
              <div>
                <div className="font-bold text-white text-base tabular-nums">100%</div>
                <div className="text-slate-400">Chính hãng kiểm định</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURE BANNER "PEAKGEAR GEAR FINDER" */}
      <section className="bg-white border-b border-[#CBD5E1] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#111827] rounded-3xl overflow-hidden shadow-xl p-8 sm:p-12 lg:p-14">
            {/* Subtle topographic background accent */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FACC15] mb-3">
                  PEAKGEAR GEAR FINDER
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  Chưa biết chọn trang bị nào cho chuyến đi sắp tới?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-2">
                  Chỉ cần trả lời 4 câu hỏi kỹ thuật trong vòng 60 giây. Hệ thống sẽ gợi ý bộ trang bị chuẩn xác theo cự ly, thời tiết, số ngày và trình độ của bạn.
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  ✓ Không thừa tải trọng • ✓ Không thiếu đồ bảo hộ sinh tồn • ✓ Tự động tính tổng trọng lượng balo
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/gear-finder"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-[#F97316] hover:bg-[#ea580c] active:bg-[#c2410c] transition-all shadow-lg hover:shadow-orange-500/25"
                >
                  Tìm trang bị phù hợp
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DANH MỤC HOẠT ĐỘNG */}
      <section id="activities" className="py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                Định Hướng Theo Chuyên Ngành
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
                Danh Mục Hoạt Động Ngoài Trời
              </h2>
            </div>
            <p className="text-sm text-[#64748B] max-w-md mt-2 md:mt-0">
              Trang bị được phân loại chính xác theo cấp độ va chạm cơ học và điều kiện môi trường thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {activityCategories.map((cat) => (
              <Link
                key={cat.handle}
                href={`/collections/${cat.handle}`}
                className="group relative flex flex-col h-96 rounded-2xl overflow-hidden bg-white border border-[#CBD5E1] hover:border-[#111827] hover:shadow-xl transition-all duration-300"
              >
                <div className="relative flex-1 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#111827]/80 text-white backdrop-blur-xs border border-white/10">
                      {cat.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-[#CBD5E1]">
                  <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#F97316] transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                    {cat.desc}
                  </p>
                  <div className="flex items-center text-xs font-bold text-[#F97316] group-hover:translate-x-1 transition-transform">
                    Khám phá bộ sưu tập
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SẢN PHẨM NỔI BẬT */}
      <section className="py-16 lg:py-20 bg-white border-y border-[#CBD5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                Thiết Bị Tiêu Biểu
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
                Sản Phẩm Đang Được Ưa Chuộng Nhất
              </h2>
            </div>
            <Link
              href="/collections/all"
              className="inline-flex items-center text-sm font-bold text-[#111827] hover:text-[#F97316] transition-colors"
            >
              Xem toàn bộ 400+ sản phẩm
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: BUNDLE NỔI BẬT (TỰ ẨN SẠCH NẾU RỖNG) */}
      {bundles && bundles.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                  Tiết Kiệm Lên Đến 20%
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
                  Gói Trang Bị Đồng Bộ (Smart Bundles)
                </h2>
              </div>
              <p className="text-sm text-[#64748B] max-w-md">
                Được chuyên gia dã ngoại phối hợp sẵn theo tiêu chí đồng bộ trọng lượng và tương thích công năng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
