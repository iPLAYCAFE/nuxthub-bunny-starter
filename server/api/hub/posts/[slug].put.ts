export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, validateSlugParam)
  const body = await readValidatedBody(event, validatePostUpdate)

  try {
    const updated = await db.update(tables.posts)
      .set({
        title: body.title.trim(),
        content: body.content?.trim() || null,
        updatedAt: new Date()
      })
      .where(eq(tables.posts.slug, slug))
      .returning()

    if (!updated.length) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Post not found' })
    }

    return { success: true, post: updated[0] }
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to update post' })
  }
})
