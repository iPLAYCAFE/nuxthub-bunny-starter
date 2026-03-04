/**
 * Shared Zod schemas + validator functions for API request validation
 *
 * h3 v1.x `readValidatedBody()` expects a validator function: (data) => parsed
 * h3 v2+ supports Standard-Schema objects directly (future-ready)
 *
 * We export both the raw schema (for type inference) and a validator function.
 *
 * See: https://h3.dev/raw/examples/validate-data.md
 */
import { z } from 'zod'

// ── Raw Schemas (for type inference) ─────────────────────

const postCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().max(10000, 'Content must be 10,000 characters or less').optional()
})

const postUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().max(10000, 'Content must be 10,000 characters or less').nullable().optional()
})

const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(100)
})

const kvBodySchema = z.object({
  key: z.string().min(1, 'Key is required').max(256, 'Key must be 256 characters or less'),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]).default('')
})

const visitorBodySchema = z.object({
  page: z.string().max(500, 'Page path must be 500 characters or less').optional()
})

const kvQuerySchema = z.object({
  key: z.string().max(256, 'Key must be 256 characters or less').optional()
})

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})

// ── Validator Functions (for h3 v1.x readValidatedBody) ──

/** POST /api/hub/posts — create a new post */
export const validatePostCreate = (data: unknown) => postCreateSchema.parse(data)

/** PUT /api/hub/posts/[slug] — update a post */
export const validatePostUpdate = (data: unknown) => postUpdateSchema.parse(data)

/** Slug route parameter validation */
export const validateSlugParam = (data: unknown) => slugParamSchema.parse(data)

/** POST /api/hub/kv — set a key-value pair */
export const validateKvBody = (data: unknown) => kvBodySchema.parse(data)

/** POST /api/hub/visitors — record a visit */
export const validateVisitorBody = (data: unknown) => visitorBodySchema.parse(data)

/** GET /api/hub/kv — optional key query param */
export const validateKvQuery = (data: unknown) => kvQuerySchema.parse(data)

/** Pagination query params — page, limit */
export const validatePagination = (data: unknown) => paginationSchema.parse(data)

// ── Inferred Types ──────────────────────────────────────

export type PostCreateBody = z.infer<typeof postCreateSchema>
export type PostUpdateBody = z.infer<typeof postUpdateSchema>
export type SlugParam = z.infer<typeof slugParamSchema>
export type KvBody = z.infer<typeof kvBodySchema>
export type VisitorBody = z.infer<typeof visitorBodySchema>
export type KvQuery = z.infer<typeof kvQuerySchema>
export type Pagination = z.infer<typeof paginationSchema>
