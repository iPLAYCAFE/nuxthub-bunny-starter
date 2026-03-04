import { kv } from '@nuxthub/kv'

export default defineEventHandler(async (event) => {
  const { key } = await getValidatedQuery(event, validateKvQuery)

  try {
    if (key) {
      const value = await kv.get(key)
      return { key, value }
    }

    const keys = await kv.keys()
    return { keys, total: keys.length }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Failed to read KV storage' })
  }
})
