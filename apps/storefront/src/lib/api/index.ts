// ─────────────────────────────────────────────────────────────────────────────
// Unified Store API Boundary
// Transparently switches between MedusaJS v2 Store Client and Mock Adapter
// ─────────────────────────────────────────────────────────────────────────────

import { medusaClient } from './client'
import { mockAdapter } from './mock-adapter'

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'

export const storeApi = mockAdapter // Using mock adapter with Medusa-ready signature in current phase

export { mockAdapter, medusaClient }
