---
name: storefront-medusa-wiring
description: Thay thế dữ liệu giả (mock data) trong Next.js Storefront bằng dữ liệu thật từ MedusaJS v2 Store API (products, collections, carts, regions). Kích hoạt khi sửa giao diện frontend, nối API hoặc xử lý giỏ hàng.
---

# Quy trình nối Next.js Storefront (Mock Data) vào MedusaJS Backend

Bạn cùng nhóm đã dựng giao diện `apps/storefront` bằng mock data. Khi được yêu cầu nối trang hoặc component vào dữ liệu thật, thực hiện theo quy trình:

## 1. Kiểm tra Medusa SDK / Fetch Client
- Đảm bảo sử dụng `@medusajs/js-sdk` (hoặc hàm wrapper `fetch` chuẩn) trỏ tới `process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"`.
- Luôn truyền `publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

## 2. Ánh xạ (Map) kiểu dữ liệu Mock sang Medusa Product
Khi thay thế mảng mock data bằng response từ `/store/products`:
- **Tên & Đường dẫn:** `product.title`, `product.handle`.
- **Hình ảnh:** `product.thumbnail` (fallback về ảnh placeholder nếu null) và `product.images`.
- **Giá tiền (Quan trọng):** Trong Medusa v2, giá nằm ở biến thể (`variants[0].calculated_price.calculated_amount`). Luôn format theo chuẩn tiền tệ Việt Nam:
  `new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)`
- **Thông số kỹ thuật:** Đọc từ `product.metadata` (ví dụ: `gear_type`, `terrain`, `weather`, `weight_kg`).

## 3. Luồng Giỏ hàng (Cart Flow)
- Lưu `cart_id` vào `localStorage` hoặc Cookie.
- Khi user bấm "Thêm vào giỏ": gọi `sdk.store.cart.createLineItem(cartId, { variant_id, quantity })` thay vì chỉ đẩy vào state cục bộ.
- Đảm bảo đã lấy đúng `region_id` của Vietnam trước khi tạo cart.