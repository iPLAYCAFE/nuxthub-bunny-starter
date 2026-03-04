import { kv } from '@nuxthub/kv'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Key is required' })
  }

  try {
    await kv.del(key)
    return { success: true, deleted: key }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to delete KV entry' })
  }
})
