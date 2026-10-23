# Peakgear - Thiết Kế Hệ Thống Thương Mại Điện Tử
Hệ thống thương mại điện tử Headless chuyên cung cấp thiết bị trekking, tích hợp tính năng Smart Gear-Finder và Cross-selling.

## 💻 Công nghệ sử dụng
- **Backend & Core:** MedusaJS
- **Database:** PostgreSQL (Lưu trữ tập trung trên Supabase)
- **Storefront:** Next.js

## 🚀 Hướng dẫn cài đặt cho thành viên nhóm

**Bước 1: Tải mã nguồn và cài đặt thư viện**
Tất cả các thành viên mở Terminal và chạy các lệnh sau:
```bash
git clone [https://github.com/DevP251/Peakgear---EC312.git](https://github.com/DevP251/Peakgear---EC312.git)
cd Peakgear---EC312
npm install
```

**Bước 2: Cấu hình biến môi trường (Bắt buộc)**
1. Di chuyển vào thư mục backend: `cd apps/backend`
2. Tạo một file tên là `.env` (nếu chưa có) và dán chuỗi kết nối Supabase dùng chung của nhóm vào:
```env
DATABASE_URL="postgresql://postgres.[ID_Supabase]:[Mật_khẩu]@[aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres](https://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres)"
```
3. Di chuyển sang thư mục storefront: `cd ../storefront`
4. Tạo file `.env.local` và thêm khóa Publishable API Key lấy từ Admin Dashboard:
```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_chuoi_ma_cua_du_an"
```

**Bước 3: Khởi động toàn bộ hệ thống**
Mở terminal ở thư mục gốc của dự án và chạy:
```bash
npm run dev
```
- Quản trị viên (Admin Dashboard): `http://localhost:9000/app` (Đăng nhập: admin@peakgear.com / 123456)
- Giao diện khách hàng (Storefront): `http://localhost:8000`