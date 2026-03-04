import { describe, it, expect } from 'vitest'
import { hashToken, verifyToken } from '../../server/utils/crypto'

describe('crypto utilities', () => {
  describe('hashToken', () => {
    it('returns a 64-character hex string (SHA-256)', async () => {
      const hash = await hashToken('test-token')
      expect(hash).toHaveLength(64)
      expect(hash).toMatch(/^[0-9a-f]{64}$/)
    })

    it('produces deterministic output for the same input', async () => {
      const hash1 = await hashToken('same-token')
      const hash2 = await hashToken('same-token')
      expect(hash1).toBe(hash2)
    })

    it('produces different output for different inputs', async () => {
      const hash1 = await hashToken('token-a')
      const hash2 = await hashToken('token-b')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyToken', () => {
    it('returns true for matching token and hash', async () => {
      const token = 'my-secret-token'
      const hash = await hashToken(token)
      expect(await verifyToken(token, hash)).toBe(true)
    })

    it('returns false for non-matching token', async () => {
      const hash = await hashToken('correct-token')
      expect(await verifyToken('wrong-token', hash)).toBe(false)
    })
  })
})
