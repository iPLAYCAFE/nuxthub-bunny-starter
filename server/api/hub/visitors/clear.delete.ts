export default defineEventHandler(async () => {
  try {
    const deleted = await db.delete(tables.visitors).returning()
    return { success: true, message: 'All visitors cleared', count: deleted.length }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to clear visitors' })
  }
})
