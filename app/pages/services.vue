<script setup lang="ts">
const { t } = useI18n()
const appConfig = useAppConfig()
const colorMode = useColorMode()

useSeoMeta({
  title: () => t('meta.servicesTitle'),
  description: () => t('meta.servicesDescription')
})

const bunnyServices = computed(() => [
  { iconSrc: '/icons/bunny/magic-containers.svg', title: t('bunnyServices.magicContainers.title'), description: t('bunnyServices.magicContainers.description'), url: 'https://bunny.net/magic-containers/', highlights: ['Bare-metal', 'NVMe', 'AI Autoscale'] },
  { iconSrc: '/icons/bunny/cdn.svg', title: t('bunnyServices.cdn.title'), description: t('bunnyServices.cdn.description'), url: 'https://bunny.net/cdn/', highlights: ['100+ PoPs', 'Perma-Cache', 'Edge Rules'] },
  { iconSrc: '/icons/bunny/storage.svg', title: t('bunnyServices.storage.title'), description: t('bunnyServices.storage.description'), url: 'https://bunny.net/storage/', highlights: ['S3 API', 'Geo-replicated', 'unstorage'] },
  { iconSrc: '/icons/bunny/database.png', title: t('bunnyServices.database.title'), description: t('bunnyServices.database.description'), url: 'https://bunny.net/database/', highlights: ['SQLite', 'libSQL', 'Serverless'] },
  { iconSrc: '/icons/bunny/stream.svg', title: t('bunnyServices.stream.title'), description: t('bunnyServices.stream.description'), url: 'https://bunny.net/stream/', highlights: ['HLS/DASH', 'DRM', 'AI Captions'] },
  { iconSrc: '/icons/bunny/optimizer.svg', title: t('bunnyServices.optimizer.title'), description: t('bunnyServices.optimizer.description'), url: 'https://bunny.net/optimizer/', highlights: ['WebP/AVIF', 'Smart Crop', 'Bunny Fonts'] },
  { iconSrc: '/icons/bunny/shield.svg', title: t('bunnyServices.shield.title'), description: t('bunnyServices.shield.description'), url: 'https://bunny.net/shield/', highlights: ['WAF', 'DDoS', 'Bot Detection'] },
  { iconSrc: '/icons/bunny/dns.svg', title: t('bunnyServices.dns.title'), description: t('bunnyServices.dns.description'), url: 'https://bunny.net/dns/', highlights: ['GeoDNS', 'DNSSEC', 'Scriptable'] },
  { iconSrc: '/icons/bunny/edge-scripting.svg', title: t('bunnyServices.edgeScripting.title'), description: t('bunnyServices.edgeScripting.description'), url: 'https://bunny.net/edge-scripting/', highlights: ['Deno Runtime', '100+ Locations'] },
  { iconSrc: '/icons/bunny/fonts.svg', title: t('bunnyServices.fonts.title'), description: t('bunnyServices.fonts.description'), url: 'https://bunny.net/fonts/', highlights: ['GDPR', 'Privacy-first', '@nuxt/fonts'] }
])
</script>

<template>
  <div>
    <!-- ═══ Bunny Stream Demo ═══ -->
    <UPageSection
      :headline="t('stream.headline')"
      :title="t('stream.title')"
      :description="t('stream.description')"
    >
      <LazyBunnyStreamDemo />
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="t('bunnyServices.title')"
      :description="t('bunnyServices.description')"
    >
      <template #headline>
        <div class="flex flex-col items-center justify-center w-full">
          <a
            href="https://bunny.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              :src="colorMode.value === 'dark' ? '/icons/bunny/bunny.net_white.svg' : '/icons/bunny/bunny.net_green_vogue.svg'"
              alt="bunny.net"
              class="w-80 h-auto hover:opacity-80 transition-opacity"
            >
          </a>
        </div>
      </template>
      <UPageGrid>
        <UPageCard
          v-for="s in bunnyServices"
          :key="s.title"
          :title="s.title"
          :description="s.description"
          :to="s.url"
          target="_blank"
          spotlight
        >
          <template #leading>
            <img
              :src="s.iconSrc"
              :alt="s.title"
              class="w-8 h-8"
            >
          </template>
          <template #footer>
            <div class="flex flex-wrap gap-1.5">
              <UBadge
                v-for="h in s.highlights"
                :key="h"
                :label="h"
                size="xs"
                color="warning"
                variant="subtle"
              />
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="t('deploy.title')"
      :description="t('deploy.description')"
    >
      <template #headline>
        <div class="flex items-center justify-center w-full">
          <a
            href="https://bunny.net/magic-containers/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/bunny/magic-containers.svg"
              alt="Magic Containers"
              class="w-20 h-20 hover:opacity-80 transition-opacity"
            >
          </a>
        </div>
      </template>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <UPageCard
          variant="subtle"
          :ui="{ container: 'p-0 sm:p-0' }"
        >
          <div class="h-11 px-4 flex items-center gap-2 border-b border-(--ui-border)">
            <img
              src="/icons/docker.svg"
              alt="Docker"
              class="w-5 h-5"
            >
            <span class="mx-0.5 text-muted/40">+</span>
            <img
              src="/icons/bun.svg"
              alt="Bun"
              class="w-4 h-4"
            >
            <span class="text-sm font-mono text-muted">{{ t('deploy.dockerfile') }}</span>
          </div>
          <pre
            class="p-4 text-xs sm:text-sm font-mono text-muted overflow-x-auto max-w-full"
          ><code class="whitespace-pre-wrap break-all">{{ appConfig.deploy.dockerfileSnippet }}</code></pre>
        </UPageCard>

        <UPageCard
          variant="subtle"
          :ui="{ container: 'p-0 sm:p-0' }"
        >
          <div class="h-11 px-4 flex items-center gap-2 border-b border-(--ui-border)">
            <UIcon
              name="i-lucide-settings"
              class="w-4 h-4 text-[#FD8D32]"
            />
            <span class="text-sm font-mono text-muted">{{ t('deploy.envVars') }}</span>
          </div>
          <pre class="p-4 text-xs sm:text-sm font-mono text-muted overflow-x-auto max-w-full"><code class="whitespace-pre-wrap break-all">{{ appConfig.deploy.envVarsSnippet }}</code></pre>
        </UPageCard>
      </div>

      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
        <UPageCard
          v-for="(item, key) in {
            [t('deploy.nvmeStorage')]: t('deploy.ultraFast'),
            [t('deploy.isolation')]: t('deploy.fullVm'),
            [t('deploy.regions')]: t('deploy.regionsValue'),
            [t('deploy.scaling')]: t('deploy.aiAuto')
          }"
          :key="key"
          variant="subtle"
          :ui="{ container: 'text-center p-4 sm:p-4' }"
        >
          <div class="text-xl sm:text-2xl font-black text-[#FD8D32]">
            {{ item }}
          </div>
          <div class="text-xs text-muted mt-1">
            {{ key }}
          </div>
        </UPageCard>
      </div>
    </UPageSection>

    <USeparator />

    <!-- ═══ Code Snippets: Shield / DNS / Edge Scripting ═══ -->
    <UPageSection
      :headline="t('codeSnippets.headline')"
      :title="t('codeSnippets.title')"
      :description="t('codeSnippets.description')"
    >
      <BunnyCodeSnippets />
    </UPageSection>
  </div>
</template>
