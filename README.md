# Nuxt<span style="color:#00DC82">Hub</span> × bunny.net Starter ✨

[![hero-banner](.github/assets/hero-banner.png)](https://github.com/iPLAYCAFE/nuxthub-bunny-starter)

[![Nuxt][nuxt-src]][nuxt-href]
[![NuxtHub][nuxthub-src]][nuxthub-href]
[![bunny.net][bunny-src]][bunny-href]
[![Bun][bun-src]][bun-href]
[![License][license-src]][license-href]

Full-stack starter template built with [**NuxtHub**](https://hub.nuxt.com) and deployed on [**bunny.net Magic Containers**](https://docs.bunny.net/magic-containers) with Bun runtime.

- [✨ &nbsp;Features](#-features)
- [🚀 &nbsp;Quick Start](#-quick-start)
- [🐳 &nbsp;Production Deployment](#-production-deployment)
- [📁 &nbsp;Project Structure](#-project-structure)
- [🛠 &nbsp;Tech Stack](#-tech-stack)
- [🛠 &nbsp;Development](#-development)
- [📚 &nbsp;Resources](#-resources)
- [📄 &nbsp;License](#-license)

---

## ✨ Features

### NuxtHub Data Layer

NuxtHub provides a unified data layer — works locally with zero config in dev, and scales to production:

- [**SQL Database**](https://hub.nuxt.com/docs/database) — Drizzle ORM + db0 → Bunny Database (libSQL) in production
- [**Blob Storage**](https://hub.nuxt.com/docs/blob) — unstorage S3 → Bunny Storage (geo-replicated)
- [**KV Storage**](https://hub.nuxt.com/docs/kv) — unstorage Redis → Redis sidecar on Magic Containers
- [**Caching**](https://hub.nuxt.com/docs/cache) — `cachedEventHandler` → Bunny CDN edge (TTL-based)

### 🐰 10 bunny.net Services

`Magic Containers` · `CDN` · `Database` · `Storage` · `Stream` · `Optimizer` · `DNS` · `Shield` · `Edge Scripting` · `Fonts`

### 📦 20 Nuxt Modules

<details>
<summary>View all modules</summary>

| Module | Purpose |
|--------|---------|
| [@nuxthub/core](https://hub.nuxt.com) | Full-stack data layer (DB, Blob, KV, Cache) |
| [Nuxt UI](https://ui.nuxt.com) | 50+ components with dark mode |
| [Nuxt Content](https://content.nuxt.com) | Git-based CMS with MDC syntax |
| [Nuxt Studio](https://nuxt.studio) | Self-hosted content editing |
| [Nuxt Image](https://image.nuxt.com) | Bunny Optimizer in production |
| [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) | OAuth + encrypted sessions |
| [nuxt-security](https://nuxt-security.vercel.app) | Security headers + CSRF |
| [nuxt-og-image](https://nuxtseo.com/og-image) | Dynamic OG images |
| [@nuxtjs/sitemap](https://nuxtseo.com/sitemap) | Auto-generated sitemap |
| [@nuxtjs/robots](https://nuxtseo.com/robots) | robots.txt management |
| [nuxt-llms](https://github.com/nuxtlabs/nuxt-llms) | AI-ready `/llms.txt` |
| [@nuxtjs/i18n](https://i18n.nuxtjs.org) | EN/TH/ZH translations |
| [Nuxt Scripts](https://scripts.nuxt.com) | Performance-optimized script loading |
| [Nuxt Fonts](https://fonts.nuxt.com) | Bunny Fonts (GDPR-compliant) |
| [Nuxt Hints](https://github.com/nuxt/hints) | Resource hints (preload/prefetch) |
| [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app) | Installable PWA |
| [nuxt-qrcode](https://github.com/prazdevs/nuxt-qrcode) | QR code generation |
| [Nuxt A11y](https://github.com/nuxt/a11y) | Accessibility auditing (dev) |
| [@nuxt/eslint](https://eslint.nuxt.com) | ESLint integration |
| [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) | Testing utilities |

</details>

### 🔐 Security

- GitHub OAuth with encrypted cookie sessions ([nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils))
- CSRF protection via [nuxt-security](https://nuxt-security.vercel.app) headers
- Redis-backed rate limiting (60 req/min per IP)

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) >=1.3
- Git

### 1. Clone & Install

```bash
git clone https://github.com/iPLAYCAFE/nuxthub-bunny-starter.git
cd nuxthub-bunny-starter
bun install
```

### 2. Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) — everything works out of the box with zero configuration:

| Feature | Dev Mode | Production |
|---------|----------|------------|
| 💾 Database | SQLite at `.data/db/sqlite.db` | Bunny Database (libSQL) |
| 🔑 KV/Cache | Filesystem at `.data/kv/` | Redis sidecar |
| 📦 Blob | Filesystem at `.data/blob/` | Bunny Storage (S3) |
| 🔐 Sessions | In-memory | Redis (encrypted cookies) |

### 3. Environment Variables (optional in dev)

```bash
cp .env.example .env
```

All variables are pre-documented in [`.env.example`](.env.example). None are required for local development.

---

## 🐳 Production Deployment

This section covers deploying to **bunny.net Magic Containers** from scratch.

### Step 1 — Create bunny.net Services

#### 1a. Bunny Database

1. Go to [bunny.net Dashboard](https://dash.bunny.net) → **Database**
2. Create a new database
3. Go to **Access** → **Generate Token**
4. Save your credentials:

```env
LIBSQL_URL=libsql://your-db.lite.bunnydb.net
LIBSQL_AUTH_TOKEN=your-database-token
```

> 📖 [Bunny Database docs](https://docs.bunny.net/database)

#### 1b. Bunny Storage (Blob)

1. Go to **Storage** → Create a new **Storage Zone**
2. Enable **S3 API Compatibility** on the zone
3. Note your credentials:

```env
S3_ACCESS_KEY_ID=your-storage-zone-name
S3_SECRET_ACCESS_KEY=your-storage-zone-password
S3_BUCKET=your-storage-zone-name
S3_ENDPOINT=https://sg-s3.storage.bunnycdn.com
S3_REGION=sg
```

> Available regions: `de` (Frankfurt), `ny` (New York), `sg` (Singapore)
>
> 📖 [Bunny Storage S3 docs](https://docs.bunny.net/storage/s3)

#### 1c. Bunny CDN (Image Optimization)

Magic Containers automatically creates a Pull Zone for your app. After deploying (Step 4), get the CDN URL from the **Magic Containers** dashboard:

```env
BUNNY_CDN_URL=https://your-pullzone.b-cdn.net
```

> 📖 [Bunny CDN docs](https://docs.bunny.net/cdn)

#### 1d. Bunny Stream (Optional — Video Demo)

1. Go to **Stream** → Create a **Video Library**
2. Upload a video and get the Library ID + Video ID:

```env
NUXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID=your-library-id
NUXT_PUBLIC_BUNNY_STREAM_VIDEO_ID=your-video-id
```

> 📖 [Bunny Stream docs](https://docs.bunny.net/stream)

### Step 2 — Set Up Authentication

#### 2a. GitHub OAuth

1. Go to [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App:
   - **Homepage URL**: `https://your-domain.com`
   - **Callback URL**: `https://your-domain.com`
3. Save credentials:

```env
NUXT_OAUTH_GITHUB_CLIENT_ID=your-client-id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your-client-secret
```

> 📖 [nuxt-auth-utils docs](https://github.com/atinux/nuxt-auth-utils)

#### 2b. Session Secret

Generate a secure session password (min 32 characters):

```bash
openssl rand -hex 32
```

```env
NUXT_SESSION_PASSWORD=your-generated-secret
```

#### 2c. Nuxt Studio Auth (Optional)

If you want self-hosted content editing via [Nuxt Studio](https://nuxt.studio):

**Option A — GitHub OAuth** (simplest, reuse same OAuth app):

```env
STUDIO_GITHUB_CLIENT_ID=your-github-client-id
STUDIO_GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Option B — External SSO** (deploy [SSO server](https://github.com/nuxt-content/nuxt-studio-sso)):

```env
STUDIO_SSO_URL=https://auth.example.com
STUDIO_SSO_CLIENT_ID=your-client-id
STUDIO_SSO_CLIENT_SECRET=your-client-secret
```

### Step 3 — Build & Push First Image

Magic Containers requires the Docker image to exist before creating a container. Build and push manually for the first time:

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Build and push
docker build -t ghcr.io/your-org/nuxthub-bunny-starter:latest .
docker push ghcr.io/your-org/nuxthub-bunny-starter:latest
```

> 💡 You only need to do this once. After Step 5, CI/CD handles all subsequent builds.

### Step 4 — Create Magic Container

Now that the image exists on GHCR:

1. Go to [bunny.net Dashboard](https://dash.bunny.net) → **Magic Containers**
2. Create a new app
3. **Add your app container**:
   - Registry: **GitHub Container Registry** (`ghcr.io`)
   - Image: `ghcr.io/your-org/nuxthub-bunny-starter`
   - Tag: `latest`
4. **Add Redis sidecar container**:
   - Registry: **Docker Hub**
   - Image: `library/redis`
   - Tag: `7-alpine` (recommended — see note below)
5. **Add Persistent Volume**:
   - Name: `redis-data`
   - Mount to Redis container at `/data`
6. **Set environment variables** on the app container (all values from Steps 1-2 above), plus:
   - `NUXT_PUBLIC_SITE_URL` — your production URL (e.g. `https://your-domain.com`), used for SEO meta and PWA QR code
7. **Deploy**
8. **Note your APP_ID and container name** — you'll need them for CI/CD in Step 5

```
┌──────────────────────────────────────┐
│  Magic Container                      │
│  ┌──────────────┐  ┌───────────────┐ │
│  │ Bun (Nuxt)   │  │  Redis 7      │ │
│  │ Port 3000    │──│  Port 6379    │ │
│  │ bun          │  │  /data volume │ │
│  └──────────────┘  └───────────────┘ │
└──────────────────────────────────────┘
```

> 📖 [Magic Containers Redis guide](https://docs.bunny.net/magic-containers/guides/redis)
>
> ⚠️ **Use `7-alpine`** (official Bunny recommendation). Redis 8 has known permission issues with persistent volumes on Magic Containers. Redis 7 is supported until 2028.

### Step 5 — Set Up CI/CD (GitHub Actions)

This project includes a multi-environment workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

#### 5a. Create GitHub Environments

Go to your repo → **Settings** → **Environments** and create these environments:

| Environment | Trigger | Image Tag |
|-------------|---------|:---------:|
| `production` | Push to `main` | `latest` |
| `staging` | Push to `stg` | `stg` |
| `preview` | Manual dispatch | `prev` |

#### 5b. Add Repository Secrets (shared across all environments)

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Name | Value |
|------|-------|
| `BUNNYNET_API_KEY` | Your bunny.net account API key |

> Repository secrets are shared by all environments. Only add secrets here if they are the same across production, staging, and preview.

#### 5c. Add Environment Secrets & Variables

For **each** environment created in Step 5a, add its own secrets and variables.

Go to **Settings** → **Secrets and variables** → **Actions** → select environment tab → **Manage environment secrets/variables**:

| Type | Name | Production | Staging | Preview |
|------|------|------------|---------|---------|
| **Secret** | `LIBSQL_URL` | `libsql://prod-id.lite.bunnydb.net` | `libsql://stg-id.lite.bunnydb.net` | `libsql://prev-id.lite.bunnydb.net` |
| **Secret** | `LIBSQL_AUTH_TOKEN` | prod token | staging token | preview token |
| **Secret** | `S3_ACCESS_KEY_ID` | prod storage zone name | stg storage zone name | prev storage zone name |
| **Secret** | `S3_SECRET_ACCESS_KEY` | prod storage password | stg storage password | prev storage password |
| **Variable** | `S3_BUCKET` | prod storage zone name | stg storage zone name | prev storage zone name |
| **Variable** | `S3_REGION` | `de`, `ny`, or `sg` | same or different | same or different |
| **Variable** | `S3_ENDPOINT` | `https://[region]-s3.storage.bunnycdn.com` | same or different region | same or different region |
| **Variable** | `BUNNY_APP_ID` | prod app ID | staging app ID | preview app ID |
| **Variable** | `BUNNY_CONTAINER_NAME` | `app` | `app` | `app` |

> ⚠️ **Environment secrets override repository secrets** with the same name. This lets each environment point to its own Bunny Database, Magic Container app, etc.

```
Settings → Secrets and variables → Actions
├── Repository secrets         ← shared (BUNNYNET_API_KEY)
├── Repository variables       ← shared
├── Environment: production    ← per-env (LIBSQL_URL, BUNNY_APP_ID, S3_*, ...)
├── Environment: staging       ← per-env (different values per environment)
└── Environment: preview       ← per-env (different values per environment)
```

#### 5d. How the Pipeline Works

```
Push to main (after CI passes)
    │
    ▼
┌──────────────────────────────────────┐
│  Environment: production              │
│  1. Build Docker image (tag: latest)  │
│  2. Push to GHCR                      │
│  3. Run DB migrations                 │
│  4. Deploy to nuxthub-b               │
└──────────────────────────────────────┘

Push to stg (after CI passes)
    │
    ▼
┌──────────────────────────────────────┐
│  Environment: staging                 │
│  1. Build Docker image (tag: stg)     │
│  2. Push to GHCR                      │
│  3. Run DB migrations                 │
│  4. Deploy to nuxthub-b-stg           │
└──────────────────────────────────────┘

Manual dispatch → choose environment
    │
    ▼
┌──────────────────────────────────────┐
│  Environment: preview                 │
│  1. Build Docker image (tag: prev)    │
│  2. Push to GHCR                      │
│  3. Run DB migrations                 │
│  4. Deploy to nuxthub-b-prev          │
└──────────────────────────────────────┘
```

> 📖 [Bunny GitHub Actions docs](https://docs.bunny.net/magic-containers/deploy-with-github-actions)

### Step 6 — Database Migrations

#### First Deployment

Before the first deployment, generate and apply migrations:

```bash
# Generate migration from schema
bunx nuxt db generate
```

Set `LIBSQL_URL` and `LIBSQL_AUTH_TOKEN` in your `.env` file, then apply:

```bash
# Linux / macOS / CI
NODE_ENV=production npx nuxt db migrate --dotenv .env

# Windows (PowerShell)
$env:NODE_ENV="production"; npx nuxt db migrate --dotenv .env
```

> ⚠️ Use `npx` (not `bunx`) for `db migrate` — `@libsql/client` HTTP transport has a known issue with Bun runtime.

#### Ongoing Changes

1. Edit `server/db/schema.ts`
2. Run `bunx nuxt db generate`
3. Commit and push — CI/CD will run `npx nuxt db migrate` automatically

> ⚠️ Never write manual SQL files in `server/db/migrations/` — NuxtHub generates them automatically.
>
> 📖 [NuxtHub Database docs](https://hub.nuxt.com/docs/database)

### Step 7 — Verify Deployment

After deployment, verify everything works:

```bash
# Health check
curl https://your-domain.com/api/health
# → {"status":"ok","runtime":"bun","uptime":42}

# Cached stats
curl https://your-domain.com/api/hub/cached-stats
# → Full infrastructure stats (cached 60s)
```

### Complete Environment Variables Reference

<details>
<summary><strong>📋 All Production Variables</strong></summary>

| Variable | Required | Description |
|----------|:--------:|-------------|
| **Site** | | |
| `NUXT_PUBLIC_SITE_URL` | ✅ | Production URL for SEO meta & PWA QR code |
| **Database** | | |
| `LIBSQL_URL` | ✅ | Bunny Database URL (`libsql://...`) |
| `LIBSQL_AUTH_TOKEN` | ✅ | Database authentication token |
| **Redis** | | |
| `REDIS_URL` | — | Default: `redis://127.0.0.1:6379` (sidecar) |
| **Blob Storage** | | |
| `S3_ACCESS_KEY_ID` | ✅ | Storage zone name |
| `S3_SECRET_ACCESS_KEY` | ✅ | Storage zone password |
| `S3_BUCKET` | ✅ | Storage zone name (same as access key) |
| `S3_ENDPOINT` | ✅ | `https://[region]-s3.storage.bunnycdn.com` |
| `S3_REGION` | ✅ | `de`, `ny`, or `sg` |
| **CDN** | | |
| `BUNNY_CDN_URL` | — | Pull zone URL for image optimization |
| **Stream** | | |
| `NUXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID` | — | Video library ID |
| `NUXT_PUBLIC_BUNNY_STREAM_VIDEO_ID` | — | Video ID for demo |
| **Auth** | | |
| `NUXT_SESSION_PASSWORD` | ✅ | Session secret (min 32 chars) |
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | — | GitHub OAuth client ID |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | — | GitHub OAuth client secret |
| **Studio** | | |
| `STUDIO_GITHUB_CLIENT_ID` | — | GitHub OAuth for Studio (Option A) |
| `STUDIO_GITHUB_CLIENT_SECRET` | — | GitHub OAuth secret for Studio |
| `STUDIO_SSO_URL` | — | SSO server URL (Option B) |
| `STUDIO_SSO_CLIENT_ID` | — | SSO client ID |
| `STUDIO_SSO_CLIENT_SECRET` | — | SSO client secret |


</details>

---

## 📁 Project Structure

```
├── app/
│   ├── components/          # Vue components (19 total)
│   │   ├── content/         # MDC components (StudioVideo)
│   │   └── demo/            # Demo tab components (6)
│   ├── pages/               # Route pages (index, demo, services, ecosystem, studio)
│   ├── plugins/             # Client plugins
│   └── app.vue              # Root layout
├── server/
│   ├── api/                 # API routes (hub/, auth/, health, stats, modules)
│   ├── routes/              # WebSocket, OAuth, image proxy
│   ├── middleware/          # Redis-backed rate limiter
│   ├── db/                  # Drizzle schema & migrations
│   └── utils/               # Drizzle instance, ID generators, validation
├── i18n/locales/            # EN, ZH, TH translations
├── content/                 # Nuxt Content markdown files (studio.md)
├── .github/workflows/       # CI + Deploy pipelines
├── Dockerfile               # Multi-stage Bun build
├── Agents.md                # AI coding assistant instructions
└── nuxt.config.ts           # Full config with $production overrides
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) >=1.3 |
| Framework | [Nuxt 4](https://nuxt.com) + [NuxtHub](https://hub.nuxt.com) (compat v5) |
| Server | [Nitro](https://nitro.build) ([h3](https://h3.dev)) |
| Database | [Drizzle ORM](https://orm.drizzle.team) + db0 |
| Storage | [unstorage](https://unstorage.unjs.io) (S3, Redis, fs) |
| WebSocket | [crossws](https://crossws.h3.dev) (in-memory pub/sub, single instance) |
| UI | [Nuxt UI](https://ui.nuxt.com) v4 + [Tailwind CSS](https://tailwindcss.com) v4 |
| Validation | [Zod](https://zod.dev) v4 |
| Testing | [Vitest](https://vitest.dev) + @nuxt/test-utils |

## 🛠 Development

```bash
bun install        # Install dependencies
bun run dev        # Start development
bun run lint       # Run ESLint
bun run test       # Run unit tests
bun run test:nuxt  # Run component tests
bun run test:e2e   # Run E2E tests
bun run release    # Generate changelog & bump version
```

## 📚 Resources

| Resource | Docs | AI Context (llms.txt) |
|----------|------|----------------------|
| NuxtHub | [hub.nuxt.com](https://hub.nuxt.com) | [overview](https://hub.nuxt.com/llms.txt) · [full](https://hub.nuxt.com/llms-full.txt) |
| Nuxt | [nuxt.com](https://nuxt.com) | [overview](https://nuxt.com/llms.txt) · [full](https://nuxt.com/llms-full.txt) |
| bunny.net | [docs.bunny.net](https://docs.bunny.net) | — |
| Nuxt UI | [ui.nuxt.com](https://ui.nuxt.com) | [overview](https://ui.nuxt.com/llms.txt) · [full](https://ui.nuxt.com/llms-full.txt) |
| Nitro | [nitro.build](https://nitro.build) | [overview](https://nitro.build/llms.txt) · [full](https://nitro.build/llms-full.txt) |
| Drizzle ORM | [orm.drizzle.team](https://orm.drizzle.team) | [overview](https://orm.drizzle.team/llms.txt) · [full](https://orm.drizzle.team/llms-full.txt) |
| h3 | [h3.dev](https://h3.dev) | [overview](https://h3.dev/llms.txt) · [full](https://h3.dev/llms-full.txt) |
| Nuxt Content | [content.nuxt.com](https://content.nuxt.com) | [overview](https://content.nuxt.com/llms.txt) · [full](https://content.nuxt.com/llms-full.txt) |
| unstorage | [unstorage.unjs.io](https://unstorage.unjs.io) | [overview](https://unstorage.unjs.io/llms.txt) |
| Nuxt Studio | [nuxt.studio](https://nuxt.studio) | [overview](https://nuxt.studio/llms.txt) · [full](https://nuxt.studio/llms-full.txt) |

## 📄 License

[MIT](./LICENSE)

<!-- Badges -->
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js&logoColor=00DC82
[nuxt-href]: https://nuxt.com

[nuxthub-src]: https://img.shields.io/badge/NuxtHub-020420?logo=nuxt.js&logoColor=00DC82
[nuxthub-href]: https://hub.nuxt.com

[bunny-src]: https://img.shields.io/badge/bunny.net-FF6600?logoColor=white
[bunny-href]: https://bunny.net

[bun-src]: https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white
[bun-href]: https://bun.sh

[license-src]: https://img.shields.io/github/license/iPLAYCAFE/nuxthub-bunny-starter?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/iPLAYCAFE/nuxthub-bunny-starter/blob/main/LICENSE
