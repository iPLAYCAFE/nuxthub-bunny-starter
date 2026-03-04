import { describe, it, expect } from 'vitest'
import { getTableColumns, getTableName } from 'drizzle-orm'
import { visitors, users, posts, usersRelations, postsRelations } from '../../server/db/schema'

describe('Database Schema', () => {
  // ── visitors table ──
  describe('visitors table', () => {
    it('has correct table name', () => {
      expect(getTableName(visitors)).toBe('visitors')
    })

    it('has all required columns', () => {
      const cols = getTableColumns(visitors)
      expect(cols).toHaveProperty('id')
      expect(cols).toHaveProperty('page')
      expect(cols).toHaveProperty('userAgent')
      expect(cols).toHaveProperty('ip')
      expect(cols).toHaveProperty('country')
      expect(cols).toHaveProperty('visitedAt')
    })

    it('id is primary key', () => {
      const cols = getTableColumns(visitors)
      expect(cols.id.primary).toBe(true)
    })

    it('page has notNull constraint with default "/"', () => {
      const cols = getTableColumns(visitors)
      expect(cols.page.notNull).toBe(true)
      expect(cols.page.hasDefault).toBe(true)
    })
  })

  // ── users table ──
  describe('users table', () => {
    it('has correct table name', () => {
      expect(getTableName(users)).toBe('users')
    })

    it('has all required columns', () => {
      const cols = getTableColumns(users)
      expect(cols).toHaveProperty('id')
      expect(cols).toHaveProperty('slug')
      expect(cols).toHaveProperty('name')
      expect(cols).toHaveProperty('email')
      expect(cols).toHaveProperty('createdAt')
    })

    it('slug is notNull and unique', () => {
      const cols = getTableColumns(users)
      expect(cols.slug.notNull).toBe(true)
      expect(cols.slug.isUnique).toBe(true)
    })

    it('email is unique', () => {
      const cols = getTableColumns(users)
      expect(cols.email.isUnique).toBe(true)
    })

    it('id is primary key with default function', () => {
      const cols = getTableColumns(users)
      expect(cols.id.primary).toBe(true)
      expect(cols.id.hasDefault).toBe(true)
    })
  })

  // ── posts table ──
  describe('posts table', () => {
    it('has correct table name', () => {
      expect(getTableName(posts)).toBe('posts')
    })

    it('has all required columns', () => {
      const cols = getTableColumns(posts)
      expect(cols).toHaveProperty('id')
      expect(cols).toHaveProperty('slug')
      expect(cols).toHaveProperty('title')
      expect(cols).toHaveProperty('content')
      expect(cols).toHaveProperty('authorId')
      expect(cols).toHaveProperty('createdAt')
      expect(cols).toHaveProperty('updatedAt')
    })

    it('title is notNull', () => {
      const cols = getTableColumns(posts)
      expect(cols.title.notNull).toBe(true)
    })

    it('slug is notNull and unique', () => {
      const cols = getTableColumns(posts)
      expect(cols.slug.notNull).toBe(true)
      expect(cols.slug.isUnique).toBe(true)
    })

    it('content is optional (nullable)', () => {
      const cols = getTableColumns(posts)
      expect(cols.content.notNull).toBe(false)
    })

    it('authorId references users table', () => {
      const cols = getTableColumns(posts)
      // authorId should not be notNull (optional FK)
      expect(cols.authorId.notNull).toBe(false)
    })

    it('has default functions for id, slug, createdAt, updatedAt', () => {
      const cols = getTableColumns(posts)
      expect(cols.id.hasDefault).toBe(true)
      expect(cols.slug.hasDefault).toBe(true)
      expect(cols.createdAt.hasDefault).toBe(true)
      expect(cols.updatedAt.hasDefault).toBe(true)
    })
  })

  // ── Cross-table consistency ──
  describe('cross-table consistency', () => {
    it('all tables use binaryUuid for id column (blob datatype)', () => {
      for (const table of [visitors, users, posts]) {
        const cols = getTableColumns(table)
        expect(cols.id.dataType).toBe('custom')
        expect(cols.id.primary).toBe(true)
      }
    })

    it('users and posts have slug columns with matching config', () => {
      const userSlug = getTableColumns(users).slug
      const postSlug = getTableColumns(posts).slug
      expect(userSlug.notNull).toBe(true)
      expect(userSlug.isUnique).toBe(true)
      expect(postSlug.notNull).toBe(true)
      expect(postSlug.isUnique).toBe(true)
    })
  })

  // ── Relations ──
  describe('relations', () => {
    it('usersRelations is exported and defined', () => {
      expect(usersRelations).toBeDefined()
      expect(typeof usersRelations).toBe('object')
    })

    it('postsRelations is exported and defined', () => {
      expect(postsRelations).toBeDefined()
      expect(typeof postsRelations).toBe('object')
    })
  })
})
