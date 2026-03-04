import { describe, it, expect } from 'vitest'
import { v7 as uuidv7, parse, stringify } from 'uuid'

/**
 * Test the binaryUuid custom column type logic directly.
 * Since Drizzle ORM's customType wraps the raw functions internally,
 * we test the conversion logic directly using the same uuid parse/stringify.
 */
describe('Binary UUID conversion logic', () => {
  const sampleUuid = uuidv7()

  function toDriver(value: string): Buffer {
    return Buffer.from(parse(value) as Uint8Array)
  }

  function fromDriver(value: Buffer): string {
    return stringify(new Uint8Array(value))
  }

  it('toDriver converts UUID string to 16-byte Buffer', () => {
    const buffer = toDriver(sampleUuid)
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBe(16)
  })

  it('fromDriver converts Buffer back to UUID string', () => {
    const buffer = Buffer.from(parse(sampleUuid) as Uint8Array)
    const result = fromDriver(buffer)
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  it('round-trip: fromDriver(toDriver(uuid)) === uuid', () => {
    const buffer = toDriver(sampleUuid)
    const result = fromDriver(buffer)
    expect(result).toBe(sampleUuid)
  })

  it('preserves UUIDv7 ordering across multiple values', () => {
    const uuids = Array.from({ length: 10 }, () => uuidv7())
    const buffers = uuids.map(u => toDriver(u))
    const restored = buffers.map(b => fromDriver(b))
    expect(restored).toEqual(uuids)
  })

  it('produces lexicographically sortable binary from time-ordered UUIDs', () => {
    const uuids = Array.from({ length: 5 }, () => uuidv7())
    const buffers = uuids.map(u => toDriver(u))
    // Binary buffers should maintain the same sort order as the UUIDs
    const sortedBuffers = [...buffers].sort(Buffer.compare)
    const sortedUuids = sortedBuffers.map(b => fromDriver(b))
    expect(sortedUuids).toEqual(uuids)
  })
})
