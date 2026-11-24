# QUY CHUẨN THIẾT KẾ UI/UX, KIẾN TRÚC FRONTEND & PHÁP LÝ TMĐT (PEAKGEAR STOREFRONT)
> **Dự án:** PeakGear Storefront — Next.js App Router, TypeScript, Tailwind CSS  
> **Kiến trúc:** Decoupled Architecture / Adapter Boundary sẵn sàng kết nối MedusaJS v2 Store API  
> **Tài liệu căn cứ:** `PeakGear_FE_Dev_Specification_v1.pdf`, Luật TMĐT Việt Nam (Nghị định 52/2013/NĐ-CP, Nghị định 85/2021/NĐ-CP, Nghị định 13/2023/NĐ-CP và Luật Bảo vệ quyền lợi người tiêu dùng 2023).

---

## 1. DESIGN SYSTEM TOKEN – SPORT / PERFORMANCE (TUYỆT ĐỐI KHÔNG SAI LỆCH)

### 1.1. Bảng màu chuẩn hóa (Design Tokens)
- **Primary / Ink:** `#111827` (Header, footer, heading, text chính — tương phản cao, không phủ đen toàn trang).
- **CTA / Energy Orange:** `#F97316` (**CHỈ DÙNG** cho Primary button, selected state, CTA banner chính; không lạm dụng tràn lan).
- **Accent / Signal Yellow:** `#FACC15` (Eyebrow, tag nổi bật, điểm nhấn nhỏ; không làm nền chữ dài).
- **Page Background:** `#F8FAFC` (Nền trang tổng thể sáng sạch, phân tách khối rõ ràng).
- **Surface / Card Background:** `#FFFFFF` (Bề mặt thẻ, panel, dialog).
- **Secondary Text:** `#64748B` (Mô tả phụ, metadata; không dùng cho thông tin quan trọng).
- **Border:** `#CBD5E1` (Viền thẻ, input, divider mảnh và thống nhất).
- **Success:** `#16A34A` (Còn hàng, hoàn tất đơn, mức tiết kiệm).
- **Error / Destructive:** `#DC2626` (Hết hàng, báo lỗi form, thao tác xóa).
- **CẤM:** Tuyệt đối không dùng gradient màu tím/xanh công nghệ kiểu AI, không dùng hiệu ứng đổ bóng hoặc phát sáng lòe loẹt.

### 1.2. Typography, Layout & Spacing
- **Font chữ:** Font `Inter` hiện đại, dễ đọc; sử dụng 2 weight chính: `Regular 400`, `Semibold/Bold 600–700`.
- **Hệ thống phân cấp tiêu đề:**
  - H1 Desktop: `40–48px` (Mobile: `30–34px`).
  - H2 Desktop: `28–32px` (Mobile: `22–26px`).
  - Body Text: `16px`. Metadata/Subtext: `13–14px` (không dùng cỡ chữ `11–12px` cho thông tin quan trọng).
- **Định dạng số liệu:** Toàn bộ số tiền (`1.250.000 đ`), trọng lượng (`kg`/`g`), kích thước/dung tích bắt buộc sử dụng `tabular-nums` để căn thẳng hàng.
- **Hệ Spacing & Container:** Hệ 4/8px (`4, 8, 12, 16, 24, 32, 48, 64px`). Khung nội dung tối đa `max-w-[1280px]`, căn giữa; gutter desktop `24px`, mobile `16px`.
- **Corner Radius:** Card `12–16px`, Input / Button `8–12px` (không lạm dụng bo tròn dạng viên thuốc pill-shaped).
- **Motion:** Thời gian hover/focus `150–200ms`, luôn tôn trọng `prefers-reduced-motion`.

---

## 2. QUY TẮC ĐIỀU HƯỚNG & CẤU TRÚC GLOBAL COMPONENT (CẤM SAI LỆCH)

### 2.1. Danh mục Routes chuẩn Next.js App Router
- `/` — Homepage (Trang chủ)
- `/collections/[handle]` — Product Listing / Catalog (PLP)
- `/products/[handle]` — Product Detail (PDP)
- `/cart` — Cart (Giỏ hàng)
- `/checkout` — Checkout (Thanh toán 5 bước)
- `/order/confirmed` — Order Confirmation (Xác nhận đơn hàng)
- `/gear-finder` — Smart Gear-Finder Wizard (Bộ định vị trang bị)
- `/gear-finder/results/[id]` — Gear-Finder Results (Kết quả tư vấn 2 Tab)
- `/bundles/[handle]` — Bundle Detail / Builder (Gói sản phẩm & Bộ tự ráp)
- `/policies/[slug]` — 5 Trang chính sách pháp lý TMĐT Việt Nam

