export default defineNitroPlugin((nitro) => {
  // Log NuxtHub driver configuration on first request
  nitro.hooks.hook('request', function logDrivers() {
    nitro.hooks.removeHook('request', logDrivers)

    const hub = useRuntimeConfig().hub as Record<string, unknown> | undefined
    if (!hub) {
      console.log('[hub:diagnostics] NuxtHub config not found in runtimeConfig')
      return
    }

    const blob = hub.blob as Record<string, unknown> | false
    const kv = hub.kv as Record<string, unknown> | false
    const cache = hub.cache as Record<string, unknown> | false
    const db = hub.db as Record<string, unknown> | false

    console.log('[hub:diagnostics] ── NuxtHub Driver Summary ──')

    // Blob: driver + key config (bucket/region or dir)
    if (blob) {
      const driver = blob.driver || 'unknown'
      const detail = driver === 's3'
        ? `bucket=${blob.bucket || 'N/A'} region=${blob.region || 'N/A'} endpoint=${blob.endpoint ? 'OK' : 'MISSING'}`
        : `dir=${blob.dir || 'N/A'}`
      console.log(`[hub:diagnostics] blob: ${driver} (${detail})`)
    } else {
      console.log('[hub:diagnostics] blob: disabled')
    }

    // KV: driver + connection info
    if (kv) {
      const driver = kv.driver || 'unknown'
      const detail = driver === 'redis'
        ? `url=${process.env.REDIS_URL ? 'set' : 'MISSING'}`
        : `base=${kv.base || 'N/A'}`
      console.log(`[hub:diagnostics] kv: ${driver} (${detail})`)
    } else {
      console.log('[hub:diagnostics] kv: disabled')
    }

    // Cache: driver
    if (cache) {
      const driver = cache.driver || 'unknown'
      console.log(`[hub:diagnostics] cache: ${driver}`)
    } else {
      console.log('[hub:diagnostics] cache: disabled')
    }

    // Database: dialect/driver + connection
    if (db) {
      const dialect = (db as Record<string, unknown>).dialect || 'unknown'
      const driver = (db as Record<string, unknown>).driver || 'unknown'
      const hasUrl = !!(process.env.LIBSQL_URL || process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL)
      console.log(`[hub:diagnostics] db: ${dialect}/${driver} (url=${hasUrl ? 'set' : 'MISSING'})`)
    } else {
      console.log('[hub:diagnostics] db: disabled')
    }
  })
})
