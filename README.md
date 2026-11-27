# Peakgear

Hệ thống thương mại điện tử **headless** chuyên thiết bị trekking, leo núi và cắm trại, quy mô danh mục khoảng **500 SKU** (balo, lều, giày, trang phục, bếp và dụng cụ sinh tồn). Cùng một lõi backend và một cơ sở dữ liệu phục vụ đồng thời hai đồ án:

- **EC312 — Thiết kế hệ thống thương mại điện tử:** Web Storefront (Next.js) và Admin Dashboard.
- **EC402 — Phát triển ứng dụng thương mại điện tử di động:** ứng dụng Android (React Native / Expo), ưu tiên dùng được khi mất mạng.

Hai module mở rộng nằm trên lõi MedusaJS:

- **Smart Gear-Finder** — quiz ngắn về địa hình, thời tiết, số ngày đi và ngân sách, rồi trả về một bộ trang bị đủ nhóm thiết yếu, nằm trong ngân sách và có tổng trọng lượng ước tính.
- **Smart Bundles** — gợi ý combo mua kèm (cross-selling) trên trang sản phẩm, giảm giá theo gói và thêm cả bộ vào giỏ.

Thị trường vận hành là Việt Nam, đơn vị tiền tệ `VND`. Đặc tả nghiệp vụ đầy đủ nằm ở [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md).

## Kiến trúc hệ thống

Web, mobile và Admin cùng gọi REST API của MedusaJS v2. Tồn kho, đơn hàng và người dùng nằm trên PostgreSQL (Supabase). Ảnh sản phẩm nằm trên Cloudinary. Ứng dụng di động giữ một bản SQLite cục bộ cho danh mục và checklist Gear-Finder. Subscriber trên backend lắng nghe sự kiện đơn hàng và gửi push notification về máy khách.

```mermaid
flowchart LR
  subgraph clients [Clients]
    Web["Web Storefront<br/>Next.js"]
    Mobile["Mobile App<br/>React Native / Expo + SQLite"]
    Admin["Admin Dashboard"]
  end

  subgraph core [Core Backend — MedusaJS v2]
    API["Core API"]
    Finder["Smart Gear-Finder"]
    Bundles["Smart Bundles"]
    Subs["Subscribers<br/>Push Notifications"]
  end

  subgraph infra [Infrastructure]
    DB[("Supabase<br/>PostgreSQL")]
    Media[("Cloudinary<br/>Media Storage")]
  end

  Web --> API
  Mobile --> API
  Admin --> API
  API --> Finder
  API --> Bundles
  API --> Subs
  API --> DB
  Finder --> DB
  Bundles --> DB
  API --> Media
  Subs -.-> Mobile
```

## Cấu trúc thư mục

Monorepo dùng npm workspaces và Turborepo. Cây dưới đây là những thư mục đang có trong repo (bỏ `node_modules`, `.next` và file môi trường).

```text
Peakgear---EC312/
├── apps/
│   ├── backend/                      # MedusaJS v2 — API, Admin, module, workflow
│   │   ├── medusa-config.ts          # Cấu hình DB, CORS, JWT
│   │   ├── .env.template             # Mẫu biến môi trường backend
│   │   ├── integration-tests/        # Test tích hợp HTTP và module
│   │   └── src/
│   │       ├── api/                  # Route tùy biến: /store/*, /admin/*
│   │       ├── admin/                # Tùy biến giao diện Admin
│   │       ├── modules/              # Custom module (Gear-Finder, Bundles)
│   │       ├── workflows/            # Luồng ghi dữ liệu (createWorkflow)
│   │       ├── subscribers/          # Sự kiện đơn hàng → push notification
│   │       ├── jobs/                 # Tác vụ chạy theo lịch
│   │       ├── links/                # Liên kết giữa các module
│   │       ├── lib/                  # Hàm dùng chung
│   │       ├── scripts/              # Script seed dữ liệu
│   │       ├── search/               # Truy vấn sản phẩm / giá
│   │       └── migration-scripts/    # Script dữ liệu vùng, chính sách cửa hàng
│   ├── storefront/                   # Next.js 15 App Router — Web Storefront (EC312)
│   │   └── src/
│   │       ├── app/                  # Trang: home, collections, products, cart,
│   │       │                         # checkout, gear-finder, bundles, policies
│   │       ├── components/           # UI: layout, product, cart, finder, bundle
│   │       ├── lib/api/              # storeApi: mock adapter và Medusa client
│   │       ├── mocks/catalog.json    # Danh mục mock cho giai đoạn frontend
│   │       ├── config/               # Nội dung tĩnh (chính sách)
│   │       └── types/                # Kiểu dùng chung của storefront
│   └── mobile/                       # React Native / Expo (EC402) — thư mục đã tạo, chưa có mã nguồn
├── docs/
│   └── PROJECT_SPEC.md               # Đặc tả nghiệp vụ và hai module mở rộng
├── .github/workflows/                # Workflow cập nhật phiên bản Medusa
├── package.json                      # Workspace gốc và script turbo
├── turbo.json                        # Pipeline build / dev / lint / test
└── README.md
```

