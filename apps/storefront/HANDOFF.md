# PeakGear Storefront – Technical Handoff Document

> **Version:** 1.0 · **Date:** 2026-11-24  
> **FE Status:** Phase P2 complete — 0 TypeScript errors, 0 ESLint warnings  
> **Audience:** Backend Team (MedusaJS v2) · Product Owner (PO)

---

## 1. Installation & Running

### Prerequisites
- Node.js ≥ 20.x
- npm ≥ 10.x

### Steps

```bash
# 1. Clone / navigate to project
cd peakgear-storefront

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with actual values (see section below)

# 4. Dev server (Turbopack)
npm run dev
# Opens at http://localhost:3000

# 5. Production build (run before every demo/deployment)
npm run build

# 6. Type check only (CI-safe)
npx tsc --noEmit
```

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_peakgear_storefront_replace_me
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SITE_NAME=PeakGear
NEXT_PUBLIC_SITE_URL=https://peakgear.vn
```

> [!IMPORTANT]
> While `NEXT_PUBLIC_USE_MOCK_DATA=true`, the app runs entirely on `src/lib/api/mock-adapter.ts`
> and does **not** make any real HTTP calls. Set to `false` only after the BE endpoints are deployed.

---

## 2. Architecture Overview

```
Browser
  │
  └── Next.js App Router (src/app/)
        │
        ├── Page Components (Server Components where possible)
        │     └── call storeApi.* (async, await)
        │
        └── Client Components ("use client")
              └── call storeApi.* via useEffect / event handlers
                        │
              ┌─────────┴──────────────────────────────────────────────┐
              │  src/lib/api/index.ts  (Adapter Boundary)              │
              │                                                         │
              │  MOCK_DATA=true  →  mock-adapter.ts (local JSON)       │
              │  MOCK_DATA=false →  client.ts (Medusa v2 HTTP)         │
              └─────────────────────────────────────────────────────────┘
```

**Key invariant:** ALL pricing, discount, stock-check, and weight calculations live exclusively in `mock-adapter.ts` → `previewBundleCustomization()`. UI components **never** compute these values directly.

---

## 3. Source Directory Map

```
src/
├── app/                     Next.js routes (App Router)
│   ├── page.tsx             Homepage
│   ├── collections/[handle] PLP – filter, sort, paginate
│   ├── products/[handle]    PDP – variants, trust signals, bundle CTA
│   ├── gear-finder/         Wizard (config-driven, 6 question types)
│   │   └── results/[id]     Results (2 tabs: products & bundles)
│   ├── bundles/[handle]     Smart Bundle – Near Zero 5-category layout
│   ├── cart/                Cart – BundleCartGroup + standalone items
│   ├── checkout/            NĐ 52/2013 compliant checkout
│   ├── order/confirmed      Post-order confirmation
│   └── policies/[slug]      5 legal policy pages (SSG)
│
├── components/
│   ├── layout/              SiteHeader · Footer · MobileNav · SearchOverlay
│   ├── product/             ProductCard · ProductDetailView · SortSelect · FilterDrawer
│   ├── bundle/              BundleCard · BundleDetailView
│   ├── finder/              GearFinderWizard · FinderResultsView
│   ├── cart/                CartDrawer
│   └── ui/                  ToastContainer
│
├── lib/
│   ├── api/
│   │   ├── index.ts         Re-exports storeApi (mock or live based on env)
│   │   ├── mock-adapter.ts  Full mock with all business logic (single source of truth)
│   │   └── client.ts        MedusaJS v2 HTTP client (ready, awaiting BE)
│   └── cart-context.tsx     Global cart + drawer state (localStorage persistent)
│
├── config/
│   └── site-legal.ts        Company info, VAT rate, freeship threshold, 5 policy documents
│
├── mocks/
│   └── catalog.json         200 cleaned SKUs (Decathlon + FanFan), normalized fields
│
└── types/
    └── storefront.ts        All shared TypeScript interfaces
```

---

## 4. Medusa v2 Store API — Standard Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/store/products` | Product list (supports `?handle`, `?collection`, `?brand`, `?limit`, `?offset`, `?search`) |
| `GET` | `/store/products?handle={handle}` | Single product by handle |
| `GET` | `/store/collections` | All collections |
| `GET` | `/store/carts/{cart_id}` | Retrieve cart |
| `POST` | `/store/carts` | Create cart |

**Auth header required on all requests:**
```
x-publishable-api-key: {NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
```

---

## 5. Proposed Custom Endpoints — Backend Must Implement

The following 5 endpoints are called by the FE's `src/lib/api/client.ts`. They are **not** part of standard Medusa and must be implemented as custom routes or plugins.

### 5.1 `GET /store/gear-finder/config?activity=outdoor`

**Purpose:** Returns the ordered list of Wizard questions for a given activity group.

**Request:** `GET /store/gear-finder/config?activity=outdoor`

