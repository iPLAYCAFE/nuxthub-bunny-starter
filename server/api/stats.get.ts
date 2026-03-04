import rootPkg from '../../package.json'

const projectVersion: string = rootPkg.version

/**
 * Static project metadata. Hoisted outside the handler since it never
 * changes at runtime — avoids re-creating arrays on every request.
 */
const nuxtModules = [
  '@nuxt/eslint', '@nuxt/ui', '@nuxt/content', 'nuxt-studio', '@nuxt/image',
  '@nuxt/scripts', '@nuxt/a11y', '@nuxt/fonts', '@nuxt/hints', '@nuxt/test-utils',
  '@nuxthub/core', 'nuxt-auth-utils', 'nuxt-security', 'nuxt-og-image',
  '@nuxtjs/sitemap', '@nuxtjs/robots', 'nuxt-llms', '@nuxtjs/i18n',
  '@vite-pwa/nuxt', 'nuxt-qrcode'
] as const

const bunnyServices = [
  'Magic Containers', 'CDN', 'Database', 'Storage', 'Stream',
  'Optimizer', 'DNS', 'Shield', 'Edge Scripting', 'Fonts'
] as const

const unjsPackages = [
  'h3', 'nitro', 'db0', 'unstorage', 'crossws', 'ipx',
  'ofetch', 'unhead', 'destr', 'ohash', 'consola', 'ufo'
] as const

const stats = {
  nuxtModules: nuxtModules.length,
  bunnyServices: bunnyServices.length,
  unjsPackages: unjsPackages.length,
  totalIntegrations: nuxtModules.length + bunnyServices.length + unjsPackages.length
} as const

export default cachedEventHandler(() => ({
  title: 'NuxtHub × bunny.net Starter',
  version: projectVersion,
  runtime: 'Bun' in globalThis ? 'bun' : 'node',
  framework: 'NuxtHub Full-Stack',
  deployment: 'Bunny Magic Containers',
  features: {
    nuxthub: ['Database (SQLite/libsql)', 'Blob Storage (S3)', 'KV Storage', 'Cache', 'Auth Utils'],
    nuxt: nuxtModules,
    bunny: bunnyServices,
    unjs: unjsPackages
  },
  stats
}), { maxAge: 3600, swr: true })