`apps/backend/src/modules`, `workflows`, `subscribers`, `jobs` và `links` hiện là khung Medusa để gắn Smart Gear-Finder, Smart Bundles và push notification. Giao diện storefront đã có các trang tương ứng và đang đọc `src/mocks/catalog.json` cho đến khi nối Store API.

## Công nghệ sử dụng

| Lớp | Công nghệ |
| --- | --- |
| Backend | MedusaJS v2 (`@medusajs/medusa` 2.22), Node.js ≥ 22.23, TypeScript, Turborepo, npm workspaces |
| Frontend Web | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Mobile App | React Native, Expo, `expo-sqlite` (cache danh mục và checklist offline), `expo-notifications` (push) |
| Database / Cloud | Supabase (PostgreSQL), Cloudinary (ảnh sản phẩm) |

## Cài đặt và chạy dự án

Yêu cầu: Node.js ≥ 22.23 và npm ≥ 10.

### 1. Lấy mã nguồn và cài dependency

```bash
git clone https://github.com/DevP251/Peakgear---EC312.git
cd Peakgear---EC312
npm install
```

`npm install` ở thư mục gốc cài luôn dependency của `apps/backend` và `apps/storefront`.

### 2. Biến môi trường

Backend — copy mẫu rồi điền chuỗi kết nối Supabase và tài khoản Cloudinary của nhóm:

```bash
cd apps/backend
copy .env.template .env
```

Nội dung tối thiểu của `apps/backend/.env` (giữ nguyên một dòng, không bọc markdown):

```env
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:5173,http://localhost:9000
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
CLOUDINARY_CLOUD_NAME=ten_cloud
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

`PROJECT_REF` và `PASSWORD` lấy từ Supabase (Connection string, pooler vùng `ap-southeast-1`). Ba biến `CLOUDINARY_*` lấy từ Cloudinary Dashboard. Không commit file `.env`.

Storefront — tạo `apps/storefront/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_chuoi_ma_lay_tu_admin
```

Publishable API key tạo trong Admin tại **Settings → Publishable API Keys**, rồi dán vào biến trên. Mọi request Store API phải gửi header `x-publishable-api-key`.

### 3. Khởi động

Từ thư mục gốc của repo:

```bash
npm run dev
```

Turborepo chạy song song backend và storefront.

| Dịch vụ | Địa chỉ |
| --- | --- |
| Admin Dashboard | http://localhost:9000/app |
| Backend API | http://localhost:9000 |
| Web Storefront | http://localhost:8000 |

Script `dev` của storefront hiện là `next dev` (cổng mặc định **3000**). `STORE_CORS` của backend lại mở **8000**. Để storefront đúng địa chỉ trong bảng, chạy riêng:

```bash
cd apps/storefront
npx next dev --turbopack --port 8000
```

Backend một mình: `npm run backend:dev` từ thư mục gốc (http://localhost:9000).

Tài khoản Admin tạo lần đầu bằng CLI của Medusa trong `apps/backend` (email và mật khẩu do từng máy tự đặt, không lưu trong repo):

```bash
npx medusa user -e admin@peakgear.com -p your-password
```

## Quy ước làm việc với Git

`main` là nhánh ổn định dùng để demo và nộp bài. Không commit thẳng lên `main`.

1. Cập nhật `main`, rồi tạo nhánh theo tính năng: `feat/gear-finder`, `feat/smart-bundles`, `feat/storefront-cart`.
2. Mỗi nhánh chỉ chứa một việc. Mở pull request về `main` khi đã chạy được trên máy.
3. Không đưa `.env`, `.env.local`, khóa API hay chuỗi kết nối database vào commit.

Sửa lỗi dùng tiền tố `fix/`, việc tài liệu dùng `docs/`.
