---
name: peakgear-docs-writer
description: Hỗ trợ viết tài liệu kỹ thuật, API Docs, README, sơ đồ Mermaid (Sequence, ERD, Architecture) và nội dung báo cáo đồ án EC312 & EC402 cho dự án Peakgear. Kích hoạt khi người dùng yêu cầu viết docs, tài liệu, sơ đồ hoặc hướng dẫn sử dụng.
---

# Quy chuẩn viết tài liệu cho dự án Peakgear

Khi được yêu cầu viết tài liệu (`README.md`, API Docs, đặc tả hệ thống hoặc nội dung báo cáo môn học), luôn tuân thủ các nguyên tắc sau:

## 1. Dựa trên mã nguồn thực tế (Code-first)
- Luôn kiểm tra trực tiếp cấu trúc thư mục, schema trong `apps/backend/src/modules/`, API routes trong `apps/backend/src/api/` và các biến môi trường thực tế trước khi viết. Tuyệt đối không bịa đặt endpoint hay tên trường dữ liệu không tồn tại.

## 2. Trực quan hóa bằng sơ đồ Mermaid
- Khi giải thích kiến trúc hệ thống, luồng dữ liệu (Data Flow), thiết kế cơ sở dữ liệu (ERD) hoặc luồng xử lý nghiệp vụ (**Smart Gear-Finder**, **Smart Bundles**, **Push Notifications**), bắt buộc vẽ sơ đồ bằng cú pháp **Mermaid** (`flowchart TD`, `sequenceDiagram`, `erDiagram`) tương thích tốt với GitHub Markdown.

## 3. Chuẩn định dạng cho từng loại tài liệu
- **Tài liệu API (`docs/API.md`):** Trình bày rõ `Method + Endpoint`, `Headers` (nhấn mạnh `x-publishable-api-key`), `Request Body / Query Params` (kèm ví dụ JSON thực tế dùng tiền tệ `vnd`), và `Response JSON`.
- **Tài liệu báo cáo đồ án (EC312 & EC402):** Viết văn phong học thuật rõ ràng, mạch lạc bằng tiếng Việt; phân tách rành mạch giữa **Lõi hệ thống (MedusaJS + Supabase)**, **2 Module mở rộng**, và **Đặc thù di động (SQLite Offline-first + Expo Push Notifications)**.
- **Hướng dẫn cài đặt (`README.md`):** Mọi lệnh terminal và biến môi trường phải đặt trong code block thuần túy, không bọc định dạng link Markdown `[...](...)` vào URL hay chuỗi kết nối database.