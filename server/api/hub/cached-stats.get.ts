import os from 'node:os'

export default cachedEventHandler(async () => {
  const { nuxthubVersion } = useRuntimeConfig()
  const cpuCount = os.cpus().length
  const totalMemBytes = os.totalmem()
  const totalMemGiB = (totalMemBytes / (1024 ** 3)).toFixed(1).replace(/\.0$/, '')

  const startTime = Date.now()

  const stats = {
    cachedAt: new Date().toISOString(),
    computeTimeMs: 0,
    nuxthub: {
      version: nuxthubVersion,
      features: ['Database', 'Blob', 'KV', 'Cache'],
      database: { dialect: 'sqlite', driver: 'libsql' },
      blob: { driver: 's3', provider: 'Bunny Storage' },
      kv: { driver: 'redis', storage: 'Redis Sidecar' },
      cache: { driver: 'filesystem', storage: 'Persistent Volume' }
    },
    redis: {
      usedFor: ['KV Storage', 'Sessions', 'Rate Limiting'],
      connection: process.env.REDIS_URL ? 'configured' : 'default',
      persistence: 'Persistent Volume at /data'
    },
    bunny: {
      services: ['Magic Containers', 'CDN', 'Database', 'Storage', 'Stream', 'Optimizer', 'DNS', 'Shield', 'Edge Scripting', 'Fonts'],
      runtime: 'Bun' in globalThis ? 'bun' : 'node',
      maxCpu: cpuCount,
      maxMemory: `${totalMemGiB} GiB`,
      autoscaling: 'auto (configurable via Bunny dashboard)'
    },
    unjs: ['h3', 'nitro', 'db0', 'unstorage', 'crossws', 'ipx', 'ofetch', 'unhead', 'destr', 'ohash', 'consola', 'ufo']
  }

  stats.computeTimeMs = Date.now() - startTime

  return stats
}, {
  maxAge: 60, // Cache for 1 minute
  name: 'cached-stats'
})
