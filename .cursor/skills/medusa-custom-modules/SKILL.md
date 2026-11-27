---
name: medusa-custom-modules
description: Hướng dẫn tạo Custom Module, Data Model (DML), Service, Workflow và API Routes trong MedusaJS v2 cho backend Peakgear. Kích hoạt khi thêm bảng database mới, viết API backend hoặc mở rộng logic Medusa.
---

# Quy trình phát triển Custom Module trên MedusaJS v2

Khi được yêu cầu tạo module mới trong `apps/backend/src/modules/<module-name>/`, luôn tuân thủ đúng 4 bước sau:

## 1. Định nghĩa Data Model (`models/<model-name>.ts`)
Sử dụng `model` từ `@medusajs/framework/utils`:
```ts
import { model } from "@medusajs/framework/utils"

export const ExampleModel = model.define("example_table", {
  id: model.id().primaryKey(),
  name: model.text(),
  metadata: model.json().nullable(),
})
```

## 2. Tạo Module Service (`service.ts`)
Kế thừa `MedusaService` để tự động có sẵn các hàm CRUD (`createExamples`, `listExamples`, `retrieveExample`, `updateExamples`, `deleteExamples`):
```ts
import { MedusaService } from "@medusajs/framework/utils"
import { ExampleModel } from "./models/example"

class ExampleModuleService extends MedusaService({
  ExampleModel,
}) {}

export default ExampleModuleService
```

## 3. Đăng ký Module (`index.ts` và `medusa-config.ts`)
- Export `Module` từ `@medusajs/framework/utils` trong `src/modules/<module-name>/index.ts`:
```ts
import { Module } from "@medusajs/framework/utils"
import ExampleModuleService from "./service"

export const EXAMPLE_MODULE = "exampleModuleService"

export default Module(EXAMPLE_MODULE, {
  service: ExampleModuleService,
})
```
- Khai báo module vào mảng `modules` trong `apps/backend/medusa-config.ts`:
```ts
modules: [
  {
    resolve: "./src/modules/<module-name>",
  },
]
```
- Nhắc người dùng chạy lệnh tạo migration và đồng bộ lên Supabase:
  `npx medusa db:generate <module-name> && npx medusa db:migrate`

## 4. Tạo API Route (`src/api/store/<endpoint>/route.ts`)
- Resolve service qua `req.scope.resolve(EXAMPLE_MODULE)`.
- Luôn validate input đầu vào (dùng Zod nếu có) và trả về HTTP status chuẩn (`200`, `201`, `400`, `404`):
```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { EXAMPLE_MODULE } from "../../../modules/<module-name>"
import ExampleModuleService from "../../../modules/<module-name>/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ExampleModuleService = req.scope.resolve(EXAMPLE_MODULE)
  const items = await service.listExamples()
  res.status(200).json({ items })
}
```