<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

interface KvListResponse {
  keys: string[]
  total: number
}

interface KvGetResponse {
  key: string
  value: unknown
}

const { data, refresh, status } = useFetch<KvListResponse>('/api/hub/kv', { lazy: true })

// ── Form state ──
const kvKey = ref('')
const kvValue = ref('')
const kvSaving = ref(false)

// ── Value viewer ──
const expandedKvKey = ref<string | null>(null)
const expandedKvValue = ref<string | null>(null)
const kvValueLoading = ref(false)

const loading = computed(() => status.value === 'pending')

defineExpose({
  data,
  loading,
  refresh,
  endpoint: 'GET /api/hub/kv'
})

async function setKv() {
  if (!kvKey.value) return
  kvSaving.value = true
  try {
    await $fetch('/api/hub/kv', { method: 'POST', body: { key: kvKey.value, value: kvValue.value } })
    toast.add({ title: t('liveDemo.kvSaved'), color: 'success', icon: 'i-lucide-check' })
    kvKey.value = ''
    kvValue.value = ''
    refresh()
  } catch {
    toast.add({ title: t('liveDemo.error'), color: 'error' })
  } finally {
    kvSaving.value = false
  }
}

async function deleteKvKey(key: string) {
  try {
    await $fetch(`/api/hub/kv/${encodeURIComponent(key)}`, { method: 'DELETE' })
    toast.add({ title: t('liveDemo.kvDeleted'), color: 'success', icon: 'i-lucide-trash-2' })
    if (expandedKvKey.value === key) {
      expandedKvKey.value = null
      expandedKvValue.value = null
    }
    refresh()
  } catch { toast.add({ title: t('liveDemo.error'), color: 'error' }) }
}

async function toggleKvValue(key: string) {
  if (expandedKvKey.value === key) {
    expandedKvKey.value = null
    expandedKvValue.value = null
    return
  }
  kvValueLoading.value = true
  try {
    const result = await $fetch<KvGetResponse>('/api/hub/kv', { query: { key } })
    expandedKvKey.value = key
    expandedKvValue.value = typeof result.value === 'object' ? JSON.stringify(result.value, null, 2) : String(result.value ?? '')
  } catch {
    toast.add({ title: t('liveDemo.error'), color: 'error' })
  } finally {
    kvValueLoading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Write form -->
    <div class="mb-4">
      <UPageCard variant="subtle">
        <div class="flex flex-col sm:flex-row gap-2">
          <UInput
            v-model="kvKey"
            :placeholder="t('liveDemo.kvKeyPlaceholder')"
            class="flex-1"
          />
          <UInput
            v-model="kvValue"
            :placeholder="t('liveDemo.kvValuePlaceholder')"
            class="flex-1"
          />
          <UButton
            icon="i-lucide-save"
            :label="t('liveDemo.set')"
            :loading="kvSaving"
            :disabled="!kvKey"
            @click="setKv"
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
      v-else-if="data?.keys?.length"
      class="space-y-2"
    >
      <div
        v-for="key in data.keys"
        :key="key"
        class="rounded-lg bg-(--ui-bg-elevated)/50 overflow-hidden"
      >
        <div
          class="flex items-center gap-3 p-3 cursor-pointer hover:bg-(--ui-bg-elevated)/80 transition-colors"
          @click="toggleKvValue(key)"
        >
          <UIcon
            name="i-lucide-key"
            class="w-4 h-4 text-muted shrink-0"
          />
          <span class="text-sm font-mono flex-1 truncate">{{ key }}</span>
          <UIcon
            :name="expandedKvKey === key ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="w-4 h-4 text-dimmed shrink-0 transition-transform"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="xs"
            @click.stop="deleteKvKey(key)"
          />
        </div>
        <!-- Expanded value -->
        <div
          v-if="expandedKvKey === key"
          class="px-3 pb-3 border-t border-(--ui-border)/50"
        >
          <div
            v-if="kvValueLoading"
            class="flex items-center gap-2 py-2 text-muted"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-4 h-4 animate-spin"
            />
            <span class="text-xs">{{ t('liveDemo.fetching') }}</span>
          </div>
          <div
            v-else
            class="pt-2"
          >
            <div class="text-xs text-dimmed mb-1 font-mono">
              {{ t('liveDemo.kvValueLabel') }}:
            </div>
            <pre class="text-sm font-mono text-muted whitespace-pre-wrap break-all">{{ expandedKvValue }}</pre>
          </div>
        </div>
      </div>
    </div>
    <pre
      v-else
      class="text-sm font-mono text-muted overflow-x-auto leading-relaxed"
    ><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
  </div>
</template>
