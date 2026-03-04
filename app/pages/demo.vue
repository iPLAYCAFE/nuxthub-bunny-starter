<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.demoTitle'),
  description: () => t('meta.demoDescription')
})
</script>

<template>
  <div class="overflow-x-hidden">
    <!-- ═══ Live API Demo ═══ -->
    <UPageSection
      :headline="t('liveDemo.headline')"
      :title="t('liveDemo.title')"
      :description="t('liveDemo.description')"
    >
      <LazyLiveApiDemo />
    </UPageSection>

    <USeparator />

    <!-- ═══ Auth & Security ═══ -->
    <UPageSection
      :headline="t('auth.headline')"
      :title="t('auth.title')"
      :description="t('auth.description')"
    >
      <LazyAuthDemo />
    </UPageSection>

    <USeparator />

    <!-- ═══ WebSocket Demo ═══ -->
    <UPageSection
      :headline="t('ws.headline')"
      :title="t('ws.title')"
      :description="t('ws.description')"
    >
      <LazyWsDemo />
    </UPageSection>
  </div>
</template>
