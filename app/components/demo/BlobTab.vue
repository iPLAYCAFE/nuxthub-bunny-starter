<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

interface FilesResponse {
  files: { pathname: string, size: number, contentType: string }[]
  total: number
}

const { data, refresh, status } = useFetch<FilesResponse>('/api/hub/files', { lazy: true })

const uploadFile = ref<File | null>(null)
const uploading = ref(false)

const loading = computed(() => status.value === 'pending')

defineExpose({
  data,
  loading,
  refresh,
  endpoint: 'GET /api/hub/files'
})

async function uploadBlob() {
  if (!uploadFile.value) return
  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', uploadFile.value)
    await $fetch('/api/hub/upload', { method: 'POST', body: form })
    toast.add({ title: t('liveDemo.fileUploaded'), color: 'success', icon: 'i-lucide-check' })
    uploadFile.value = null
    refresh()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    toast.add({ title: e?.data?.message || t('liveDemo.error'), color: 'error' })
  } finally {
    uploading.value = false
  }
}

async function deleteFile(pathname: string) {
  try {
    // @ts-expect-error — Nuxt typed routes don't resolve DELETE for template-literal catch-all paths
    await $fetch(`/api/hub/files/${pathname}`, { method: 'DELETE' })
    toast.add({ title: t('liveDemo.fileDeleted'), color: 'success', icon: 'i-lucide-trash-2' })
    refresh()
  } catch { toast.add({ title: t('liveDemo.error'), color: 'error' }) }
}

function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.size > 2 * 1024 * 1024) {
    toast.add({ title: t('liveDemo.fileTooLarge'), color: 'error' })
    target.value = ''
    return
  }
  uploadFile.value = file || null
  // Reset input so re-selecting the same file triggers change event
  target.value = ''
}

function isPreviewable(pathname: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(pathname)
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}
</script>

<template>
  <div>
    <!-- Upload form -->
    <div class="mb-4">
      <UPageCard variant="subtle">
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
            <UIcon
              name="i-lucide-upload"
              class="text-primary w-5 h-5 shrink-0"
            />
            <span class="text-sm text-muted truncate">{{ uploadFile?.name || t('liveDemo.selectFile') }}</span>
            <input
              type="file"
              class="hidden"
              accept="image/*,.txt,.csv,.md,.pdf,.json"
              @change="onFileSelect"
            >
          </label>
          <UButton
            v-if="uploadFile"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="uploadFile = null"
          />
          <UButton
            icon="i-lucide-cloud-upload"
            :label="t('liveDemo.upload')"
            :loading="uploading"
            :disabled="!uploadFile"
            @click="uploadBlob"
          />
        </div>
        <p class="text-xs text-dimmed mt-2">
          {{ t('liveDemo.uploadHint') }}
        </p>
      </UPageCard>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-8 text-muted"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-5 h-5 animate-spin mr-2"
      />
      <span class="text-sm">{{ t('liveDemo.fetching') }}</span>
    </div>

    <!-- Response display -->
    <div
      v-else-if="data?.files?.length"
      class="space-y-2"
    >
      <div
        v-for="file in data.files"
        :key="file.pathname"
        class="flex items-center gap-3 p-3 rounded-lg bg-(--ui-bg-elevated)/50"
      >
        <!-- Image thumbnail preview -->
        <div
          v-if="isPreviewable(file.pathname)"
          class="w-10 h-10 rounded overflow-hidden shrink-0 bg-(--ui-bg-elevated)"
        >
          <img
            :src="`/api/hub/files/${file.pathname}`"
            :alt="file.pathname"
            class="w-full h-full object-cover"
            loading="lazy"
          >
        </div>
        <UIcon
          v-else
          name="i-lucide-file"
          class="w-4 h-4 text-muted shrink-0"
        />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-mono truncate">
            {{ file.pathname }}
          </div>
          <div class="text-xs text-dimmed">
            {{ formatSize(file.size) }}
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <a
            :href="`/api/hub/files/${file.pathname}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UButton
              icon="i-lucide-external-link"
              color="neutral"
              variant="ghost"
              size="xs"
            />
          </a>
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="xs"
            @click="deleteFile(file.pathname)"
          />
        </div>
      </div>
    </div>
    <pre
      v-else
      class="text-sm font-mono text-muted overflow-x-auto leading-relaxed"
    ><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
  </div>
</template>
