<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

interface VisitorsResponse {
  recent: { id: string, page: string | null, ip: string, country: string | null, userAgent: string | null, visitedAt: string }[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const { data, refresh, status } = useFetch<VisitorsResponse>('/api/hub/visitors', { lazy: true })
const visitSaving = ref(false)

const loading = computed(() => status.value === 'pending')

defineExpose({
  data,
  loading,
  refresh,
  endpoint: 'GET /api/hub/visitors'
})

async function recordVisit() {
  visitSaving.value = true
  try {
    await $fetch('/api/hub/visitors', { method: 'POST', body: { page: '/' } })
    toast.add({ title: t('liveDemo.visitRecorded'), color: 'success', icon: 'i-lucide-check' })
    refresh()
  } catch {
    toast.add({ title: t('liveDemo.error'), color: 'error' })
  } finally {
    visitSaving.value = false
  }
}

async function clearVisitors() {
  try {
    await $fetch('/api/hub/visitors/clear', { method: 'DELETE' })
    toast.add({ title: t('liveDemo.visitorsCleared'), color: 'success', icon: 'i-lucide-trash-2' })
    refresh()
  } catch { toast.add({ title: t('liveDemo.error'), color: 'error' }) }
}
</script>

<template>
  <div>
    <!-- Write form -->
    <div class="mb-4">
      <UPageCard variant="subtle">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-mouse-pointer-click"
            class="text-primary w-5 h-5 shrink-0"
          />
          <span class="text-sm text-muted flex-1">{{ t('liveDemo.visitHint') }}</span>
          <UButton
            icon="i-lucide-plus"
            :label="t('liveDemo.recordVisit')"
            :loading="visitSaving"
            size="sm"
            @click="recordVisit"
          />
          <UButton
            icon="i-lucide-trash-2"
            :label="t('liveDemo.clear')"
            color="error"
            variant="ghost"
            size="sm"
            @click="clearVisitors"
          />
        </div>
      </UPageCard>
    </div>

    <!-- Loading -->
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

    <!-- Response display -->
    <div
      v-else-if="data?.recent?.length"
      class="space-y-2"
    >
      <div class="text-xs text-dimmed mb-2 font-mono">
        {{ t('liveDemo.totalVisitors') }}: {{ data.total }}
      </div>
      <div
        v-for="v in data.recent"
        :key="v.id"
        class="p-3 rounded-lg bg-(--ui-bg-elevated)/50"
      >
        <div class="flex items-center gap-2 text-sm">
          <UIcon
            name="i-lucide-user"
            class="w-4 h-4 text-muted shrink-0"
          />
          <span class="font-mono">{{ v.page }}</span>
          <span class="text-xs text-dimmed">{{ v.ip }}</span>
          <span
            v-if="v.country"
            class="text-xs text-dimmed"
          >· {{ v.country }}</span>
        </div>
        <div class="text-xs text-dimmed mt-1 truncate font-mono">
          {{ v.userAgent?.substring(0, 80) }}{{ (v.userAgent?.length ?? 0) > 80 ? '…' : '' }}
        </div>
        <div class="text-xs text-dimmed mt-0.5 font-mono">
          {{ v.visitedAt }}
        </div>
      </div>
    </div>
    <pre
      v-else
      class="text-sm font-mono text-muted overflow-x-auto leading-relaxed"
    ><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
  </div>
</template>
