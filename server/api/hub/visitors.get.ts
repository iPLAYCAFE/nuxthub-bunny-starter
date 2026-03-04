export default defineEventHandler(async (event) => {
  const { page, limit } = await getValidatedQuery(event, validatePagination)
  const offset = (page - 1) * limit

  try {
    const [totalResult] = await db.select({ count: count() }).from(tables.visitors)
    const total = totalResult?.count ?? 0
    const recent = await db.select().from(tables.visitors).orderBy(desc(tables.visitors.id)).limit(limit).offset(offset)

    return {
      recent,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to fetch visitors' })
  }
})
