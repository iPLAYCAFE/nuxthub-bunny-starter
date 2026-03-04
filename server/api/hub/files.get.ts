import { blob } from '@nuxthub/blob'

export default defineEventHandler(async () => {
  try {
    const files = await blob.list({ prefix: 'uploads' })

    return {
      files: files.blobs,
      total: files.blobs.length
    }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to list files' })
  }
})
