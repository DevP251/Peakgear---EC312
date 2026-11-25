import React from "react";
import Link from "next/link";
import { storeApi } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { FilterDrawer } from "@/components/product/FilterDrawer";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{
    brand?: string;
    price?: string;
    sort?: "price_asc" | "price_desc" | "newest" | "rating";
    stock?: string;
    page?: string;
  }>;
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;

  // Resolve collection information
  const collectionNames: Record<string, { title: string; desc: string }> = {
    all: {
      title: "Tất Cả Sản Phẩm",
      desc: "Trang bị dã ngoại, leo núi, trekking và camping chính hãng từ Decathlon & FanFan.",
    },
    trekking: {
      title: "Trang Bị Trekking",
      desc: "Dành cho hành trình dài ngày, địa hình dốc đá hiểm trở và điều kiện khắc nghiệt.",
    },
    hiking: {
      title: "Trang Bị Hiking",
      desc: "Gọn nhẹ, thoáng khí và cơ động cho những cung đường dốc ngắn và dạo bộ địa hình.",
    },
    camping: {
      title: "Trang Bị Camping & Cắm Trại",
      desc: "Lều trại chống thấm, túi ngủ ấm áp, bếp nấu dã ngoại và phụ kiện tiện nghi.",
    },
  };

  const currentCollection = collectionNames[handle] || {
    title: `Danh mục: ${handle.toUpperCase()}`,
    desc: "Khám phá danh sách trang bị dã ngoại chuẩn kỹ thuật của PeakGear.",
  };

  // Parse filters from searchParams
  const selectedBrand = resolvedSearchParams.brand;
  const selectedPrice = resolvedSearchParams.price;
  const selectedSort = resolvedSearchParams.sort || "newest";
  const inStockOnly = resolvedSearchParams.stock === "1";
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10));
  const limit = 24;

  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  if (selectedPrice === "under-500k") {
    maxPrice = 500000;
  } else if (selectedPrice === "500k-1m") {
    minPrice = 500000;
    maxPrice = 1000000;
  } else if (selectedPrice === "1m-2m") {
    minPrice = 1000000;
    maxPrice = 2000000;
  } else if (selectedPrice === "above-2m") {
    minPrice = 2000000;
  }

  // Fetch filtered products
  const productsRes = await storeApi.getProducts({
    collection: handle,
    brand: selectedBrand,
    minPrice,
    maxPrice,
    stockOnly: inStockOnly,
    sort: selectedSort,
    page: currentPage,
    limit,
  });

  const products = productsRes.products || [];
  const total = productsRes.count ?? (productsRes as { total?: number }).total ?? products.length;
  const totalPages = productsRes.totalPages || Math.ceil(total / limit) || 1;

  // Available brands for sidebar
  const brands = [
    { name: "Decathlon", value: "Decathlon" },
    { name: "FanFan", value: "FanFan" },
    { name: "Quechua", value: "Quechua" },
    { name: "Forclaz", value: "Forclaz" },
    { name: "Naturehike", value: "Naturehike" },
    { name: "Black Diamond", value: "Black Diamond" },
    { name: "Fire-Maple", value: "Fire-Maple" },
  ];

  // Helper function to build URL queries while preserving other params
  const buildFilterUrl = (overrides: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams();
    const merged = {
      brand: selectedBrand,
      price: selectedPrice,
      sort: selectedSort !== "newest" ? selectedSort : undefined,
      stock: inStockOnly ? "1" : undefined,
      page: "1", // reset page on filter change
      ...overrides,
    };

    Object.entries(merged).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        nextParams.set(key, val);
      }
    });

    const queryString = nextParams.toString();
    return `/collections/${handle}${queryString ? `?${queryString}` : ""}`;
  };

  const buildPageUrl = (pageNumber: number) => {
    return buildFilterUrl({ page: pageNumber > 1 ? String(pageNumber) : undefined });
  };

  const hasActiveFilters = Boolean(selectedBrand || selectedPrice || inStockOnly);

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#111827] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-[#111827] transition-colors">
            Danh mục
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827]">{currentCollection.title}</span>
        </nav>

        {/* Collection Header */}
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mb-2">
                {currentCollection.title}
              </h1>
              <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
                {currentCollection.desc}
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#111827] tabular-nums self-start md:self-auto">
              Tổng cộng {total} sản phẩm
            </div>
          </div>
        </div>

        {/* Main Grid Layout: Sidebar Filter + Product Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR FILTERS */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1] mb-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Bộ Lọc Sản Phẩm
                </h2>
                {hasActiveFilters && (
                  <Link
                    href={`/collections/${handle}`}
                    className="text-xs text-[#DC2626] hover:underline font-semibold"
                  >
                    Xóa tất cả
                  </Link>
                )}
              </div>

              {/* 1. Category quick jump */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2.5">
                  Bộ Sưu Tập
                </h3>
                <div className="space-y-1 text-xs">
                  {[
                    { label: "Tất cả sản phẩm", key: "all" },
                    { label: "Trekking Khắc Nghiệt", key: "trekking" },
                    { label: "Hiking Cơ Động", key: "hiking" },
                    { label: "Camping & Dã Ngoại", key: "camping" },
                  ].map((cat) => (
                    <Link
                      key={cat.key}
                      href={`/collections/${cat.key}`}
                      className={`block py-1.5 px-2.5 rounded-lg transition-colors ${
                        handle === cat.key
                          ? "bg-[#111827] text-white font-semibold"
                          : "text-[#64748B] hover:text-[#111827] hover:bg-slate-50"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 2. Price Range Filter */}
              <div className="mb-6 pt-5 border-t border-[#CBD5E1]/60">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2.5">
                  Khoảng Giá
                </h3>
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: "Tất cả mức giá", value: undefined },
                    { label: "Dưới 500.000 đ", value: "under-500k" },
                    { label: "500.000 đ - 1.000.000 đ", value: "500k-1m" },
                    { label: "1.000.000 đ - 2.000.000 đ", value: "1m-2m" },
                    { label: "Trên 2.000.000 đ", value: "above-2m" },
                  ].map((opt) => {
                    const isSelected = selectedPrice === opt.value;
                    return (
                      <Link
                        key={opt.label}
                        href={buildFilterUrl({ price: opt.value })}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-[#F97316]/10 text-[#F97316] font-bold"
                            : "text-[#64748B] hover:text-[#111827] hover:bg-slate-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <span>✓</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 3. Brand Filter */}
              <div className="mb-6 pt-5 border-t border-[#CBD5E1]/60">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2.5">
                  Thương Hiệu
                </h3>
                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  <Link
                    href={buildFilterUrl({ brand: undefined })}
                    className={`flex items-center justify-between py-1 px-2 rounded ${
                      !selectedBrand ? "bg-slate-100 font-bold text-[#111827]" : "text-[#64748B] hover:text-[#111827]"
                    }`}
                  >
                    <span>Tất cả thương hiệu</span>
                  </Link>
                  {brands.map((b) => {
                    const isSelected = selectedBrand === b.value;
                    return (
                      <Link
                        key={b.value}
                        href={buildFilterUrl({ brand: isSelected ? undefined : b.value })}
                        className={`flex items-center justify-between py-1 px-2 rounded transition-colors ${
                          isSelected
                            ? "bg-[#111827] text-white font-semibold"
                            : "text-[#64748B] hover:text-[#111827] hover:bg-slate-50"
                        }`}
                      >
                        <span>{b.name}</span>
                        {isSelected && <span>✓</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 4. Stock Availability Toggle */}
              <div className="pt-5 border-t border-[#CBD5E1]/60">
                <Link
                  href={buildFilterUrl({ stock: inStockOnly ? undefined : "1" })}
                  className={`flex items-center gap-2.5 text-xs py-2 px-2.5 rounded-lg border transition-colors ${
                    inStockOnly
                      ? "border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A] font-semibold"
                      : "border-[#CBD5E1] text-[#64748B] hover:border-slate-400"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      inStockOnly ? "bg-[#16A34A] border-[#16A34A] text-white" : "border-slate-400"
                    }`}
                  >
                    {inStockOnly && <span className="text-[10px]">✓</span>}
                  </div>
                  <span>Chỉ hiển thị còn hàng</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID AREA */}
          <div className="lg:col-span-3">
            {/* Toolbar: Active chips & Sorting */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Mobile Filter Drawer Trigger */}
              <div className="flex items-center gap-3">
                <FilterDrawer
                  handle={handle}
                  selectedBrand={selectedBrand}
                  selectedPrice={selectedPrice}
                  inStockOnly={inStockOnly}
                  brands={brands}
                />

                {/* Active Filter Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="hidden sm:inline text-xs text-[#64748B]">Bộ lọc:</span>
                  {!hasActiveFilters && (
                    <span className="text-xs text-slate-400 italic">Mặc định</span>
                  )}
                  {selectedBrand && (
                    <Link
                      href={buildFilterUrl({ brand: undefined })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-100 text-[#111827] hover:bg-slate-200"
                    >
                      <span>Thương hiệu: {selectedBrand}</span>
                      <span className="font-bold text-slate-500">×</span>
                    </Link>
                  )}
                  {selectedPrice && (
                    <Link
                      href={buildFilterUrl({ price: undefined })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-100 text-[#111827] hover:bg-slate-200"
                    >
                      <span>Giá: {selectedPrice}</span>
                      <span className="font-bold text-slate-500">×</span>
                    </Link>
                  )}
                  {inStockOnly && (
                    <Link
                      href={buildFilterUrl({ stock: undefined })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20"
                    >
                      <span>Còn hàng sẵn</span>
                      <span className="font-bold">×</span>
                    </Link>
                  )}
                  {hasActiveFilters && (
                    <Link
                      href={`/collections/${handle}`}
                      className="text-xs text-[#DC2626] hover:underline font-semibold ml-1"
                    >
                      Xóa tất cả
                    </Link>
                  )}
                </div>
              </div>

              {/* Reactive Sort Selector */}
              <SortSelect currentSort={selectedSort} />
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-slate-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
                  Hãy thử điều chỉnh lại bộ lọc mức giá, thương hiệu hoặc chọn danh mục khác để tìm trang bị bạn mong muốn.
                </p>
                <Link
                  href={`/collections/${handle}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#111827] hover:bg-black transition-colors"
                >
                  Đặt lại bộ lọc
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 flex items-center justify-between shadow-xs">
                    <div className="text-xs text-[#64748B]">
                      Trang <span className="font-bold text-[#111827] tabular-nums">{currentPage}</span> / <span className="tabular-nums">{totalPages}</span> ({total} sản phẩm)
                    </div>

                    <div className="flex items-center gap-2">
                      {currentPage > 1 ? (
                        <Link
                          href={buildPageUrl(currentPage - 1)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#CBD5E1] text-[#111827] hover:bg-slate-50 transition-colors"
                        >
                          ← Trang trước
                        </Link>
                      ) : (
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed">
                          ← Trang trước
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-xs">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const p = i + 1;
                          const isActive = p === currentPage;
                          return (
                            <Link
                              key={p}
                              href={buildPageUrl(p)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold tabular-nums transition-colors ${
                                isActive
                                  ? "bg-[#111827] text-white"
                                  : "text-[#64748B] hover:bg-slate-100 hover:text-[#111827]"
                              }`}
                            >
                              {p}
                            </Link>
                          );
                        })}
                      </div>

                      {currentPage < totalPages ? (
                        <Link
                          href={buildPageUrl(currentPage + 1)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#CBD5E1] text-[#111827] hover:bg-slate-50 transition-colors"
                        >
                          Trang sau →
                        </Link>
                      ) : (
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed">
                          Trang sau →
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
