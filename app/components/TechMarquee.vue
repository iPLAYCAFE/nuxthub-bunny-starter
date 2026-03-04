<script setup lang="ts">
const { t } = useI18n()

const items = computed(() => [
  { name: 'Nitro', desc: t('unjs.nitro'), icon: 'i-lucide-server' },
  { name: 'h3', desc: t('unjs.h3'), icon: 'i-lucide-globe' },
  { name: 'unstorage', desc: t('unjs.unstorage'), icon: 'i-lucide-archive' },
  { name: 'db0', desc: t('unjs.db0'), icon: 'i-lucide-database' },
  { name: 'crossws', desc: t('unjs.crossws'), icon: 'i-lucide-radio' },
  { name: 'ofetch', desc: t('unjs.ofetch'), icon: 'i-lucide-download' },
  { name: 'unhead', desc: t('unjs.unhead'), icon: 'i-lucide-heading' },
  { name: 'ipx', desc: t('unjs.ipx'), icon: 'i-lucide-image' },
  { name: 'ufo', desc: t('unjs.ufo'), icon: 'i-lucide-link' },
  { name: 'consola', desc: t('unjs.consola'), icon: 'i-lucide-terminal' },
  { name: 'destr', desc: t('unjs.destr'), icon: 'i-lucide-braces' },
  { name: 'ohash', desc: t('unjs.ohash'), icon: 'i-lucide-hash' }
])
</script>

<template>
  <div class="relative overflow-hidden py-4">
    <!-- Fade edges -->
    <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-(--ui-bg) to-transparent z-10 pointer-events-none" />
    <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-(--ui-bg) to-transparent z-10 pointer-events-none" />

    <!-- Scrolling track -->
    <div class="marquee-track">
      <UPageCard
        v-for="(pkg, i) in [...items, ...items]"
        :key="`${pkg.name}-${i}`"
        variant="subtle"
        class="mx-2 shrink-0"
        :ui="{ container: 'flex items-center gap-3 px-5 py-3' }"
      >
        <UIcon
          :name="pkg.icon"
          class="w-5 h-5 text-primary shrink-0"
        />
        <div>
          <div class="font-bold text-sm whitespace-nowrap">
            {{ pkg.name }}
          </div>
          <div class="text-xs text-muted whitespace-nowrap">
            {{ pkg.desc }}
          </div>
        </div>
      </UPageCard>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
