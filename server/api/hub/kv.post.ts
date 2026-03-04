import { kv } from '@nuxthub/kv'

export default defineEventHandler(async (event) => {
  const { key, value } = await readValidatedBody(event, validateKvBody)

  try {
    await kv.set(key, value)
    return { success: true, key, value }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to set KV entry' })
  }
})
