/**
 * Static module catalog. Hoisted outside the handler since it never
 * changes at runtime — avoids re-creating the array on every request.
 */
const modules = [
  {
    category: 'NuxtHub',
    items: [
      { name: 'Database', icon: 'i-lucide-database', description: 'SQL Database with Drizzle ORM — SQLite locally, Bunny Database in production via libsql', url: 'https://hub.nuxt.com/docs/features/database', highlights: ['Drizzle ORM', 'db0', 'libsql', 'Auto-migrations'] },
      { name: 'Blob Storage', icon: 'i-lucide-hard-drive', description: 'File storage via S3-compatible API — Bunny Storage with geo-replication', url: 'https://hub.nuxt.com/docs/features/blob', highlights: ['S3 API', 'unstorage', 'Bunny Storage', 'Geo-replicated'] },
      { name: 'KV Storage', icon: 'i-lucide-key', description: 'Key-Value storage for sessions, flags, counters — Redis sidecar in production', url: 'https://hub.nuxt.com/docs/features/kv', highlights: ['unstorage', 'Redis Sidecar', 'Persistent'] },
      { name: 'Cache', icon: 'i-lucide-zap', description: 'TTL-based caching with cachedEventHandler — Bunny CDN edge caching on top', url: 'https://hub.nuxt.com/docs/features/cache', highlights: ['cachedEventHandler', 'TTL', 'Bunny CDN Edge', '1min default'] },
      { name: 'Auth Utils', icon: 'i-lucide-shield-check', description: 'Authentication utilities for OAuth, sessions, and user management', url: 'https://github.com/atinux/nuxt-auth-utils', highlights: ['OAuth', 'Sessions', 'CSRF Protection'] }
    ]
  },
  {
    category: 'Nuxt Modules',
    items: [
      { name: 'Nuxt UI', icon: 'i-lucide-palette', description: 'Beautiful UI component library with Tailwind CSS', url: 'https://ui.nuxt.com', highlights: ['50+ Components', 'Dark Mode', 'Tailwind v4'] },
      { name: 'Nuxt Content', icon: 'i-lucide-file-text', description: 'Git-based CMS with Markdown, YAML, CSV support', url: 'https://content.nuxt.com', highlights: ['MDC Syntax', 'Query API', 'Hot Reload'] },
      { name: 'Nuxt Studio', icon: 'i-lucide-pen-tool', description: 'Self-hosted CMS editor for content editing at /_studio', url: 'https://github.com/nuxt-content/nuxt-studio', highlights: ['Live Preview', 'MDC Editor', 'Git-based'] },
      { name: 'Studio SSO', icon: 'i-lucide-lock-keyhole', description: 'Centralized OAuth 2.0 SSO server for Nuxt Studio sites — login once, access all sites', url: 'https://github.com/nuxt-content/nuxt-studio-sso', highlights: ['OAuth 2.1', 'PKCE', 'GitHub SSO', 'Multi-site'] },
      { name: 'Nuxt Image', icon: 'i-lucide-image', description: 'Image optimization with ipx — automatic resizing, format conversion', url: 'https://image.nuxt.com', highlights: ['ipx', 'Sharp', 'Lazy Loading', 'Bunny Optimizer'] },
      { name: 'Docus', icon: 'i-lucide-book-open', description: 'Beautiful documentation site generator powered by Nuxt Content', url: 'https://docus.dev', highlights: ['Nuxt Content', 'Docs Theme', 'Markdown'] },
      { name: 'Security', icon: 'i-lucide-shield', description: 'Security headers, CSRF protection, rate limiting', url: 'https://nuxt-security.vercel.app', highlights: ['CSP', 'CORS', 'Rate Limiting'] },
      { name: 'Nuxt Scripts', icon: 'i-lucide-code', description: 'Performance-optimized third-party script loading', url: 'https://scripts.nuxt.com', highlights: ['Registry', 'Web Worker', 'Consent'] },
      { name: 'Nuxt A11y', icon: 'i-lucide-accessibility', description: 'Accessibility auditing and guidance during development', url: 'https://github.com/nuxt/a11y', highlights: ['WCAG', 'Live Audit', 'Axe-core'] },
      { name: 'Nuxt ESLint', icon: 'i-lucide-check-circle', description: 'ESLint integration with flat config and stylistic rules', url: 'https://eslint.nuxt.com', highlights: ['Flat Config', 'Stylistic', 'Auto-fix'] },
      { name: 'PWA', icon: 'i-lucide-smartphone', description: 'Progressive Web App with offline support via Workbox', url: 'https://vite-pwa-org.netlify.app/frameworks/nuxt', highlights: ['Service Worker', 'Installable', 'Offline', 'Workbox'] }
    ]
  }
] as const

export default cachedEventHandler(() => modules, { maxAge: 3600, swr: true })
