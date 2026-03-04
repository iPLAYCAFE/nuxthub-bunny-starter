<script setup lang="ts">
const { t } = useI18n()
const appConfig = useAppConfig()
const { data: stats } = await useFetch('/api/stats')
</script>

<template>
  <div>
    <!-- ═══ Hero ═══ -->
    <div class="relative">
      <StarsBg :star-count="200" />

      <UPageHero
        :description="t('hero.description')"
        :links="[
          { label: t('hero.getStarted'), to: 'https://hub.nuxt.com', target: '_blank', trailingIcon: 'i-lucide-arrow-right', size: 'xl' as const },
          { label: t('hero.useTemplate'), to: appConfig.github.url, target: '_blank', icon: 'i-simple-icons-github', size: 'xl' as const, color: 'neutral' as const, variant: 'subtle' as const }
        ]"
      >
        <template #headline>
          <UBadge
            color="primary"
            variant="subtle"
            size="lg"
          >
            {{ t('hero.badge') }}
          </UBadge>
        </template>

        <template #title>
          <span class="text-3xl sm:text-5xl lg:text-6xl font-bold">
            <span class="text-highlighted">Nuxt</span><span class="text-primary">Hub</span>
            <span class="text-muted mx-1 sm:mx-2">×</span>
            <span class="text-highlighted">bunny</span><span class="text-[#FD8D32]">.net</span>
          </span>
        </template>

        <template #bottom>
          <div class="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <UPageCard
              v-for="(item, key) in {
                [t('hero.nuxtModules')]: stats?.stats?.nuxtModules,
                [t('hero.bunnyServices')]: stats?.stats?.bunnyServices,
                [t('hero.unjsPackages')]: stats?.stats?.unjsPackages,
                [t('hero.integrations')]: stats?.stats?.totalIntegrations
              }"
              :key="key"
              variant="subtle"
              :ui="{ container: 'text-center p-4 sm:p-4' }"
            >
              <div class="text-2xl sm:text-3xl font-black text-primary">
                {{ item ?? '—' }}
              </div>
              <div class="text-xs sm:text-sm text-muted mt-1">
                {{ key }}
              </div>
            </UPageCard>
          </div>
        </template>
      </UPageHero>
    </div>

    <!-- ═══ Architecture ═══ -->
    <UPageSection
      :headline="t('architecture.headline')"
      :title="t('architecture.title')"
      :description="t('architecture.description')"
    >
      <ArchitectureMap />
    </UPageSection>

    <!-- ═══ CTA ═══ -->
    <UPageSection class="relative">
      <StarsBg :star-count="100" />
      <UPageCTA
        :title="t('cta.title')"
        :description="t('cta.description')"
        variant="subtle"
        :links="[
          { label: t('cta.cloneGitHub'), to: appConfig.github.url, target: '_blank', icon: 'i-simple-icons-github', trailingIcon: 'i-lucide-arrow-right', color: 'neutral' as const },
          { label: 'NuxtHub Docs', to: 'https://hub.nuxt.com/docs/getting-started', target: '_blank', icon: 'i-lucide-book-open', color: 'neutral' as const, variant: 'outline' as const },
          { label: 'bunny.net Docs', to: 'https://docs.bunny.net', target: '_blank', icon: 'i-lucide-book-open', color: 'neutral' as const, variant: 'outline' as const }
        ]"
      />
    </UPageSection>
  </div>
</template>
