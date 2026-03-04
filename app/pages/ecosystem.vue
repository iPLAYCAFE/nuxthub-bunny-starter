<script setup lang="ts">
const { t } = useI18n()
const { public: { siteUrl } } = useRuntimeConfig()
const { data: modules } = await useFetch('/api/modules')

useSeoMeta({
  title: () => t('meta.ecosystemTitle'),
  description: () => t('meta.ecosystemDescription')
})
</script>

<template>
  <div>
    <!-- ═══ Modules Grid ═══ -->
    <UPageSection
      :headline="t('modules.headline')"
      :title="t('modules.title')"
      :description="t('modules.description')"
    >
      <template v-if="modules?.length">
        <div
          v-for="category in modules"
          :key="category.category"
          class="mb-10"
        >
          <h3 class="text-lg font-bold mb-4 text-muted">
            {{ category.category }}
          </h3>
          <UPageGrid>
            <EcosystemCard
              v-for="item in category.items"
              :key="item.name"
              v-bind="item"
            />
          </UPageGrid>
        </div>
      </template>
    </UPageSection>

    <USeparator />

    <!-- ═══ Tech Stack ═══ -->
    <UPageSection
      :headline="t('unjs.headline')"
      :title="t('unjs.title')"
      :description="t('unjs.description')"
    >
      <template #links>
        <UButton
          label="unjs.io"
          to="https://unjs.io"
          target="_blank"
          icon="i-lucide-external-link"
          color="neutral"
          variant="subtle"
          size="sm"
        />
      </template>
      <TechMarquee />
    </UPageSection>

    <USeparator />

    <!-- ═══ PWA ═══ -->
    <UPageSection
      :headline="t('pwa.headline')"
      :title="t('pwa.title')"
      :description="t('pwa.description')"
    >
      <template #links>
        <UButton
          label="@vite-pwa/nuxt"
          to="https://vite-pwa-org.netlify.app/frameworks/nuxt"
          target="_blank"
          icon="i-lucide-external-link"
          color="neutral"
          variant="subtle"
          size="sm"
        />
      </template>
      <div class="flex flex-col sm:flex-row items-center gap-8 justify-center">
        <UPageCard
          variant="subtle"
          :ui="{ container: 'text-center p-6 sm:p-6' }"
          class="max-w-sm"
        >
          <div class="flex items-center justify-center gap-3 mb-4">
            <UIcon
              name="i-lucide-smartphone"
              class="w-8 h-8 text-primary"
            />
            <span class="font-bold text-xl">{{ t('pwa.installApp') }}</span>
          </div>
          <p class="text-sm text-muted mb-4">
            {{ t('pwa.scanQr') }}
          </p>
          <Qrcode
            :value="siteUrl"
            variant="rounded"
            :radius="1"
            class="w-32 h-32 mx-auto"
          />
        </UPageCard>

        <div class="space-y-3 max-w-sm">
          <div
            v-for="f in [t('pwa.serviceWorker'), t('pwa.offlineFirst'), t('pwa.autoUpdate'), t('pwa.standalone')]"
            :key="f"
            class="flex items-center gap-3"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5 text-primary shrink-0"
            />
            <span class="text-sm text-muted">{{ f }}</span>
          </div>

          <!-- Install Guide -->
          <div class="pt-4 border-t border-(--ui-border) space-y-2">
            <div class="text-sm font-bold">
              {{ t('pwa.installGuide') }}
            </div>
            <div class="flex items-start gap-2">
              <UIcon
                name="i-simple-icons-android"
                class="w-4 h-4 text-[#3DDC84] shrink-0 mt-0.5"
              />
              <div>
                <div class="text-xs font-medium">
                  {{ t('pwa.androidTitle') }}
                </div>
                <div class="text-xs text-dimmed">
                  {{ t('pwa.androidStep1') }}
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <UIcon
                name="i-simple-icons-apple"
                class="w-4 h-4 text-muted shrink-0 mt-0.5"
              />
              <div>
                <div class="text-xs font-medium">
                  {{ t('pwa.iosTitle') }}
                </div>
                <div class="text-xs text-dimmed">
                  {{ t('pwa.iosStep1') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>
  </div>
</template>