### 2.2. Global Header & Các Điều Cấm Bắt Buộc
- **Cấu trúc Header:**
  - Cột trái: Logo PeakGear (liên kết về `/`).
  - Ở giữa: Chỉ hiển thị các danh mục cấp cao có dữ liệu thật: `Trekking`, `Hiking`, `Camping`.
  - Cột phải: Ô tìm kiếm (Placeholder *"Tìm balo, lều, túi ngủ..."*), Nút Tài khoản (Account), Icon Giỏ hàng kèm badge số lượng. Mobile sử dụng Drawer Menu.
- **QUY TẮC CẤM TUYỆT ĐỐI:**
  1. **CẤM** đặt Smart Finder lên Header chính hoặc thanh điều hướng toàn trang.
  2. **CẤM** đưa câu hỏi Finder vào Search Overlay hoặc coi Finder như một bộ lọc của Catalog.
  3. **CẤM** đưa Bundle lên thanh điều hướng chính (Global Nav) ở bản MVP (Bundle chỉ được tiếp cận qua PDP, Finder Results hoặc trang chi tiết riêng).

### 2.3. Thứ tự chuẩn 7 Section của Homepage (`/`)
1. **Header** (Global)
2. **Hero chính** (Hình ảnh vận động viên / dã ngoại, thông điệp thương hiệu Sport/Performance, CTA *"Khám phá sản phẩm"* — KHÔNG dùng Finder làm Hero).
3. **Smart Finder Feature Banner** (Eyebrow *"PEAKGEAR GEAR FINDER"*, Tiêu đề *"Chưa biết chọn trang bị nào?"*, mô tả tối đa 2 dòng, CTA cam `#F97316` *"Tìm trang bị phù hợp"* dẫn tới `/gear-finder`).
4. **Danh mục hoạt động** (Trekking / Hiking / Camping).
5. **Sản phẩm nổi bật** (Truy xuất từ Adapter/Catalog, không hard-code).
6. **Smart Bundle nổi bật** (Truy xuất từ Adapter; tự động ẩn nếu rỗng).
7. **Footer** (Global).

---

## 3. TẦNG DỮ LIỆU MEDUSAJS v2 & NGUYÊN TẮC CHỐNG DỮ LIỆU GIẢ (ANTI-FAKE)

### 3.1. Adapter Boundary (`src/lib/api/`)
- Mọi truy xuất dữ liệu từ giao diện phải đi qua interface chuẩn `src/lib/api/index.ts`.
- Chuyển đổi linh hoạt qua biến môi trường `NEXT_PUBLIC_USE_MOCK_DATA=true|false`.
- **Ràng buộc nghiệp vụ tối thượng:** Toàn bộ công thức tính toán tổng tiền, chiết khấu Bundle, phí vận chuyển, tồn kho và thuật toán gợi ý Finder bắt buộc nằm trong Adapter/Backend. **Component giao diện CHỈ render kết quả trả về, tuyệt đối không tự tính giá cuối hay tự gán % chiết khấu**.

### 3.2. Chống dữ liệu giả (Anti-Fake Policy)
- **Review / Đánh giá:** KHÔNG hiển thị số sao hoặc số lượt đánh giá giả lập nếu dataset không có review thật.
- **Badges:** KHÔNG tự gắn nhãn "Best Seller", "New", "Hot" nếu không có trường dữ liệu xác nhận.
- **Finder Accuracy:** KHÔNG bịa đặt số `% match score` (ví dụ *"Độ chuẩn xác 98%"*) khi chưa có mô hình chấm điểm thực tế.
- **Thông tin pháp lý:** Thông tin chủ quản tại Footer sử dụng placeholder `[Chờ PO/Nhóm cập nhật thông tin chính thức]` cho giấy phép/địa chỉ để tránh tạo dữ liệu giả mạo.

---

## 4. CHI TIẾT TỪNG MÀN HÌNH CHỦ LỰC

