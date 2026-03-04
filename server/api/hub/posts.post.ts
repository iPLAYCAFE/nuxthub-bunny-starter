export default defineEventHandler(async (event) => {
  const { title, content } = await readValidatedBody(event, validatePostCreate)

  try {
    const [post] = await db.insert(tables.posts).values({ title, content: content || '' }).returning()
    return { success: true, post }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to create post' })
  }
})
