<script setup lang="ts">
import type { Locale } from '#i18n'

const { t, locale, locales, setLocale } = useI18n()
const colorMode = useColorMode()
const localePath = useLocalePath()
const route = useRoute()
const appConfig = useAppConfig()

const color = computed(() => colorMode.value === 'dark' ? '#020420' : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/icon-512x512.png' }
  ],
  htmlAttrs: {
    lang: locale
  }
})

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.ogDescription'),
  twitterCard: 'summary_large_image'
})

const items = computed(() => [
  { label: t('nav.home'), icon: 'i-lucide-home', to: localePath('/') },
  { label: t('nav.demo'), icon: 'i-lucide-play', to: localePath('/demo') },
  { label: t('nav.services'), icon: 'i-lucide-cloud', to: localePath('/services') },
  { label: t('nav.ecosystem'), icon: 'i-lucide-puzzle', to: localePath('/ecosystem') },
  { label: t('nav.studio'), icon: 'i-lucide-pen-tool', to: localePath('/studio') }
])

const languageItems = computed(() =>
  [
    (locales.value as Array<{ code: string, name: string }>).map(l => ({
      label: l.name,
      disabled: l.code === locale.value,
      onSelect: () => setLocale(l.code as Locale)
    }))
  ]
)

const auraColor = computed(() =>
  route.path.includes('/services') ? 'orange' as const : 'primary' as const
)
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2"
        >
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu
          :items="items"
          variant="link"
          class="hidden lg:flex"
        />

        <UDropdownMenu :items="languageItems">
          <UButton
            icon="i-lucide-languages"
            color="neutral"
            variant="ghost"
            :aria-label="locale"
          />
        </UDropdownMenu>

        <UButton
          icon="i-simple-icons-github"
          :to="appConfig.github.url"
          target="_blank"
          color="neutral"
          variant="ghost"
          aria-label="GitHub"
        />

        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <div class="relative">
        <HeroBackground :color="auraColor" />
        <NuxtErrorBoundary>
          <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
          <template #error="{ error, clearError }">
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
              <UIcon
                name="i-lucide-alert-triangle"
                class="size-16 text-red-500"
              />
              <h2 class="text-2xl font-bold">
                {{ t('error.title', 'Something went wrong') }}
              </h2>
              <p class="text-muted max-w-md">
                {{ error?.message || t('error.description', 'An unexpected error occurred.') }}
              </p>
              <div class="flex gap-2">
                <UButton
                  :label="t('error.retry', 'Try Again')"
                  icon="i-lucide-refresh-cw"
                  color="primary"
                  @click="clearError(); navigateTo($route.path)"
                />
                <UButton
                  :label="t('error.home', 'Go Home')"
                  icon="i-lucide-home"
                  color="neutral"
                  variant="outline"
                  @click="clearError(); navigateTo(localePath('/'))"
                />
              </div>
            </div>
          </template>
        </NuxtErrorBoundary>
      </div>
    </UMain>

    <UFooter>
      <template #left>
        <span class="text-sm text-muted">
          {{ t('footer.builtWith') }}
          <span class="text-highlighted font-medium">Nuxt</span><span class="text-primary font-medium">Hub</span>
          ·
          {{ t('footer.deployedOn') }}
          <span class="text-highlighted font-medium">bunny</span><span class="text-[#FD8D32] font-medium">.net</span>
          ·
          {{ t('footer.publishedUnder') }}
          <UButton
            :label="t('footer.mitLicense')"
            :to="`${appConfig.github.url}/blob/main/LICENSE`"
            target="_blank"
            color="neutral"
            variant="link"
            size="sm"
            class="inline"
          />
        </span>
      </template>

      <template #right>
        <UButton
          label="NuxtHub"
          to="https://hub.nuxt.com"
          target="_blank"
          color="neutral"
          variant="link"
          size="sm"
        />
        <UButton
          label="bunny.net"
          to="https://bunny.net"
          target="_blank"
          color="neutral"
          variant="link"
          size="sm"
        />
        <UButton
          icon="i-simple-icons-github"
          :to="appConfig.github.url"
          target="_blank"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </UApp>
</template>
