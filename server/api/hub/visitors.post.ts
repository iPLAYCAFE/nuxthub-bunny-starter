export default defineEventHandler(async (event) => {
  const { page } = await readValidatedBody(event, validateVisitorBody)

  try {
    const result = await db.insert(tables.visitors).values({
      page: page || '/',
      userAgent: getHeader(event, 'user-agent') || 'unknown',
      ip: getHeader(event, 'x-forwarded-for') || 'unknown',
      country: getHeader(event, 'bunny-client-country')
        || getHeader(event, 'cf-ipcountry')
        || null
    }).returning()

    return { visitor: result[0] }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to record visit' })
  }
})
