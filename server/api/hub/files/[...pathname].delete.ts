import { blob } from '@nuxthub/blob'

export default defineEventHandler(async (event) => {
  const pathname = getRouterParam(event, 'pathname')
  if (!pathname) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Pathname is required' })
  }

  try {
    await blob.del(pathname)
    return { success: true, deleted: pathname }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to delete file' })
  }
})
