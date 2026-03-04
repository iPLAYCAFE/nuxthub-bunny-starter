<script setup lang="ts">
const { t } = useI18n()

const mapping = computed(() => [
  {
    hub: t('architecture.database'),
    hubIcon: 'i-lucide-database',
    driver: 'db0 + Drizzle ORM',
    bunny: t('architecture.bunnyDatabase'),
    bunnyDetail: 'libsql'
  },
  {
    hub: t('architecture.blobStorage'),
    hubIcon: 'i-lucide-hard-drive',
    driver: 'unstorage S3',
    bunny: t('architecture.bunnyStorage'),
    bunnyDetail: 'S3 API'
  },
  {
    hub: t('architecture.kvStorage'),
    hubIcon: 'i-lucide-key',
    driver: 'unstorage Redis',
    bunny: t('architecture.redisSidecar'),
    bunnyDetail: 'Persistent Volume'
  },
  {
    hub: t('architecture.cache'),
    hubIcon: 'i-lucide-zap',
    driver: 'cachedEventHandler',
    bunny: t('architecture.bunnyCdnEdge'),
    bunnyDetail: 'TTL-based'
  }
])
</script>

<template>
  <UPageCard
    variant="subtle"
    :ui="{ container: 'p-4 sm:p-8' }"
    class="max-w-6xl mx-auto"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <span class="font-bold text-sm"><span class="text-highlighted">Nuxt</span><span
        class="text-primary"
      >Hub</span></span>
      <span class="hidden sm:block text-xs text-muted">{{ t('architecture.driverAdapter') }}</span>
      <span class="font-bold text-sm"><span class="text-highlighted">bunny</span><span
        class="text-[#FD8D32]"
      >.net</span></span>
    </div>

    <!-- Rows -->
    <div class="space-y-3">
      <div
        v-for="m in mapping"
        :key="m.hub"
        class="flex items-center gap-2 sm:gap-3 group"
      >
        <!-- NuxtHub side -->
        <div
          class="flex-1 flex items-center gap-2 bg-primary/5 rounded-xl px-3 sm:px-4 py-3 border border-primary/10 group-hover:border-primary/30 transition-colors min-w-0"
        >
          <UIcon
            :name="m.hubIcon"
            class="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-primary"
          />
          <span class="font-semibold text-xs sm:text-sm whitespace-nowrap">{{ m.hub }}</span>
        </div>

        <!-- Arrow + Driver -->
        <div class="hidden sm:flex flex-col items-center gap-0.5 shrink-0 w-28">
          <span class="text-[10px] text-muted leading-tight text-center whitespace-nowrap">{{ m.driver }}</span>
          <div class="flex items-center gap-1 text-muted">
            <div class="w-8 h-px bg-(--ui-border)" />
            <UIcon
              name="i-lucide-arrow-right"
              class="w-3 h-3"
            />
            <div class="w-8 h-px bg-(--ui-border)" />
          </div>
        </div>

        <!-- Mobile arrow -->
        <UIcon
          name="i-lucide-chevron-right"
          class="w-4 h-4 text-muted sm:hidden shrink-0"
        />

        <!-- Bunny side -->
        <div
          class="flex-1 flex items-center gap-2 bg-orange-500/5 rounded-xl px-3 sm:px-4 py-3 border border-orange-500/10 group-hover:border-orange-500/30 transition-colors min-w-0"
        >
          <div class="min-w-0">
            <span class="font-semibold text-xs sm:text-sm whitespace-nowrap block">{{ m.bunny }}</span>
            <span class="text-[10px] text-muted hidden sm:block">{{ m.bunnyDetail }}</span>
          </div>
        </div>
      </div>
    </div>
  </UPageCard>
</template>
