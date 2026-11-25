# PeakGear Storefront

> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Inter font  
> **Data:** Mock JSON adapter → MedusaJS v2 Store API adapter (flip `NEXT_PUBLIC_USE_MOCK_DATA`)  
> **Phase status:** P0 (Design System) ✅ · P1 (Custom Features) ✅ · P2 (Polish/QA) ✅

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env.local
# Edit .env.local if needed (default: mock data)

# Dev server (Turbopack)
npm run dev
# → http://localhost:3000

# Production build check
npm run build

# Type-check only (no emit)
npx tsc --noEmit
```

---

## Directory Structure

```
peakgear-storefront/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Homepage
│   │   ├── collections/[handle]/   # PLP (Product Listing Page)
│   │   ├── products/[handle]/      # PDP (Product Detail Page)
│   │   ├── gear-finder/            # Smart Gear-Finder Wizard
│   │   │   └── results/[id]/       # Finder Results (dedicated route)
│   │   ├── bundles/[handle]/       # Smart Bundle Detail
│   │   ├── cart/                   # Cart Page (BundleCartGroup)
│   │   ├── checkout/               # Checkout (NĐ 52/2013 compliant)
│   │   ├── order/confirmed/        # Post-order confirmation
│   │   └── policies/[slug]/        # 5 Legal Policy pages
│   ├── components/
│   │   ├── layout/                 # SiteHeader, Footer, MobileNav, SearchOverlay
│   │   ├── product/                # ProductCard, ProductDetailView, SortSelect, FilterDrawer
│   │   ├── bundle/                 # BundleCard, BundleDetailView
│   │   ├── finder/                 # GearFinderWizard, FinderResultsView
│   │   ├── cart/                   # CartDrawer
│   │   └── ui/                     # ToastContainer
│   ├── lib/
│   │   ├── api/
│   │   │   ├── index.ts            # Exports storeApi (mock or live)
│   │   │   ├── mock-adapter.ts     # Full Mock Adapter (all business logic here)
│   │   │   └── client.ts           # MedusaJS v2 live client (ready for BE)
│   │   └── cart-context.tsx        # Global Cart & Drawer state (localStorage)
│   ├── config/
│   │   └── site-legal.ts           # VN e-commerce legal config & 5 policies
│   ├── mocks/
│   │   └── catalog.json            # Cleaned product data (200 SKUs)
│   └── types/
│       └── storefront.ts           # All shared TypeScript interfaces
├── AGENTS.md                       # Design token rules & anti-fake constraints
├── HANDOFF.md                      # Technical handoff doc for BE team & PO
├── .env.example                    # Env template
└── next.config.ts                  # Remote image patterns
```

---

## Key Design Decisions

| Decision | Detail |
|---|---|
| **Adapter Boundary** | All business logic (prices, discounts, stock) in `mock-adapter.ts`. Components only call `storeApi.*` |
| **No hardcoded prices** | Tiered bundle discounts (3→10%, 4→15%, 5+→20%) computed in `previewBundleCustomization` |
| **Anti-fake** | No fake ratings, no `% match` score, no fake phone/address |
| **Legal** | Checkbox not pre-checked, VAT shown, 5 policy pages at `/policies/[slug]` |
| **Accessibility** | Semantic HTML, Esc closes modals, focus rings, `prefers-reduced-motion` |

---

## Environment Variables

See [.env.example](.env.example) for full list. Key vars:

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `http://localhost:9000` | Medusa v2 BE URL |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | `pk_test_...` | Medusa API key |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` | Use mock adapter |

---

## Available Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Homepage with hero, featured products |
| `/collections/[handle]` | Dynamic SSR | PLP with sidebar filters, pagination |
| `/products/[handle]` | Dynamic SSR | PDP with variants, trust signals, bundle CTA |
| `/gear-finder` | Static | Gear-Finder Wizard (config-driven) |
| `/gear-finder/results/[id]` | Dynamic SSR | Finder Results (2 tabs) |
| `/bundles/[handle]` | Dynamic SSR | Smart Bundle detail + customizer |
| `/cart` | Static client | Cart with BundleCartGroup |
| `/checkout` | Static client | Checkout (legal compliant) |
| `/order/confirmed` | Dynamic | Order confirmation |
| `/policies/[slug]` | Static SSG | 5 legal policy pages |

---

## Switching from Mock to Live Backend

1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
2. Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to your deployed Medusa URL  
3. Set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` from Medusa Admin  
4. The 5 Custom Endpoints must be deployed — see [HANDOFF.md](HANDOFF.md) for specs  
5. Update `src/lib/api/index.ts` to export `medusaClient` instead of `storeApi`

---

## For further technical details, see [HANDOFF.md](HANDOFF.md)
