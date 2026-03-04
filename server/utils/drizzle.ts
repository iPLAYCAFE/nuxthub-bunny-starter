/**
 * Database utilities — powered by NuxtHub + Drizzle ORM
 *
 * `db` is auto-imported by `@nuxthub/core` — do NOT re-export it here.
 * `schema` contains all Drizzle table definitions from `server/db/schema.ts`.
 */
import { schema } from '@nuxthub/db'

export { sql, eq, and, or, count, desc, asc } from 'drizzle-orm'

/** Schema tables alias — `tables.posts`, `tables.visitors`, `tables.users` */
export const tables = schema
