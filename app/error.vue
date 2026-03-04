<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const statusCode = computed(() => props.error.statusCode)
const title = computed(() => {
  if (statusCode.value === 404) return t('error.notFound', 'Page Not Found')
  if (statusCode.value === 403) return t('error.forbidden', 'Access Denied')
  return t('error.title', 'Something went wrong')
})
const description = computed(() => {
  if (statusCode.value === 404) return t('error.notFoundDesc', 'The page you are looking for does not exist.')
  return props.error.message || t('error.description', 'An unexpected error occurred.')
})

const handleClearError = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-8 text-center">
      <div class="text-8xl font-bold text-muted opacity-20">
        {{ statusCode }}
      </div>
      <UIcon
        :name="statusCode === 404 ? 'i-lucide-search-x' : 'i-lucide-alert-triangle'"
        class="size-16 text-red-500"
      />
      <h1 class="text-3xl font-bold">
        {{ title }}
      </h1>
      <p class="text-muted max-w-md text-lg">
        {{ description }}
      </p>
      <div class="flex gap-3 mt-4">
        <UButton
          :label="t('error.home', 'Go Home')"
          icon="i-lucide-home"
          color="primary"
          size="lg"
          @click="handleClearError"
        />
        <UButton
          :label="t('error.retry', 'Try Again')"
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="lg"
          @click="clearError()"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
