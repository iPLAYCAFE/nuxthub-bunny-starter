import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  navigation: z.boolean().default(true)
})

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: pageSchema
    })
  }
})
