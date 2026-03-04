export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, validateSlugParam)

  try {
    const deleted = await db.delete(tables.posts).where(eq(tables.posts.slug, slug)).returning()

    if (!deleted.length) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Post not found' })
    }

    return { success: true, deleted: deleted[0] }
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to delete post' })
  }
})
