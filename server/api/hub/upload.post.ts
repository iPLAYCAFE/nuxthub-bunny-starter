import { blob } from '@nuxthub/blob'

export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const file = form.get('file') as File

  if (!file || !file.size) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'No file provided' })
  }

  ensureBlob(file, {
    maxSize: '2MB',
    types: ['image', 'text', 'pdf']
  })

  try {
    return await blob.put(file.name, file, {
      addRandomSuffix: true,
      prefix: 'uploads'
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[blob:upload] Failed to upload file:', message, err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Blob Upload Error',
      message: `Upload failed: ${message}`
    })
  }
})
