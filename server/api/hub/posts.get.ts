export default defineEventHandler(async (event) => {
  const { page, limit } = await getValidatedQuery(event, validatePagination)
  const offset = (page - 1) * limit

  try {
    const [totalResult] = await db.select({ count: count() }).from(tables.posts)
    const total = totalResult?.count ?? 0
    const rows = await db.select().from(tables.posts).orderBy(desc(tables.posts.createdAt)).limit(limit).offset(offset)

    return {
      posts: rows,
      count: rows.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to fetch posts' })
  }
})
