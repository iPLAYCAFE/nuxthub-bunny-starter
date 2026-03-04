<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.studioTitle'),
  description: () => t('meta.studioDescription')
})

// Enable Nuxt Studio floating edit button on this content page
useHead({
  bodyAttrs: { class: 'show-studio-edit' }
})

// Detect Studio login via the studio-session-check cookie
// This cookie is set by nuxt-studio when a valid session exists
// and deleted when the session is empty
const studioSessionCheck = useCookie('studio-session-check')
const isStudioLoggedIn = computed(() => !!studioSessionCheck.value)
</script>

<template>
  <div>
    <UPageSection>
      <div class="flex flex-col items-center text-center gap-4">
        <UBadge
          label="Self-hosted & Open Source"
          icon="i-lucide-shield-check"
          variant="subtle"
          size="lg"
        />
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
          {{ t('studio.heroTitle') }}
        </h1>
        <p class="text-lg text-muted max-w-2xl">
          {{ t('studio.heroDescription') }}
        </p>

        <!-- Before login: show "Try editing this page" button -->
        <div
          v-if="!isStudioLoggedIn"
          class="flex gap-3 pt-2"
        >
          <UButton
            :label="t('studio.tryEditingThisPage')"
            to="/_studio"
            external
            size="lg"
            icon="i-lucide-pen-line"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>

        <!-- After login: guide user to the floating edit button -->
        <UPageCard
          v-else
          variant="subtle"
          class="mt-2 max-w-lg"
        >
          <div class="flex items-center gap-3">
            <UIcon
              name="i-lucide-check-circle"
              class="w-6 h-6 text-green-500 shrink-0"
            />
            <div class="text-left">
              <p class="font-semibold">
                {{ t('studio.loggedIn') }}
              </p>
              <p class="text-sm text-muted">
                {{ t('studio.floatingButtonHint') }}
              </p>
            </div>
          </div>
        </UPageCard>
      </div>
    </UPageSection>

    <!-- Content from studio.md -->
    <UPageSection>
      <ContentStudio />
    </UPageSection>
  </div>
</template>
