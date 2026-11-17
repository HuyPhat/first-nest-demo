# Các file cấu hình của `web/`

Giải thích vì sao `web/` có `eslint.config.mjs`, `next.config.ts`, `tsconfig.json` và `pnpm-workspace.yaml`, và nội dung của từng file. Cả bốn file được tạo cùng lúc trong PR #23, khi dựng web app (Next 16.4.6, pnpm 12.18.0, tra ngày 2026-11-17).

Điều quan trọng cần nắm: **mỗi file là "cài đặt" cho một công cụ khác nhau**, và công cụ đó tự đọc file khi chạy.

| File | Công cụ đọc nó | Khi nào |
|---|---|---|
| [eslint.config.mjs](../web/eslint.config.mjs) | ESLint | `pnpm lint` |
| [next.config.ts](../web/next.config.ts) | Next.js | `pnpm dev`, `pnpm build`, `pnpm start` |
| [tsconfig.json](../web/tsconfig.json) | TypeScript (`tsc`) và trình soạn thảo | `tsc --noEmit`, khi mở file trong IDE |
| [pnpm-workspace.yaml](../web/pnpm-workspace.yaml) | pnpm | `pnpm install` |

---

## 1. eslint.config.mjs: luật kiểm tra code

**Vì sao có:** lệnh `pnpm lint` trong `package.json` chạy thẳng `eslint`, và ESLint cần một file cấu hình mới biết phải kiểm tra theo luật nào. Next 16 đã **bỏ lệnh `next lint`** (docs: *"The `next lint` command has been removed. Use Biome or ESLint directly"*), nên dự án dùng ESLint trực tiếp.

**Vì sao đuôi `.mjs`:** file dùng `import`, nhưng `web/package.json` không có trường `"type"`, nên các file `.js` mặc định là CommonJS. Đuôi `.mjs` báo "đây là ES module".

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```
Nạp hai bộ luật có sẵn của Next và hai hàm trợ giúp của ESLint.

```js
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
export default eslintConfig;
```
- `defineConfig([...])` là một **danh sách các khối cấu hình** (kiểu "flat config" của ESLint 9). Khối sau ghi đè khối trước.
- `...nextVitals`: luật của Next cho React và Next, gồm cả các luật về Core Web Vitals (chỉ số hiệu năng của Google) bị nâng lên mức lỗi. Luật `react-hooks/rules-of-hooks` bắt lỗi ở PR luyện tập CI đến từ nhóm này.
- `...nextTs`: luật dành cho TypeScript.
- `globalIgnores`: các file ESLint **bỏ qua**: `.next/` (thư mục build), `out/`, `build/` và `next-env.d.ts` (do Next sinh ra). Chú thích trong file nói đây là danh sách mặc định, được ghi lại tường minh.

---

## 2. next.config.ts: cấu hình Next.js

**Vì sao có:** Next chạy được không cần file này, nhưng dự án cần ba thứ mặc định không có: proxy `/api`, Cache Components và loader cho Tailwind.

```ts
import type { NextConfig } from "next";
import { apiUrl } from "./lib/api-url";
const nextConfig: NextConfig = { ... };
export default nextConfig;
```
`NextConfig` là kiểu dữ liệu giúp IDE gợi ý và báo lỗi tên tuỳ chọn. Đuôi `.ts` được Next hỗ trợ trực tiếp.

```ts
rewrites: async () => [
  { source: "/api/:path*", destination: `${apiUrl()}/:path*` },
],
```
Quy tắc "**rewrite**": khi trình duyệt gọi `/api/auth/login` tới web (cổng 3001), Next chuyển tiếp ngầm tới `API_URL/auth/login`. Trình duyệt chỉ thấy một origin nên không có CORS, đúng ADR 0001. `:path*` khớp mọi phần phía sau.

`apiUrl()` nằm trong `web/lib/api-url.ts` và là nơi duy nhất quyết định địa chỉ API (trang profile cũng gọi nó). Nó trả về `API_URL` nếu đã đặt. Nếu thiếu hoặc để trống: ở development dùng `http://localhost:3000`, còn ở production **ném lỗi** `API_URL is required in production`, để bản build không lặng lẽ trỏ về localhost. `next typegen` cũng nạp cấu hình ở chế độ production nên cũng cần `API_URL` (CI đặt sẵn cho bước này).

Lưu ý: file `.next/routes-manifest.json` (sinh khi build) chứa sẵn URL đích đã tính, ví dụ build với `API_URL=https://api.example.com` cho `"destination": "https://api.example.com/:path*"`. Tức **rewrite được tính tại thời điểm build và ghi cứng vào kết quả**. Khi triển khai thật, `API_URL` phải được đặt **lúc build**, không chỉ lúc chạy.

```ts
cacheComponents: true,
partialPrefetching: true,
```
Bật mô hình Cache Components và Partial Prefetching. Bỏ `partialPrefetching` sẽ in cảnh báo ở mọi lần build.

```ts
turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
```
Turbopack là bộ đóng gói của Next. Khi gặp file `.css`, nó cho file đi qua loader `@tailwindcss/turbopack` trước (loader này đọc `@import "tailwindcss"` rồi sinh ra các class như `px-6`, `text-sm` mà code đang dùng). `as: "*.css"` nghĩa là kết quả vẫn được coi là CSS.

---

## 3. tsconfig.json: cấu hình TypeScript

**Vì sao có:** `tsc --noEmit` (trong CI) và IDE đều cần biết kiểm tra kiểu theo quy tắc nào, và kiểm tra những file nào. Chú ý: **Next mới là bên biên dịch code**, TypeScript ở đây chỉ để **kiểm tra kiểu**.

