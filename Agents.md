# 🤖 Agent Instructions

> Context file for AI coding assistants (Copilot, Cursor, Cline, etc.)

## 📚 Knowledge Base (llms.txt)

| Resource | Overview | Full Docs |
|----------|----------|-----------|
| **NuxtHub** | [llms.txt](https://hub.nuxt.com/llms.txt) | [llms-full.txt](https://hub.nuxt.com/llms-full.txt) |
| **Nuxt** | [llms.txt](https://nuxt.com/llms.txt) | [llms-full.txt](https://nuxt.com/llms-full.txt) |
| **bunny.net** | [docs.bunny.net](https://docs.bunny.net) | — |
| **Nuxt UI** | [llms.txt](https://ui.nuxt.com/llms.txt) | [llms-full.txt](https://ui.nuxt.com/llms-full.txt) |
| **Nitro** (Server Engine) | [llms.txt](https://nitro.build/llms.txt) | [llms-full.txt](https://nitro.build/llms-full.txt) |
| **Drizzle ORM** | [llms.txt](https://orm.drizzle.team/llms.txt) | [llms-full.txt](https://orm.drizzle.team/llms-full.txt) |
| **h3** (HTTP Framework) | [llms.txt](https://h3.dev/llms.txt) | [llms-full.txt](https://h3.dev/llms-full.txt) |
| **Nuxt Content** | [llms.txt](https://content.nuxt.com/llms.txt) | [llms-full.txt](https://content.nuxt.com/llms-full.txt) |
| **unstorage** (KV/Blob) | [llms.txt](https://unstorage.unjs.io/llms.txt) | — |
| **Nuxt Studio** | [llms.txt](https://nuxt.studio/llms.txt) | [llms-full.txt](https://nuxt.studio/llms-full.txt) |

## Project

NuxtHub full-stack starter on bunny.net Magic Containers.

- **Framework**: Nuxt 4 with `future.compatibilityVersion: 5`
- **Database**: Drizzle ORM + db0 (SQLite/libSQL)
- **Runtime**: Bun >=1.3 (Nitro `bun` preset — single-process)
- **Cache/KV**: Redis 7 sidecar (recommended; 8 requires custom startup command)
- **CDN**: Bunny CDN
- **UI**: Nuxt UI v4 + Tailwind CSS v4

## Database

- Schema: `server/db/schema.ts` (NuxtHub auto-scans)
- Drizzle instance: `db` is auto-imported from `@nuxthub/core`
- Schema tables alias: `tables` exported from `server/utils/drizzle.ts`
- Config: `nuxt.config.ts` → `hub.db` — **never** create `drizzle.config.ts` manually
- Docker/CI: `applyMigrationsDuringBuild: false` — run `npx nuxt db migrate` in CI
- ⚠️ Use `npx` (not `bunx`) for `db migrate` — `@libsql/client` HTTP transport issue with Bun

```bash
vim server/db/schema.ts    # 1. Edit schema
bunx nuxt db generate      # 2. Generate migration
npx nuxt db migrate        # 3. Apply migration (use npx!)
```

## ID Strategy

- **PKs**: UUIDv7 as `BLOB(16)` via `binaryUuid()` — `newPk()`
- **Slugs**: `nanoid(21)` — `newSlug()`
- **Secrets**: `nanoid(48)` — `newKey()`
- Helpers in `server/utils/id.ts`

## Auth

- **Provider-agnostic**: `SessionUser` with `id`, `provider`, `name`, `email`, `phone`, `avatarUrl`
- **Type**: `AuthProvider = 'github' | 'google' | 'line' | 'telegram' | 'email' | 'phone'`
- **Types**: `shared/types/auth.ts` (auto-imported in both server/client)
- **Augmentation**: `#auth-utils` module augmentation in root `auth.d.ts`
- **New provider**: add route in `server/routes/auth/<provider>.get.ts` + add to `AuthProvider` union

## Utilities

- **Batch insert**: `batchInsert(insertFn, items, batchSize?)` — SQLite optimal at 20–50 rows/tx (`server/utils/batch.ts`)
- **Token hashing**: `hashToken(token)` / `verifyToken(token, hash)` — SHA-256 via Web Crypto API (`server/utils/crypto.ts`)
- Both are auto-imported by Nitro in server context

## NuxtHub SDK

```typescript
// `db` is auto-imported by @nuxthub/core — do NOT import manually
// `tables` is auto-imported from server/utils/drizzle.ts

// Blob storage (NuxtHub v0.10+ recommended import)
import { blob } from '@nuxthub/blob'
// or auto-imported: blob.list(), blob.put(), blob.del(), blob.serve()
// ensureBlob() is also auto-imported — no explicit import needed

// KV storage (NuxtHub v0.10+ recommended import)
import { kv } from '@nuxthub/kv'
// or auto-imported: kv.get(), kv.set(), kv.del(), kv.keys()

// ⚠️ Legacy — still works but NOT recommended:
// import { blob } from 'hub:blob'
// import { kv } from 'hub:kv'

// Cache — no import needed:
export default cachedEventHandler(() => {}, { maxAge: 60 })
```

## Redis

- **For**: Sessions, Rate Limiting, KV Storage (production)
- **URL**: `REDIS_URL` env var (default `redis://127.0.0.1:6379`)
- **Config**: `$production.nitro.storage.sessions` / `rateLimit` use `{ driver: 'redis' }`
- **KV**: `$production.hub.kv` uses `{ driver: 'redis' }`
- **Client**: `useStorage('rateLimit')` via unstorage Redis driver (`server/middleware/rate-limit.ts`)
- ⚠️ Use `redis:7-alpine` (official Bunny recommendation). Redis 8 has known permission issues with persistent volumes on Magic Containers.

## Image Optimization

- **Dev**: `ipx` (self-hosted)
- **Prod**: `bunny` provider — set `BUNNY_CDN_URL`

## Deployment

- Nitro `bun` preset → single-process, auto-detects available memory
- Docker: Nuxt app + Redis sidecar, **non-root** `USER bun` (UID 1000)
- CI/CD: `.github/workflows/deploy.yml` (multi-environment) with GHA Docker layer cache
- Environments: `production` (main→latest), `staging` (stg→stg), `preview` (manual→prev)
- Bunny naming: `nuxthub-b` / `nuxthub-b-stg` / `nuxthub-b-prev` (≤16 chars)
- Secrets (per env): `BUNNYNET_API_KEY`, `LIBSQL_URL`, `LIBSQL_AUTH_TOKEN`
- Variables (per env): `BUNNY_APP_ID`, `BUNNY_CONTAINER_NAME`
- Release: `bun run release` — changelogen (changelog + version bump + tag + push)

## Content Rendering

- ContentRenderer uses `:prose="false"` — renders `<p>`, `<h2>`, etc. as native HTML
- Without `:prose="false"`, prose components (ProseP, ProseH2…) are lazy-loaded via `defineAsyncComponent()`, causing text to disappear during client hydration
- Custom MDC components go in `app/components/content/` (e.g., `StudioVideo.vue`)
- ⚠️ Component names must NOT collide with HTML tags (e.g., use `StudioVideo`, not `Video`)
- Use block MDC syntax `::studio-video{props}::` — inline `:video{props}` may be dropped by minimark
- ⚠️ Known limitation: custom MDC block components don't render in Studio's live preview (minimark parser drops them during delta updates)

## Nuxt Studio

- Self-hosted content editing via `nuxt-studio` module
- Repo config: `studio.repository` in `nuxt.config.ts`
- Auth: `STUDIO_GITHUB_CLIENT_ID` + `STUDIO_GITHUB_CLIENT_SECRET`
  or SSO: `STUDIO_SSO_URL` + `STUDIO_SSO_CLIENT_ID` + `STUDIO_SSO_CLIENT_SECRET`
- Content files: `content/` directory (Nuxt Content v3)
- ⚠️ Known issue: false "Conflict Detected" due to AST parser mismatch (upstream [#251](https://github.com/nuxt-content/nuxt-studio/issues/251))
- Workaround: Vite plugin in `nuxt.config.ts` → `isDocumentMatchingContent` returns `true`
- ⚠️ Studio auto-formatter strips raw HTML tags from markdown — use MDC syntax instead

## Nuxt 5

- `future.compatibilityVersion: 5` enabled
- `app.config.ts` uses plain `export default {}` (no `defineAppConfig`)
- Vite Environment API enabled
- `clearNuxtState` resets to defaults

## Validation

- Server-side request validation: `server/utils/validation.ts`
- Uses `h3` validator functions (`getValidatedQuery`, `readValidatedBody`)
- Schema: `zod` v4

## Code Style

- 2 spaces, LF endings
- Always `defineEventHandler()` (not `eventHandler()`)
- `@nuxt/eslint` — `commaDangle: 'never'`, `braceStyle: '1tbs'`
- Lint: `bun run lint` / `bun run lint --fix`
