# Đặc tả Dự án & Nghiệp vụ: Peakgear E-Commerce Ecosystem

## 1. Tổng quan dự án
- **Tên dự án:** Peakgear — Hệ thống thương mại điện tử chuyên dụng cho thiết bị trekking, leo núi và cắm trại.
- **Mục tiêu học thuật:**
  - **EC312 (Thiết kế hệ thống TMĐT):** Xây dựng nền tảng Headless E-Commerce hoàn chỉnh với Web Storefront và 2 module mở rộng thông minh.
  - **EC402 (Phát triển ứng dụng TMĐT di động):** Phát triển ứng dụng di động tích hợp sâu với lõi hệ thống, tối ưu trải nghiệm ngoại tuyến (Offline-first) và thông báo đẩy (Push Notifications).
- **Quy mô danh mục:** ~500 SKUs thiết bị outdoor (Balo, Lều/Tăng, Giày trekking, Trang phục giữ nhiệt/chống nước, Bếp & Dụng cụ sinh tồn).
- **Thị trường & Tiền tệ:** Việt Nam (`VNĐ`, thuế VAT 10%).

---

## 2. Kiến trúc hệ thống (Headless Monorepo)
Hệ thống dùng chung một lõi Backend và Cơ sở dữ liệu duy nhất để đồng bộ tồn kho, đơn hàng và dữ liệu người dùng theo thời gian thực giữa Web và Mobile:

- **`apps/backend` (MedusaJS v2):** Quản lý danh mục sản phẩm, biến thể (Variants), giỏ hàng, thanh toán giả lập (`manual`), xử lý đơn hàng (Fulfillment) và cung cấp REST API chuẩn.
- **`Database` (Supabase - PostgreSQL):** Lưu trữ tập trung toàn bộ dữ liệu hệ thống và dữ liệu của các Custom Modules.
- **`Storage` (Cloudinary):** Lưu trữ hình ảnh sản phẩm trên đám mây, đồng bộ URL ảnh cho toàn bộ thành viên nhóm.
- **`apps/storefront` (Next.js App Router):** Giao diện mua sắm trên trình duyệt Web.
- **`apps/mobile` (React Native / Expo):** Ứng dụng di động chạy trên Android, tích hợp SQLite cục bộ và Expo Push Notifications.

---

## 3. Nghiệp vụ cốt lõi & 2 Module mở rộng

### A. Luồng mua sắm & Vận hành chuẩn (Core Flow)
1. Khách hàng duyệt danh mục hoặc tìm kiếm sản phẩm theo thuộc tính kỹ thuật (sức chứa lều, dung tích balo, chỉ số chống nước).
2. Thêm biến thể sản phẩm vào giỏ hàng (`Cart`) $\rightarrow$ Chọn hình thức giao hàng (`Giao tiêu chuẩn` hoặc `Giao hàng cồng kềnh` cho lều/gậy) $\rightarrow$ Đặt hàng (`Order`).
3. Admin xử lý đơn trên Medusa Admin Dashboard $\rightarrow$ Tạo vận đơn (`Fulfillment`) $\rightarrow$ Hệ thống tự động cập nhật trạng thái đơn hàng.

### B. Module 1: Smart Gear-Finder (Tư vấn trang bị theo cung đường)
- **Bài toán:** Người mới đi trekking thường không biết cần mua những gì, dễ mua thiếu đồ thiết yếu hoặc vượt ngân sách/trọng lượng mang vác.
- **Luồng nghiệp vụ:**
  1. Khách hàng trả lời bộ câu hỏi ngắn (Quiz): Địa hình (`núi cao`, `rừng rậm`, `cắm trại`), Thời tiết (`mưa`, `lạnh`, `nắng`), Thời gian đi (`trong ngày`, `nhiều ngày`), và Ngân sách tối đa (`VNĐ`).
  2. Backend đối chiếu câu trả lời với trường `metadata` của 500 SKUs (`gear_type`, `terrain`, `weather`, `weight_kg`).
  3. Hệ thống trả về bộ trang bị đề xuất đầy đủ các nhóm thiết yếu (Balo + Giày + Lều/Trú ẩn + Trang phục + Phụ kiện), đảm bảo tổng tiền $\le$ ngân sách và hiển thị tổng trọng lượng balo ước tính.
  4. Khách hàng có thể bấm **"Thêm tất cả vào giỏ"** hoặc lưu danh sách này thành Checklist cá nhân.

### C. Module 2: Smart Bundles (Combo mua kèm thông minh / Cross-selling)
- **Bài toán:** Tăng giá trị trung bình đơn hàng (AOV) bằng cách gợi ý các phụ kiện bắt buộc phải dùng chung với sản phẩm chính.
- **Luồng nghiệp vụ:**
  1. Khi khách xem trang chi tiết một sản phẩm (ví dụ: *Lều 2 người*), hệ thống truy vấn các gói Bundle có chứa sản phẩm đó (ví dụ: *Combo Cắm Trại Qua Đêm = Lều 2 người + Tấm cách nhiệt + Đèn treo lều*).
  2. Hiển thị mức giá ưu đãi theo gói (giảm 10% - 15% so với mua lẻ từng món).
  3. Khách hàng bấm **"Mua trọn bộ Combo"** $\rightarrow$ Backend tự động đẩy toàn bộ các sản phẩm trong gói vào giỏ hàng hiện tại.

---

## 4. Đặc thù nghiệp vụ trên Mobile App (EC402)
- **Local Database (`expo-sqlite`):**
  - Lưu cache danh mục sản phẩm xuống máy điện thoại ngay lần tải đầu tiên để giảm độ trễ mạng.
  - Lưu trữ ngoại tuyến (**Offline Gear Checklist**) từ kết quả của *Smart Gear-Finder*, giúp người dùng mở app kiểm tra đồ đạc ngay cả khi đang ở vùng núi không có sóng 4G/Wi-Fi.
- **Push Notifications (Thông báo đẩy tự động):**
  - Backend MedusaJS lắng nghe sự kiện đổi trạng thái đơn hàng (`order.placed`, `order.fulfillment_created`) và tự động bắn thông báo đẩy về điện thoại của khách hàng.