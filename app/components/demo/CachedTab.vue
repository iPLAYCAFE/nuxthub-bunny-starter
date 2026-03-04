<script setup lang="ts">
const { t } = useI18n()
const { data, refresh, status } = useFetch('/api/hub/cached-stats', { lazy: true })

const loading = computed(() => status.value === 'pending')

defineExpose({
  data,
  loading,
  refresh,
  endpoint: 'GET /api/hub/cached-stats',
  badge: { label: 'liveDemo.ttl5min', color: 'warning' as const }
})
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="flex items-center justify-center py-8 text-muted"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-5 h-5 animate-spin mr-2"
      />
      <span class="text-sm">{{ t('liveDemo.fetching') }}</span>
    </div>
    <pre
      v-else
      class="text-sm font-mono text-muted overflow-x-auto leading-relaxed"
    ><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
  </div>
</template>
