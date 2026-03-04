<script setup lang="ts">
const { t } = useI18n()
const activeTab = ref('health')

// ── Tab definitions ──
const tabs = computed(() => [
  { label: t('liveDemo.health'), value: 'health', icon: 'i-lucide-heart-pulse' },
  { label: t('liveDemo.cachedStats'), value: 'cached', icon: 'i-lucide-zap' },
  { label: t('liveDemo.database'), value: 'database', icon: 'i-lucide-database' },
  { label: t('liveDemo.kv'), value: 'kv', icon: 'i-lucide-key' },
  { label: t('liveDemo.blob'), value: 'blob', icon: 'i-lucide-hard-drive' },
  { label: t('liveDemo.posts'), value: 'posts', icon: 'i-lucide-file-text' }
])

// ── Tab component refs ──
const healthRef = ref()
const cachedRef = ref()
const databaseRef = ref()
const kvRef = ref()
const blobRef = ref()
const postsRef = ref()

const activeRef = computed(() => {
  switch (activeTab.value) {
    case 'health': return healthRef.value
    case 'cached': return cachedRef.value
    case 'database': return databaseRef.value
    case 'kv': return kvRef.value
    case 'blob': return blobRef.value
    case 'posts': return postsRef.value
    default: return null
  }
})

const activeEndpoint = computed(() => activeRef.value?.endpoint ?? '')
const activeData = computed(() => activeRef.value?.data)
const isLoading = computed(() => activeRef.value?.loading ?? false)
const activeBadge = computed(() => activeRef.value?.badge)

function refresh() {
  activeRef.value?.refresh()
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto overflow-hidden">
    <!-- Tab selector -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 mb-4 md:justify-center [&>*]:min-w-0">
      <UButton
        v-for="tab in tabs"
        :key="tab.value"
        :icon="tab.icon"
        :label="tab.label"
        :color="activeTab === tab.value ? 'primary' : 'neutral'"
        :variant="activeTab === tab.value ? 'subtle' : 'ghost'"
        size="xs"
        class="w-full justify-center truncate"
        @click="activeTab = tab.value"
      />
    </div>

    <!-- ═══ Terminal-style header (endpoint + refresh) ═══ -->
    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0' }"
    >
      <div class="px-4 py-3 flex items-center gap-2 min-w-0">
        <div class="flex items-center gap-1.5 shrink-0">
          <div class="w-3 h-3 rounded-full bg-red-500/80" />
          <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div class="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div class="flex items-center gap-2 min-w-0">
          <div
            class="w-2 h-2 rounded-full shrink-0"
            :class="activeData ? 'bg-primary animate-pulse' : 'bg-muted'"
          />
          <span class="text-sm font-mono text-muted truncate">{{ activeEndpoint }}</span>
        </div>
        <UBadge
          v-if="activeBadge"
          :label="t(activeBadge.label)"
          size="xs"
          :color="activeBadge.color"
          variant="subtle"
          class="shrink-0 hidden sm:inline-flex"
        />
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="ghost"
          size="xs"
          class="shrink-0"
          :loading="isLoading"
          @click="refresh()"
        />
      </div>
    </UPageCard>

    <!-- ═══ Tab content (forms + rich response display) ═══ -->
    <DemoHealthTab
      v-show="activeTab === 'health'"
      ref="healthRef"
    />
    <DemoCachedTab
      v-show="activeTab === 'cached'"
      ref="cachedRef"
    />
    <DemoDatabaseTab
      v-show="activeTab === 'database'"
      ref="databaseRef"
    />
    <DemoKvTab
      v-show="activeTab === 'kv'"
      ref="kvRef"
    />
    <DemoBlobTab
      v-show="activeTab === 'blob'"
      ref="blobRef"
    />
    <DemoPostsTab
      v-show="activeTab === 'posts'"
      ref="postsRef"
    />
  </div>
</template>