| Tuỳ chọn | Ý nghĩa |
|---|---|
| `"strict": true` | Bật toàn bộ kiểm tra nghiêm ngặt (không cho `any` ngầm, kiểm tra `null`…). Quan trọng nhất |
| `"noEmit": true` | Chỉ kiểm tra, **không ghi file `.js`**. Đó là lý do CI chạy `tsc --noEmit` |
| `"target": "ES2017"` | Mức cú pháp JavaScript mà TS coi là đích. Vì `noEmit` nên ít ảnh hưởng thực tế |
| `"lib": ["dom", "dom.iterable", "esnext"]` | Bộ kiểu có sẵn: API trình duyệt (`document`, `fetch`…) và JavaScript mới nhất |
| `"module": "esnext"` | Dùng cú pháp `import`/`export` |
| `"moduleResolution": "bundler"` | Tìm file khi `import` **như bộ đóng gói**: cho phép bỏ đuôi (`"./login-form"` chứ không cần `.js`). Dự án `api/` thì ngược lại, viết `'./app.module.js'` |
| `"jsx": "react-jsx"` | Dùng cách biên dịch JSX mới, không cần `import React` ở đầu file |
| `"isolatedModules": true` | Mỗi file phải biên dịch được riêng lẻ (yêu cầu của trình biên dịch nhanh như SWC của Next) |
| `"skipLibCheck": true` | Bỏ qua kiểm tra file `.d.ts` trong `node_modules`, chạy nhanh hơn |
| `"esModuleInterop"`, `"resolveJsonModule"`, `"allowJs"` | Tương thích khi import thư viện CommonJS, import file `.json`, cho phép file `.js` |
| `"incremental": true` | Lưu thông tin của lần chạy trước để lần sau nhanh hơn |
| `"plugins": [{ "name": "next" }]` | Plugin **chỉ cho IDE**: thêm gợi ý và báo lỗi riêng của Next (ví dụ quên `"use client"`) |
| `"paths": { "@/*": ["./*"] }` | Cho phép viết `@/app/...` thay cho đường dẫn tương đối. **Dự án hiện chưa dùng**: có 0 chỗ import `@/` (đây là mặc định của scaffold) |

```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx",
            ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
"exclude": ["node_modules"]
```
Danh sách file `tsc` kiểm tra. Hai dòng `.next/types` và `.next/dev/types` là **các file kiểu do Next sinh ra** (như `LayoutProps`). Từ đây giải thích được hai chuyện đã gặp:
- CI từng đỏ vì checkout mới chưa có các file này (sửa bằng `next typegen`).
- Sau khi chuyển `/profile` vào nhóm `(app)`, `tsc` báo thiếu `app/profile/page.js` vì file kiểu cũ trong `.next/dev/types` còn trỏ đường dẫn cũ.

---

## 4. pnpm-workspace.yaml: quyền chạy script khi cài thư viện

**Vì sao tên là "workspace" mà dự án không phải monorepo:** từ các bản pnpm mới, file này cũng là nơi đặt **cài đặt của pnpm cho dự án**. Docs ghi pnpm đọc cấu hình từ dòng lệnh, biến môi trường và `pnpm-workspace.yaml`, và nếu thiếu trường `packages` thì chỉ gói gốc nằm trong workspace. `api/` và `web/` là hai dự án độc lập, mỗi bên có lockfile riêng, nên mỗi bên có một file riêng. Không có file nào ở thư mục gốc.

```yaml
allowBuilds:
  sharp: false
  unrs-resolver: false
```

**Cơ chế:** một số thư viện có script chạy sau khi cài (`postinstall`, thường để biên dịch hoặc tải bản nhị phân). Script này chạy mã tuỳ ý trên máy, nên pnpm **mặc định chặn**. Docs ghi: *"Lifecycle scripts run only for packages you have approved"*, và thư viện chưa được duyệt làm `pnpm install` **báo lỗi** `ERR_PNPM_IGNORED_BUILDS`. pnpm tự thêm các mục đó vào file để chọn `true` (cho chạy) hoặc `false` (chặn).

| Thư viện | Ai kéo nó vào | Lựa chọn | Lý do |
|---|---|---|---|
| `sharp` (web) | `next` | `false` | Thư viện xử lý ảnh bản địa của Next. Chặn script build |
| `unrs-resolver` (web) | `eslint-config-next` | `false` | Trình phân giải bản địa dùng cho ESLint |
| `argon2` (api) | chính `api` | `true` | Băm mật khẩu bằng mã bản địa, cần bước cài/build của nó nên phải cho phép |
| `@scarf/scarf` (api) | `swagger-ui-dist` | `false` | Gói thống kê sử dụng, chạy script để gửi thông tin ra ngoài, không cần cho ứng dụng |

Về các lựa chọn `false`: lint, `tsc` và bộ e2e vẫn xanh trên CI với cấu hình này, nên chúng không cần các script bị chặn. Tuy nhiên chưa kiểm tra sâu cơ chế bên trong `sharp` và `unrs-resolver`, và dự án chưa dùng `next/image`. Nếu sau này dùng ảnh mà thấy cảnh báo về `sharp`, hãy xem lại dòng này.

---

## Tóm lại, nếu xoá từng file

| Xoá | Hậu quả |
|---|---|
| `eslint.config.mjs` | `pnpm lint` báo lỗi không tìm thấy cấu hình |
| `next.config.ts` | Mất proxy `/api` (đăng nhập hỏng), mất Cache Components, Tailwind không được xử lý |
| `tsconfig.json` | `tsc` không biết phải kiểm tra gì, Next tự tạo lại file mặc định khi chạy |
| `pnpm-workspace.yaml` | `pnpm install` có thể lại báo `ERR_PNPM_IGNORED_BUILDS` cho `sharp` và `unrs-resolver` |
