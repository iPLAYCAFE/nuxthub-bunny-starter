/**
 * Test-only login endpoint — creates a sealed session cookie for E2E tests.
 *
 * ⚠️ Only available in development mode. Returns 404 in production.
 *
 * Usage:
 *   const res = await fetch('http://localhost:3000/api/_test/login', { method: 'POST' })
 *   const cookie = res.headers.get('set-cookie')
 *   // Pass cookie with subsequent authenticated requests
 */
export default defineEventHandler(async (event) => {
  // Block in production
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  await setUserSession(event, {
    user: {
      id: 'e2e-test-user',
      provider: 'github',
      name: 'E2E Test User',
      email: 'test@example.com',
      phone: null,
      avatarUrl: null
    },
    loggedInAt: new Date().toISOString()
  })

  return { success: true, message: 'Test session created' }
})
