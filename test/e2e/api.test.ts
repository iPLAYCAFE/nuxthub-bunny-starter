import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { spawn, type ChildProcess } from 'node:child_process'

const BASE_URL = 'http://localhost:3000'
let serverProcess: ChildProcess | null = null
let serverWasAlreadyRunning = false

/** Session cookie obtained from the test-only login endpoint */
let authCookie = ''

/**
 * Wait for the dev server to respond on /api/health
 */
async function waitForServer(url: string, timeoutMs = 120_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/api/health`)
      if (res.ok) return
    } catch { /* server not ready yet */ }
    await new Promise(r => setTimeout(r, 1500))
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms`)
}

/**
 * Login via the test-only endpoint (/api/_test/login)
 * Captures the sealed session cookie for authenticated requests.
 */
async function loginForTests(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/_test/login`, { method: 'POST' })
  if (!res.ok) throw new Error(`Test login failed: ${res.status}`)

  // Capture the set-cookie header (may contain multiple cookies)
  const setCookie = res.headers.getSetCookie?.() ?? [res.headers.get('set-cookie') ?? '']
  authCookie = setCookie.filter(Boolean).join('; ')

  if (!authCookie) throw new Error('Test login did not return a session cookie')
}

/**
 * Helper to $fetch JSON from the test server
 * @param auth - if true, include the session cookie (default: false)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function $fetch<T = any>(path: string, opts?: Omit<RequestInit, 'body'> & { query?: Record<string, string>, body?: any, auth?: boolean }): Promise<T> {
  const url = new URL(path, BASE_URL)
  if (opts?.query) {
    for (const [k, v] of Object.entries(opts.query)) url.searchParams.set(k, v)
  }
  const { body, auth, ...rest } = opts || {}
  const init: RequestInit = { ...rest }

  // Build headers
  const headers: Record<string, string> = { ...init.headers as Record<string, string> }
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }
  if (auth && authCookie) {
    headers['Cookie'] = authCookie
  }
  init.headers = headers

  const res = await fetch(url.toString(), init)
  return res.json() as Promise<T>
}

/**
 * Helper for raw fetch with auth cookie (used for FormData uploads, status checks)
 */
function fetchWithAuth(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (authCookie) headers.set('Cookie', authCookie)
  return fetch(url, { ...init, headers })
}

describe('API Routes E2E', () => {
  beforeAll(async () => {
    // Check if server is already running
    try {
      const res = await fetch(`${BASE_URL}/api/health`)
      if (res.ok) {
        serverWasAlreadyRunning = true
      }
    } catch { /* not running */ }

    if (!serverWasAlreadyRunning) {
      // Start dev server
      serverProcess = spawn('bun', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: 'pipe',
        shell: true
      })

      serverProcess.stderr?.on('data', (data: Buffer) => {
        const msg = data.toString()
        if (msg.includes('ERROR') || msg.includes('error')) {
          console.error('[dev-server]', msg)
        }
      })

      await waitForServer(BASE_URL)
    }

    // Login to get a session cookie for authenticated tests
    await loginForTests()
  }, 180_000) // 3 minutes max for server startup

  afterAll(() => {
    if (serverProcess && !serverWasAlreadyRunning) {
      serverProcess.kill()
      serverProcess = null
    }
  })

  // ── Health ──
  test('GET /api/health returns ok status', async () => {
    const data = await $fetch('/api/health')
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('runtime')
    expect(data).toHaveProperty('uptime')
    expect(typeof data.uptime).toBe('number')
  })

  // ── Stats ──
  test('GET /api/stats returns correct counts', async () => {
    const data = await $fetch('/api/stats')
    expect(data).toHaveProperty('title', 'NuxtHub × bunny.net Starter')
    expect(data.stats.nuxtModules).toBe(20)
    expect(data.stats.bunnyServices).toBe(10)
    expect(data.stats.unjsPackages).toBe(12)
    expect(data.stats.totalIntegrations).toBe(42)
  })

  // ── Cached Stats ──
  test('GET /api/hub/cached-stats returns cached data', async () => {
    const data = await $fetch('/api/hub/cached-stats')
    expect(data).toHaveProperty('cachedAt')
    expect(data).toHaveProperty('nuxthub')
    expect(data.nuxthub.features).toContain('Database')
  })

  // ── Auth: mutation without auth → 401 ──
  test('Mutation endpoints reject unauthenticated requests', async () => {
    const res = await fetch(`${BASE_URL}/api/hub/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Should Fail' })
    })
    expect(res.status).toBe(401)
  })

  // ── KV CRUD (authenticated) ──
  test('KV: set, get, delete lifecycle', async () => {
    // List initially
    const initial = await $fetch('/api/hub/kv')
    expect(initial).toHaveProperty('keys')

    // Set a value (auth required)
    await $fetch('/api/hub/kv', {
      method: 'POST',
      body: { key: 'test-key-e2e', value: 'test-value-e2e' },
      auth: true
    })

    // Verify it appears in the list
    const afterSet = await $fetch('/api/hub/kv')
    expect(afterSet.keys).toContain('test-key-e2e')

    // Get by specific key
    const single = await $fetch('/api/hub/kv', { query: { key: 'test-key-e2e' } })
    expect(single).toHaveProperty('value', 'test-value-e2e')

    // Delete (auth required)
    await $fetch('/api/hub/kv/test-key-e2e', { method: 'DELETE', auth: true })

    // Verify removed
    const afterDelete = await $fetch('/api/hub/kv')
    expect(afterDelete.keys).not.toContain('test-key-e2e')
  })

  // ── Posts CRUD (authenticated) ──
  test('Posts: create, update, delete lifecycle', async () => {
    // List initially
    const initial = await $fetch('/api/hub/posts')
    expect(initial).toHaveProperty('posts')

    // Create (auth required)
    const createResult = await $fetch('/api/hub/posts', {
      method: 'POST',
      body: { title: 'E2E Test Post', content: 'Test content' },
      auth: true
    })
    expect(createResult).toHaveProperty('success', true)
    const slug = createResult.post.slug

    // Verify in list
    const afterCreate = await $fetch('/api/hub/posts')
    const found = afterCreate.posts.find((p: Record<string, unknown>) => p.slug === slug)
    expect(found).toBeDefined()
    expect(found.title).toBe('E2E Test Post')

    // Update (auth required)
    const updateResult = await $fetch(`/api/hub/posts/${slug}`, {
      method: 'PUT',
      body: { title: 'Updated Title', content: 'Updated content' },
      auth: true
    })
    expect(updateResult).toHaveProperty('success', true)
    expect(updateResult.post.title).toBe('Updated Title')

    // Delete (auth required)
    await $fetch(`/api/hub/posts/${slug}`, { method: 'DELETE', auth: true })

    // Verify removed
    const afterDelete = await $fetch('/api/hub/posts')
    expect(afterDelete.posts.find((p: Record<string, unknown>) => p.slug === slug)).toBeUndefined()
  })

  // ── Blob / Files ──
  test('GET /api/hub/files returns file list', async () => {
    const data = await $fetch('/api/hub/files')
    expect(data).toHaveProperty('files')
    expect(Array.isArray(data.files)).toBe(true)
  })

  // ── Visitors ──
  test('Visitors: record and list', async () => {
    const initial = await $fetch('/api/hub/visitors')
    expect(initial).toHaveProperty('recent')

    // Record a visit (no auth required)
    await $fetch('/api/hub/visitors', {
      method: 'POST',
      body: { page: '/test-page' }
    })

    const afterVisit = await $fetch('/api/hub/visitors')
    expect(afterVisit.total).toBeGreaterThan(0)
  })

  // ── Blob Upload/Delete Lifecycle (authenticated) ──
  test('Blob: upload, verify in list, delete', async () => {
    // Create a small text file to upload
    const content = `E2E test file created at ${new Date().toISOString()}`
    const testFile = new File([content], 'e2e-test-file.txt', { type: 'text/plain' })

    const form = new FormData()
    form.append('file', testFile)

    // Upload (auth required)
    const uploadResult = await fetchWithAuth(`${BASE_URL}/api/hub/upload`, {
      method: 'POST',
      body: form
    }).then(r => r.json())

    expect(uploadResult).toHaveProperty('pathname')
    expect(uploadResult.pathname).toContain('e2e-test-file')

    const pathname = uploadResult.pathname

    // Verify it appears in the file list
    const afterUpload = await $fetch('/api/hub/files')
    const found = afterUpload.files.find((f: Record<string, unknown>) => f.pathname === pathname)
    expect(found).toBeDefined()
    expect(found.size).toBeGreaterThan(0)

    // Download and verify content
    const downloaded = await fetch(`${BASE_URL}/api/hub/files/${pathname}`)
    expect(downloaded.ok).toBe(true)

    // Delete
    await fetchWithAuth(`${BASE_URL}/api/hub/files/${pathname}`, { method: 'DELETE' })

    // Verify removed from list
    const afterDelete = await $fetch('/api/hub/files')
    expect(afterDelete.files.find((f: Record<string, unknown>) => f.pathname === pathname)).toBeUndefined()
  })

  // ── Blob Upload Validation (authenticated) ──
  test('Blob: rejects files over 2MB', async () => {
    // Create a file slightly over 2MB
    const largeContent = new Uint8Array(2 * 1024 * 1024 + 1)
    const largeFile = new File([largeContent], 'too-large.txt', { type: 'text/plain' })

    const form = new FormData()
    form.append('file', largeFile)

    const res = await fetchWithAuth(`${BASE_URL}/api/hub/upload`, {
      method: 'POST',
      body: form
    })
    expect(res.status).toBe(400)
  })

  test('Blob: rejects unsupported file types', async () => {
    const exeFile = new File(['MZ'], 'malware.exe', { type: 'application/x-msdownload' })

    const form = new FormData()
    form.append('file', exeFile)

    const res = await fetchWithAuth(`${BASE_URL}/api/hub/upload`, {
      method: 'POST',
      body: form
    })
    expect(res.status).toBe(400)
  })

  // ── Modules ──
  test('GET /api/modules returns module list', async () => {
    const data = await $fetch('/api/modules')
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    // API returns [{ category, items: [{ name, ... }] }]
    expect(data[0]).toHaveProperty('category')
    expect(data[0]).toHaveProperty('items')
    expect(data[0].items[0]).toHaveProperty('name')
  })

  // ── Rate Limiter ──
  test('Rate limiter returns 429 after exceeding limit', async () => {
    // Send requests rapidly to trigger the 60 req/min limit.
    // Using 70 requests to account for requests consumed by previous tests
    // from the same IP within the same rate limit window.
    const results: number[] = []
    for (let i = 0; i < 70; i++) {
      const res = await fetch(`${BASE_URL}/api/stats`)
      results.push(res.status)
      // Check rate limit headers
      if (i === 0) {
        expect(res.headers.get('X-RateLimit-Limit')).toBe('60')
        expect(res.headers.get('X-RateLimit-Remaining')).toBeDefined()
      }
    }
    // At least one request should have been rate limited
    expect(results).toContain(429)
  })
})