### 4.1. Catalog / Product Listing (`/collections/[handle]`)
- Breadcrumb -> H1 & mô tả -> Toolbar (Bộ sắp xếp Sort, số lượng kết quả, Filter Chips đang chọn có nút xóa từng chip và *"Xóa tất cả"*).
- Sidebar lọc bên trái `240–280px` (Desktop) / Drawer (Mobile) + Lưới sản phẩm 3–4 cột (Desktop) / 2 cột (Mobile) + Phân trang Pagination.
- **Thứ tự bộ lọc:** Danh mục -> Giá -> Thương hiệu -> Dung tích/kích thước -> Mục đích sử dụng -> Tình trạng còn hàng (CHỈ render nhóm filter có giá trị thực).
- Thẻ sản phẩm `ProductCard`: Ảnh tỷ lệ 1:1 có fallback sạch; thương hiệu, tên tối đa 2 dòng, giá niêm yết rõ ràng.

### 4.2. Product Detail (`/products/[handle]`)
- Bố cục 2 cột: Trái là `ProductGallery` (ảnh lớn + thumbnails); Phải là thông tin sản phẩm, giá, mô tả ngắn, `VariantSelector` (bắt buộc chọn phân loại trước khi thêm giỏ), số lượng và nút mua hàng lớn (`min-height: 48px`).
- Ngay dưới nút mua hàng: **3 cam kết Trust Signals** (*Đổi trả 30 ngày miễn phí • Bảo hành chính hãng • Giao nhanh 2h nội thành*) và bảng thông số kỹ thuật chi tiết.
- Section **"Complete Your Kit / Hoàn thiện bộ trang bị của bạn"** đặt dưới vùng mua hàng chính: Hiển thị 2–3 bundle liên quan, nêu rõ sản phẩm đang xem đã nằm trong gói để tránh mua trùng.

### 4.3. Smart Gear-Finder (`/gear-finder` & `/gear-finder/results/[id]`)
- Xây dựng theo **Config-driven Wizard Engine** (cấu hình động `FinderQuestion`).
- Áp dụng triết lý tối giản kỹ thuật của **Hyperlite Mountain Gear**: Mỗi màn hình tập trung 1 câu hỏi rõ ràng, thanh tiến độ mảnh (`Bước 1/4`), nút Quay lại / Tiếp tục (disable nếu câu bắt buộc chưa trả lời).
- **Trang kết quả:** 2 Tab rõ rệt *"Sản phẩm phù hợp (count)"* và *"Bộ trang bị phù hợp (count)"*. Mỗi đề xuất có khối *"Vì sao được đề xuất?"* chứa reason tags thực tế.

### 4.4. Smart Bundle (`/bundles/[handle]`)
- Áp dụng cấu trúc đóng gói trực quan của **Near Zero**:
  - Hỗ trợ 3 trạng thái: *Ready-made*, *Customizable*, và *Unavailable*.
  - Hiển thị 3 chỉ số vàng: **Số lượng món** • **Tổng trọng lượng ước tính** • **Mức tiết kiệm gói**.
  - Danh sách thành phần phân định rõ **Món bắt buộc** và **Món tùy chọn / thay thế** (nút *"Tùy chỉnh"* mở inline/drawer selector).
  - **Sticky Summary Bar:** Cố định cạnh đáy/cột phải, cập nhật thời gian thực tổng tiền và trạng thái hợp lệ.

### 4.5. Cart & Checkout (Tuân thủ Pháp luật TMĐT Việt Nam)
- **Cart (`/cart`):** Gom nhóm các món thuộc cùng một Bundle thành khối `BundleCartGroup`. Khóa nút tăng giảm khi request đang xử lý để chống bấm lặp.
- **Checkout (`/checkout`):** 5 bước chuẩn Medusa. Validate định dạng số điện thoại di động Việt Nam (`/^(0|\+84)\d{9}$/`). Minh bạch đơn vị VNĐ và thuế VAT 8% đã bao gồm.
- **Cam kết điều khoản bắt buộc:** Bắt buộc có checkbox **chưa được tích sẵn**: *"Tôi đã đọc và đồng ý với Điều kiện giao dịch chung & Chính sách bảo vệ thông tin cá nhân của PeakGear"* trước khi mở khóa nút Đặt hàng.
- **5 Trang chính sách pháp lý thực tế tại `/policies/[slug]`:**
  1. `dieu-kien-giao-dich-chung` (Quy định giao dịch chung)
  2. `van-chuyen-giao-nhan-kiem-hang` (Chính sách vận chuyển & đồng kiểm)
  3. `doi-tra-hoan-tien` (Chính sách đổi trả 30 ngày)
  4. `bao-hanh` (Chính sách bảo hành kỹ thuật)
  5. `bao-ve-thong-tin-ca-nhan` (Chính sách bảo vệ dữ liệu cá nhân theo NĐ 13/2023/NĐ-CP)
