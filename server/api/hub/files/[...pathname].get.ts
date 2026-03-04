import { blob } from '@nuxthub/blob'

export default defineEventHandler(async (event) => {
  const pathname = getRouterParam(event, 'pathname')
  if (!pathname) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Pathname is required' })
  }

  try {
    const file = await blob.get(pathname)
    if (!file) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'File not found' })
    }

    return file
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err) throw err
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to get file' })
  }
})