**Response (200):**
```json
[
  {
    "id": "activity_terrain",
    "step": 1,
    "eyebrow": "BƯỚC 1/8 — CUNG ĐƯỜNG",
    "title": "Bạn thường chinh phục cung đường dạng nào?",
    "type": "single_select",
    "required": true,
    "options": [
      { "value": "weekend_trek", "label": "Trekking cuối tuần", "icon": "🌿" }
    ]
  }
]
```

**Type definition:** `FinderQuestion[]` — see `src/types/storefront.ts`

---

### 5.2 `POST /store/gear-finder/recommendations`

**Purpose:** Receives user answers, runs recommendation engine, returns a recommendation ID and product/bundle matches with reason tags.

**Request body:**
```json
{
  "activity_terrain": "weekend_trek",
  "duration_days": 2,
  "group_size": 2,
  "climate_temp": "mild_temperate",
  "need_cooking": true,
  "carry_priority": "comfort"
}
```

**Response (201):**
```json
{
  "id": "REC-ABC123",
  "summary": {
    "packVolume": "45L – 55L",
    "totalEstimatedWeightGrams": 4200,
    "totalEstimatedWeightFormatted": "4.2kg",
    "weatherFit": "Kháng mưa PU 3000mm",
    "rationale": "Phù hợp cung đường trekking 2 ngày..."
  },
  "products": [
    {
      "slotId": "pack",
      "slotName": "1. Balo Chuyên Dụng",
      "product": { "id": "...", "name": "...", "price": 1290000 },
      "reasonTags": ["Khung trợ lực", "Thể tích 50L"],
      "reasonText": "Balo kỹ thuật đáp ứng hoàn hảo..."
    }
  ],
  "bundles": [
    {
      "id": "bundle-001",
      "title": "Gói Trekking Cuối Tuần",
      "reasonTags": ["Tiết kiệm 15%", "Đồng bộ trọng lượng"],
      "reasonText": "Gói trang bị trọn bộ..."
    }
  ]
}
```

> [!CAUTION]
> **STRICT:** Never include a `% match score` field. FE does not display it and the spec forbids it.

---

### 5.3 `GET /store/bundles/{handle}`

**Purpose:** Retrieve a single bundle by handle (slug), including all components with alternativeProducts pre-populated.

**Response (200):**
```json
{
  "id": "bundle-001",
  "handle": "goi-trekking-cuoi-tuan-sieu-nhe",
  "title": "Gói Trekking Cuối Tuần Siêu Nhẹ",
  "isAvailable": true,
  "tierDiscountRate": 0.15,
  "discountPercent": 15,
  "totalWeightGrams": 4200,
  "totalWeightFormatted": "4.2kg",
  "bundlePrice": 3421500,
  "savingsAmount": 603500,
  "components": [
    {
      "productId": "prod-001",
      "title": "Balo Trekking 50L",
      "required": true,
      "categoryGroup": "pack",
      "groupName": "1. Balo (The Pack)",
      "weightGrams": 1100,
      "price": 1290000,
      "thumbnail": "https://...",
      "stock": 12,
      "alternativeProductIds": ["prod-005", "prod-006"],
      "alternativeProducts": [...]
    }
  ]
}
```

---

### 5.4 `POST /store/bundles/{bundle_id}/preview`

**Purpose:** Live preview — recalculates price, weight, stock, discount tier when user swaps components.

**Request body:**
```json
{
  "components": ["prod-001", "prod-010", "prod-020", "prod-030", "prod-040"]
}
```

**Response (200):** Same shape as `GET /store/bundles/{handle}` above, with updated `bundlePrice`, `savingsAmount`, `tierDiscountRate`, `totalWeightGrams`.

> [!IMPORTANT]
> All tiered discount logic (3 items: 10%, 4 items: 15%, 5+ items: 20%) **must run on the backend**, not in the FE. This is an Adapter Boundary constraint.

---

### 5.5 `POST /store/carts/{cart_id}/bundles`

**Purpose:** Add an entire bundle (all selected components) to a Medusa cart as a grouped line-item unit.

**Request body:**
```json
{
  "bundleId": "bundle-001",
  "components": ["prod-001", "prod-010", "prod-020", "prod-030", "prod-040"],
  "quantity": 1
}
```

**Response (200):** Standard Medusa `Cart` object with bundle line items tagged with metadata `{ bundleId, bundleTitle }`.

---

## 6. Checklist: 8 Points for FE & BE to Align Before Integration

| # | Item | FE Status | Needs BE |
|---|------|-----------|---------|
| 1 | Product handle format (`slug` vs `id`) | Uses `handle` field | Confirm format matches `/store/products?handle=` |
| 2 | Product images URL scheme | Declared in `next.config.ts` remote patterns | Confirm CDN domains |
| 3 | Finder Config endpoint (`GET /store/gear-finder/config`) | Mock ready | Implement endpoint |
| 4 | Finder Recommendations endpoint (`POST /store/gear-finder/recommendations`) | Mock ready | Implement + store session |
| 5 | Bundle endpoints (3 endpoints) | Mock ready | Implement custom routes |
| 6 | Cart `bundleId` metadata tagging | Done in FE cart context | Medusa line-item `metadata` |
| 7 | Stock field: `stock` (number) | FE reads `product.stock` | Confirm field name from `/store/products` |
| 8 | Currency: all prices in VND (integer, no cents) | FE uses `Intl.NumberFormat("vi-VN")` | Confirm Medusa region currency = VND |

