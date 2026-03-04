import { describe, it, expect } from 'vitest'
import { newPk, newSlug, newKey } from '../../server/utils/id'

describe('ID generation utilities', () => {
  it('newPk() generates a valid UUIDv7 string', () => {
    const pk = newPk()
    expect(pk).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('newSlug() generates a 21-character nanoid', () => {
    const slug = newSlug()
    expect(slug).toHaveLength(21)
    expect(slug).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('newKey() generates a 48-character nanoid', () => {
    const key = newKey()
    expect(key).toHaveLength(48)
    expect(key).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('generates unique values each time', () => {
    const pks = new Set(Array.from({ length: 100 }, () => newPk()))
    expect(pks.size).toBe(100)

    const slugs = new Set(Array.from({ length: 100 }, () => newSlug()))
    expect(slugs.size).toBe(100)
  })
})
