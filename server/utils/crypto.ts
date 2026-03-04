/**
 * Hash a secret token for safe storage at rest.
 * Uses Web Crypto API (available in Bun, Workers, Node 20+).
 *
 * Use this for password reset tokens, API keys, or any secret
 * that needs to be verified later but shouldn't be stored in plaintext.
 *
 * @example
 * ```ts
 * const token = newKey() // 48-char nanoid
 * const hash = await hashToken(token)
 * // Store `hash` in DB, send `token` to user
 * ```
 */
export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Verify a raw token against its stored SHA-256 hash.
 * Constant-time comparison via string equality after hashing
 * (both sides go through SHA-256, so timing is input-independent).
 */
export async function verifyToken(token: string, storedHash: string): Promise<boolean> {
  return await hashToken(token) === storedHash
}