---

## 7. Open Questions for PO — Must Decide Before BE Integration (`OPEN-01` to `OPEN-10`)

| ID | Topic | Current FE Behavior | Decision Needed |
|----|-------|---------------------|-----------------|
| `OPEN-01` | **Company legal info** | Placeholder `[Chờ PO cập nhật...]` in `site-legal.ts` | Provide: Company name, MST, address, hotline, email |
| `OPEN-02` | **Hotline number** | Shows `[Chờ PO cập nhật]` in Header & MobileNav | Provide official hotline |
| `OPEN-03` | **BCT notification status** | Badge shows "ĐÃ THÔNG BÁO" | Confirm: Has BCT notification been filed? Link to online registration? |
| `OPEN-04` | **Finder session persistence** | Stored in browser `sessionStorage` | Should recommendations persist across devices? (requires user auth or server-side session) |
| `OPEN-05` | **Bundle "Customizable" vs "Ready-made"** | FE renders both states from `isCustomizable` flag | PO to decide which bundles are locked vs editable by SKU |
| `OPEN-06` | **VAT rate** | Hardcoded `vatRate: 0.08` (8%) in `site-legal.ts` | Confirm current VAT rate applicable to sporting goods |
| `OPEN-07` | **Free shipping threshold** | 500,000 đ (from spec) | Confirm final threshold and whether it applies post-discount or pre-discount |
| `OPEN-08` | **Express shipping fee** | 55,000 đ hardcoded in checkout | Is this dynamic per zone? Who is the carrier? |
| `OPEN-09` | **User authentication** | No auth in P1/P2 | Will wishlist, order history require login? When will auth be integrated? |
| `OPEN-10` | **Review/Rating system** | Intentionally absent (anti-fake rule) | If PO wants reviews, they must come from verified purchases only (not mock stars) |

---

## 8. Phase P2 QA Summary

### 8 UI States — Implementation Status

| State | Implementation |
|-------|---------------|
| **Loading / Skeleton** | Shimmer skeletons in SearchOverlay, GearFinderWizard submit screen, BundleDetailView preview |
| **Empty State** | Cart empty page, Finder results (per-tab), PLP no results with "Reset filter" CTA |
| **Error State** | Checkout form errors (friendly, no stack trace), Finder submit catch block |
| **Out of Stock** | ProductCard badge + disabled button; Bundle component lock + unavailable warning |
| **Variant Required** | PDP requires color/size selection before Add to Cart (button locked) |
| **Double Submit Protection** | Checkout "Place Order" button disabled + spinner during submit; Cart qty buttons have `updatingId` guard |
| **Price/Inventory Changed** | Toast notification system in cart-context; freeship bar updates reactively |
| **Network Lost** | Checkout shows user-friendly error message, form data preserved in React state |

### Accessibility Compliance

- ✅ Semantic HTML (`button`, `a`, `input`, `label`, `nav`, `header`, `footer`, `main`, `section`)
- ✅ `aria-label` on icon-only buttons (cart, mobile menu, quantity controls)
- ✅ `role="dialog" aria-modal="true"` on Modal, MobileNav, SearchOverlay
- ✅ Esc key closes SearchOverlay and MobileNav
- ✅ Focus ring: `*:focus-visible { outline: 2px solid #F97316; outline-offset: 2px; }`
- ✅ `prefers-reduced-motion` respected in `globals.css`
- ✅ Touch targets ≥ 44×44px on all interactive elements
- ✅ `alt` text on all product images

### Anti-Fake Compliance

- ✅ No fake star ratings or review counts anywhere
- ✅ No `% match score` in Finder results (uses concrete `reasonTags`)
- ✅ No fake hotline in Header (pending PO confirmation)
- ✅ All bundle discounts computed in `mock-adapter.ts`
- ✅ Checkout legal checkbox unchecked by default

### Vietnam E-Commerce Legal Compliance

- ✅ 5 policy pages at `/policies/[slug]` with legal citations
- ✅ Checkout: legal checkbox not pre-checked, blocks order if unchecked
- ✅ Price shown inclusive of VAT 8%, shipping shown separately
- ✅ BCT badge in footer
- ✅ Company info placeholders ready for PO to fill

---

## 9. Files for PO Review

| File | Purpose |
|------|---------|
| [`src/config/site-legal.ts`](src/config/site-legal.ts) | Fill in real company legal info |
| [`AGENTS.md`](AGENTS.md) | Design token rules & anti-fake constraints for future devs |
| [`src/mocks/catalog.json`](src/mocks/catalog.json) | 200 normalized SKUs from Decathlon + FanFan (mock data) |
| [`.env.example`](.env.example) | Env variables needed for deployment |
