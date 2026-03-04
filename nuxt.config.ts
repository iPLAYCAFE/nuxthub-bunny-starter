import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const nuxthubCoreVersion = (() => {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, 'node_modules/@nuxthub/core/package.json'), 'utf-8'))
    return (pkg.version as string) || '0.10.x'
  } catch { return '0.10.x' }
})()

// https://nuxt.com/docs/api/configuration/nuxt-config
//
// ────────────────────────────────────────────────────
// Environment Naming Convention
//   Prefix: nuxthub-b (≤16 chars for Bunny Database names)
//
// ┌──────────────┬─────────────┬─────────────────┬─────────────────┬───────────┐
// │              │ Dev         │ Preview         │ Staging         │ Production│
// ├──────────────┼─────────────┼─────────────────┼─────────────────┼───────────┤
// │ NODE_ENV     │ development │ production      │ production      │ production│
// │ Nuxt $env    │$development │ $production     │ $production     │$production│
// │ Git Branch   │ dev         │ PR → main       │ stg             │ main      │
// │ Image Tag    │ —           │ prev            │ stg             │ latest    │
// │ Bunny App    │ —           │ nuxthub-b-prev  │ nuxthub-b-stg   │ nuxthub-b │
// │ Bunny DB     │ .data/      │ nuxthub-b-prev  │ nuxthub-b-stg   │ nuxthub-b │
// │ Bunny Storage│ local fs    │ nuxthub-b-prev  │ nuxthub-b-stg   │ nuxthub-b │
// │ Bunny CDN    │ ipx         │ nuxthub-b-prev  │ nuxthub-b-stg   │ nuxthub-b │
// │ LIBSQL_URL   │ —           │ *.lite.bunnydb.net                │           │
// │ REDIS_URL    │ memory      │ redis://127.0.0.1:6379 (sidecar)  │           │
// └──────────────┴─────────────┴─────────────────┴─────────────────┴───────────┘
//
// Preview/Staging/Production all use NODE_ENV=production ($production config).
// Environments are differentiated by env vars only (LIBSQL_URL, BUNNY_CDN_URL, etc.)
// ────────────────────────────────────────────────────
export default defineNuxtConfig({
  // ────────────────────────────────────────────────────
  // Vite — plugin overrides
  //   Fix false "Conflict Detected" in Nuxt Studio caused by AST parser
  //   mismatch between build-time (Nuxt Content) and client-side (remark-mdc).
  //   The build-time parser produces different ASTs for MDC components
  //   (::callout, ::studio-video) and tables with emoji than Studio's
  //   client-side parser, causing isDocumentMatchingContent to always fail.
  // ────────────────────────────────────────────────────

  modules: [
    // ── Nuxt Official ──────────────────────────────
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-studio',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/a11y',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/test-utils/module',
    // ── NuxtHub ────────────────────────────────────
    '@nuxthub/core',
    // ── Auth & Security ────────────────────────────
    'nuxt-auth-utils',
    'nuxt-security',
    // nuxt-security handles CSRF via headers (nuxt-csurf conflicts with Nuxt Content SSR)
    // ── SEO & Social ───────────────────────────────
    'nuxt-og-image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-llms',
    // ── i18n ───────────────────────────────────────
    '@nuxtjs/i18n',
    // ── PWA ────────────────────────────────────────
    '@vite-pwa/nuxt',
    // ── QR Code ──────────────────────────────────
    'nuxt-qrcode'
  ],

  // $production overrides (NODE_ENV=production)
  $production: {
    devtools: { enabled: false },
    // Redis-backed storage for sessions, rate limiting, and KV
    nitro: {
      storage: {
        sessions: {
          driver: 'redis',
          url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
          base: 'sessions'
        },
        rateLimit: {
          driver: 'redis',
          url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
          base: 'rate-limit'
        }
      }
    },
    hub: {
      // Blob: NuxtHub auto-detects S3 from S3_* env vars at build time
      blob: true,
      // Cache: auto-configured (filesystem for non-CF/Vercel)
      cache: true,
      db: {
        dialect: 'sqlite',
        driver: 'libsql',
        applyMigrationsDuringBuild: false,
        // Explicit connection for nuxt db migrate CLI (resolved at prepare time)
        connection: {
          url: process.env.LIBSQL_URL || '',
          authToken: process.env.LIBSQL_AUTH_TOKEN || ''
        }
      },
      // KV → Redis (persistent, fast reads for sessions/flags/state)
      kv: {
        driver: 'redis',
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
      }
    },
    image: {
      provider: 'bunny',
      bunny: {
        baseURL: process.env.BUNNY_CDN_URL || ''
      }
    }
  },

  // Dev tools & misc
  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com'
  },

  // Color mode
  colorMode: {
    preference: 'dark'
  },

  // Runtime config
  runtimeConfig: {
    nuxthubVersion: nuxthubCoreVersion,
    // Public (exposed to client)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      bunnyCdnUrl: process.env.BUNNY_CDN_URL || '',
      bunnyStreamLibraryId: process.env.NUXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID || '',
      bunnyStreamVideoId: process.env.NUXT_PUBLIC_BUNNY_STREAM_VIDEO_ID || ''
    }
  },

  // Route rules — CDN cache headers
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },

  future: {
    compatibilityVersion: 5
  },

  compatibilityDate: '2025-07-15',

  // Nitro server engine
  nitro: {
    preset: 'bun',
    // Dev: in-memory storage (no external deps required)
    storage: {
      sessions: { driver: 'memory' },
      rateLimit: { driver: 'memory' }
    },
    experimental: {
      websocket: true
    },
    // Externalize @libsql/* — Nitro's bundler misses transitive deps
    // like @libsql/isomorphic-ws causing runtime crashes in production
    unenv: {
      external: [
        '@libsql/client',
        '@libsql/hrana-client',
        '@libsql/isomorphic-ws',
        '@libsql/isomorphic-fetch'
      ]
    }
  },

  // NuxtHub — full-stack data layer (dev: .data/, prod: env vars)
  hub: {
    db: 'sqlite',
    blob: true,
    kv: true,
    cache: true
  },
  vite: {
    plugins: [{
      name: 'fix-studio-false-conflict',
      transform(code: string, id: string) {
        // Only patch nuxt-studio's compare.js
        if (!id.includes('nuxt-studio') || !id.endsWith('compare.js')) return
        // Inject `return true;` at the top of isDocumentMatchingContent
        // so it short-circuits before the AST comparison runs.
        // areDocumentsEqual is untouched — actual edit detection still works.
        return code.replace(
          'export async function isDocumentMatchingContent(content, document) {',
          'export async function isDocumentMatchingContent(content, document) { return true;'
        )
      }
    }]
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Fonts — Bunny Fonts (GDPR-compliant)
  fonts: {
    families: [
      { name: 'Inter', provider: 'bunny' }
    ]
  },

  // i18n
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'th', language: 'th-TH', name: 'ไทย', file: 'th.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales'
  },

  // Image optimization (dev: ipx, prod: Bunny Optimizer)
  image: {
    provider: 'ipx',
    domains: ['avatars.githubusercontent.com']
  },

  llms: {
    domain: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    title: 'NuxtHub × bunny.net',
    description: 'NuxtHub Full-Stack Starter on bunny.net Magic Containers — Nuxt 4, Drizzle ORM, Bunny CDN, Redis, Docker, i18n, PWA',
    sections: [
      {
        title: 'Pages',
        description: 'Application pages with SSR, i18n (EN/TH/ZH), and dark mode',
        links: [
          { title: 'Home', description: 'Hero, architecture map, stats', href: '/' },
          { title: 'Demo', description: 'Interactive Live API, Auth, Bunny Stream, WebSocket demos', href: '/demo' },
          { title: 'Services', description: '10 bunny.net services, Docker deploy, code snippets', href: '/services' },
          { title: 'Ecosystem', description: 'Nuxt modules, Studio, Content, UnJS, PWA', href: '/ecosystem' }
        ]
      },
      {
        title: 'API Endpoints',
        description: 'Nitro server API routes',
        links: [
          { title: 'Health Check', description: 'GET — server status, runtime, uptime', href: '/api/health' },
          { title: 'Stats', description: 'GET — integration counts (modules, services, packages)', href: '/api/stats' },
          { title: 'Cached Stats', description: 'GET — NuxtHub features with 5-min cache', href: '/api/hub/cached-stats' },
          { title: 'KV Store', description: 'GET/POST — key-value storage CRUD', href: '/api/hub/kv' },
          { title: 'Posts', description: 'GET/POST — blog posts with Drizzle ORM', href: '/api/hub/posts' },
          { title: 'Visitors', description: 'GET/POST — analytics with UUIDv7 PKs', href: '/api/hub/visitors' },
          { title: 'Files', description: 'GET/DELETE — blob storage file management', href: '/api/hub/files' },
          { title: 'Upload', description: 'POST — file upload (2MB max, type validation)', href: '/api/hub/upload' },
          { title: 'Modules', description: 'GET — categorized list of Nuxt modules used', href: '/api/modules' }
        ]
      },
      {
        title: 'NuxtHub Data Layer',
        description: 'Full-stack data features powered by NuxtHub',
        links: [
          { title: 'Database', description: 'SQLite/libSQL with Drizzle ORM, UUIDv7 binary PKs', href: 'https://hub.nuxt.com/docs/database' },
          { title: 'KV Storage', description: 'Redis-backed key-value store', href: 'https://hub.nuxt.com/docs/kv' },
          { title: 'Blob Storage', description: 'S3-compatible file storage via Bunny Storage', href: 'https://hub.nuxt.com/docs/blob' },
          { title: 'Cache', description: 'Redis-backed response caching', href: 'https://hub.nuxt.com/docs/cache' }
        ]
      }
    ],
    notes: [
      'This is a starter template — fork and customize for your project',
      'See Agents.md in the repo root for AI agent instructions',
      'Deployed on bunny.net Magic Containers with Bun runtime'
    ],
    full: {
      title: 'NuxtHub × bunny.net — Full Documentation',
      description: 'Complete documentation including Nuxt Content pages'
    }
  },

  // SEO & Social
  ogImage: {
    defaults: {
      component: 'NuxtSeo'
    }
  },

  // PWA
  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
    manifest: {
      name: 'NuxtHub × bunny.net Starter',
      short_name: 'NuxtHub',
      description: 'NuxtHub Full-Stack × bunny.net Ecosystem Showcase',
      theme_color: '#00DC82',
      background_color: '#020420',
      display: 'standalone',
      orientation: 'any',
      icons: [
        {
          src: '/icon-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      // SSR app: server renders full HTML, no SPA fallback needed
      navigateFallback: undefined,
      navigateFallbackDenylist: [/^\/api\//],
      cleanupOutdatedCaches: true,
      // No precache for SSR — all assets cached at runtime on demand
      globPatterns: [],
      runtimeCaching: [
        {
          // JS/CSS bundles: network-first (always fresh, offline fallback)
          urlPattern: /\/_nuxt\/.*\.(?:js|css)$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'nuxt-assets',
            expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }
          }
        },
        {
          // Images: stale-while-revalidate (fast cache, background update)
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }
          }
        },
        {
          // Fonts: cache-first (rarely change)
          urlPattern: /\.(?:woff2?|ttf|eot)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts',
            expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 }
          }
        }
      ]
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: false
    }
  },

  // Security
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      // Allow fullscreen and PiP for Bunny Stream iframe
      // Origins MUST be double-quoted per Permissions-Policy spec:
      // fullscreen=(self "https://player.mediadelivery.net")
      permissionsPolicy: {
        'fullscreen': ['self', '"https://player.mediadelivery.net"', '"https://iframe.mediadelivery.net"'],
        'picture-in-picture': ['self']
      },
      contentSecurityPolicy: {
        // 'unsafe-inline' required because:
        // - Nuxt UI v4 + Tailwind v4 inject runtime styles
        // - Nuxt Content MDC renders dynamic components
        // - Nuxt 5 SPA mode uses inline scripts for payload hydration
        // TODO: Replace with nonce-based CSP when Nuxt adds nonce support
        //   Track: https://github.com/nuxt/nuxt/issues/20512
        //   Track: https://github.com/nuxt/ui/issues/2368
        'script-src': ['\'self\'', '\'unsafe-inline\'', '\'wasm-unsafe-eval\'', 'https:'],
        'script-src-attr': ['\'unsafe-inline\''],
        // GitHub avatars + Bunny CDN
        'img-src': ['\'self\'', 'data:', 'https://avatars.githubusercontent.com', 'https://*.b-cdn.net'],
        // Bunny Stream Player 2 + legacy player domain
        'frame-src': ['\'self\'', 'https://player.mediadelivery.net', 'https://iframe.mediadelivery.net']
      }
    },
    // Custom Redis-backed rate limiter in server/middleware/rate-limit.ts
    rateLimiter: false
  },

  // Nuxt Studio — self-hosted visual content editor
  studio: {
    repository: {
      provider: 'github',
      owner: 'iPLAYCAFE',
      repo: 'nuxthub-bunny-starter',
      branch: 'main'
    }
  }
})
