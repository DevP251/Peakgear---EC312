---
name: peakgear-smart-features
description: Logic nghiệp vụ và thiết kế API cho 2 tính năng mở rộng của Peakgear là Smart Gear-Finder (tư vấn trang bị trekking) và Smart Bundles (combo mua kèm). Kích hoạt khi code tính năng gợi ý hoặc combo.
---

# Đặc tả 2 Module Mở Rộng của Peakgear

## 1. Smart Gear-Finder (Gợi ý trang bị theo cung đường)
- **Mục tiêu:** Nhận đầu vào từ bài quiz của khách hàng và lọc ra danh sách sản phẩm phù hợp nhất từ kho 500 SKUs.
- **Data Model (`src/modules/gear-finder/models/quiz-result.ts`):**
  - Lưu lại lịch sử khảo sát (`id`, `session_id`, `terrain`, `weather`, `duration`, `budget_vnd`, `recommended_product_ids` dạng JSON) để phục vụ thống kê và đồng bộ Offline Checklist trên Mobile App (EC402).
- **Input payload (`POST /store/gear-finder`):**
  ```json
  {
    "terrain": "mountain | forest | camping",
    "weather": "rainy | cold | sunny | all-weather",
    "duration": "day-trip | multi-day",
    "budget_vnd": 5000000
  }
  ```
- **Logic xử lý ở Backend:**
  - Truy vấn danh sách sản phẩm từ Product Module kèm trường `metadata` và `variants.prices`.
  - Lọc và chấm điểm độ khớp dựa trên `metadata.terrain`, `metadata.weather`, `metadata.gear_type` (đảm bảo gợi ý đủ các nhóm thiết yếu: `backpack`, `footwear`, `shelter`, `apparel`, `equipment`).
  - Tối ưu danh sách sao cho tổng giá tiền nằm trong `budget_vnd` và tính tổng trọng lượng (`metadata.weight_kg`) trả về cho UI hiển thị.
- **Response chuẩn:**
  ```json
  {
    "recommendations": [],
    "total_price_vnd": 4200000,
    "total_weight_kg": 4.5,
    "missing_categories": []
  }
  ```

## 2. Smart Bundles (Gợi ý mua kèm / Cross-selling)
- **Mục tiêu:** Gợi ý các gói combo trang bị bổ trợ lẫn nhau kèm ưu đãi giảm giá khi khách xem chi tiết 1 sản phẩm hoặc xem giỏ hàng.
- **Data Model (`src/modules/smart-bundle/models/bundle.ts`):**
  - `id`: `model.id().primaryKey()`
  - `title`: `model.text()` (VD: "Combo Cắm Trại Qua Đêm Tiết Kiệm")
  - `description`: `model.text().nullable()`
  - `discount_percent`: `model.number()` (VD: `10`)
  - `product_handles`: `model.json()` (Mảng các `handle` sản phẩm nằm trong gói)
  - `is_active`: `model.boolean().default(true)`
- **API Endpoints:**
  - `GET /store/bundles?product_handle=<handle>`: Truy vấn các gói Bundle đang kích hoạt có chứa `product_handle` đang xem, tự động resolve thông tin chi tiết và giá từng sản phẩm từ Product Module.
  - `POST /store/carts/:id/bundles`: Nhận `bundle_id`, lấy toàn bộ biến thể mặc định (`variants[0].id`) của các sản phẩm trong gói và thêm đồng loạt vào giỏ hàng hiện tại của khách.