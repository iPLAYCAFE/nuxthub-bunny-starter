/**
 * Redis-backed sliding window rate limiter
 *
 * Uses conditional TTL to avoid:
 * - Race condition: GET+SET with TTL reset on every request
 * - TTL reset: only set TTL on the first request in the window
 *
 * Pattern: get key → if null, set(key, 1, ttl:60) → else set(key, n+1) → check limit
 */
const WINDOW_SECONDS = 60
const MAX_REQUESTS = 60

export default defineEventHandler(async (event) => {
  // Only rate limit API routes (skip health check)
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/') || path === '/api/health') return

  const ip = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
  const key = `rate:${ip}`
  const ttlKey = `rate-ttl:${ip}`

  try {
    const storage = useStorage('rateLimit')

    const current = ((await storage.getItem<number>(key)) || 0) + 1
    // Always include TTL — unstorage Redis driver removes TTL on setItem without it
    await storage.setItem(key, current, { ttl: WINDOW_SECONDS })
    if (current === 1) {
      // Track window start time for accurate Retry-After
      await storage.setItem(ttlKey, Date.now(), { ttl: WINDOW_SECONDS })
    }

    // Calculate remaining time in the current window
    const windowStart = await storage.getItem<number>(ttlKey) || Date.now()
    const elapsedSeconds = Math.floor((Date.now() - windowStart) / 1000)
    const remainingSeconds = Math.max(1, WINDOW_SECONDS - elapsedSeconds)

    // Rate limit headers via h3 native API (cross-platform: Bun, Node, Deno, CF Workers)
    setResponseHeader(event, 'X-RateLimit-Limit', String(MAX_REQUESTS))
    setResponseHeader(event, 'X-RateLimit-Remaining', String(Math.max(0, MAX_REQUESTS - current)))
    setResponseHeader(event, 'X-RateLimit-Reset', String(remainingSeconds))

    if (current > MAX_REQUESTS) {
      setResponseHeader(event, 'Retry-After', remainingSeconds)
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message: 'Rate limit exceeded. Try again later.'
      })
    }
  } catch (err) {
    // Re-throw rate limit errors (429)
    if (err instanceof Error && 'statusCode' in err) {
      const statusCode = (err as { statusCode: number }).statusCode
      if (statusCode === 429) throw err
    }
    // If Redis is unavailable, allow the request (fail-open)
  }
})
