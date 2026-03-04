import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { binaryUuid } from './binary-uuid'
import { newPk, newSlug } from '../utils/id'

// ── ID Strategy ─────────────────────────────────────────────
// PK:   UUIDv7 as BLOB(16) — time-ordered, 56% smaller than TEXT(36)
// Slug: Nanoid(21) — URL-safe, CSPRNG, no timestamp leak
// Key:  Nanoid(48) — 288-bit entropy for secrets (hash before storing)
//
// ── Future: Turso libSQL Features ───────────────────────────
// When Bunny Database / libSQL supports these natively:
// - WITHOUT ROWID: pending Drizzle ORM support for schema definition
// - F32_BLOB: native vector embeddings for AI search
// - CDC: Change Data Capture for real-time sync
// - FTS: native Full Text Search (beyond FTS5)
// - Concurrent Writes: 4x faster writes than SQLite

// ── Visitors (analytics — UUIDv7 PK for time-range queries) ─
export const visitors = sqliteTable('visitors', {
  id: binaryUuid('id').primaryKey().$defaultFn(newPk),
  page: text('page').notNull().default('/'),
  userAgent: text('user_agent'),
  ip: text('ip'),
  country: text('country'),
  visitedAt: integer('visited_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

// ── Users (UUIDv7 PK + nanoid public slug) ──────────────────
export const users = sqliteTable('users', {
  id: binaryUuid('id').primaryKey().$defaultFn(newPk),
  slug: text('slug', { length: 21 }).unique().notNull().$defaultFn(newSlug),
  name: text('name'),
  email: text('email').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
}, table => [
  index('users_slug_idx').on(table.slug),
  index('users_email_idx').on(table.email)
])

// ── Posts (UUIDv7 PK + nanoid public slug + FK) ─────────────
export const posts = sqliteTable('posts', {
  id: binaryUuid('id').primaryKey().$defaultFn(newPk),
  slug: text('slug', { length: 21 }).unique().notNull().$defaultFn(newSlug),
  title: text('title').notNull(),
  content: text('content'),
  authorId: binaryUuid('author_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
}, table => [
  index('posts_slug_idx').on(table.slug),
  index('posts_author_id_idx').on(table.authorId)
])

// ── Relations (Drizzle v0.x) ────────────────────────────────
// Enables `db.query.posts.findMany({ with: { author: true } })`
//
// Drizzle v1 migration note: v1 uses `defineRelations()` with a different API.
// See: https://orm.drizzle.team/docs/relations-v2
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] })
}))
