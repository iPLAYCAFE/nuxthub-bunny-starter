export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'Bun' in globalThis ? 'bun' : 'node',
    uptime: Math.floor(process.uptime())
  }
})
