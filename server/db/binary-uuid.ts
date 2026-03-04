import { customType } from 'drizzle-orm/sqlite-core'
import { parse, stringify } from 'uuid'

/**
 * Binary UUID column type for SQLite/libsql
 * Stores UUID as BLOB(16) instead of TEXT(36) — saves 56% storage
 * Used with UUIDv7 for time-ordered primary keys
 */
export const binaryUuid = customType<{ data: string, driverData: Uint8Array }>({
  dataType() {
    return 'blob(16)'
  },
  toDriver(value: string): Uint8Array {
    return new Uint8Array(parse(value))
  },
  fromDriver(value: Uint8Array): string {
    return stringify(new Uint8Array(value))
  }
})
