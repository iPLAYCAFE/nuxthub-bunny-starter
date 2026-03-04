<script setup lang="ts">
/**
 * Renders content from studio.md via Nuxt Content's ContentRenderer.
 *
 * Follows the same pattern as Docus (nuxt-content/docus):
 * - Plain useAsyncData + ContentRenderer
 * - No defensive workarounds (getCachedData, watch, stableContent)
 * - Let Nuxt Content handle hydration naturally
 *
 * @see https://github.com/nuxt-content/docus/blob/main/layer/app/pages/%5B%5Blang%5D%5D/%5B...slug%5D.vue
 */
const { data: page } = await useAsyncData(
  'studio-content',
  () => queryCollection('content').path('/studio').first()
)
</script>

<template>
  <div>
    <ContentRenderer
      v-if="page"
      :value="page"
    />
    <div
      v-else
      class="bg-(--ui-bg-muted) rounded-lg p-6 text-center"
    >
      <h3 class="text-lg font-semibold mb-2">
        Studio Content
      </h3>
      <p class="text-sm text-muted">
        This section renders Markdown content from <code class="text-xs">content/studio.md</code>
        using Nuxt Content v3. Edit this file to see live changes.
      </p>
    </div>
  </div>
</template>
