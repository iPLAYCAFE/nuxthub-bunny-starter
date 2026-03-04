<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

interface PostsResponse {
  posts: { slug: string, title: string, content: string | null, createdAt: string }[]
  count: number
  total: number
  page: number
  limit: number
  totalPages: number
}

const { data, refresh, status } = useFetch<PostsResponse>('/api/hub/posts', { lazy: true })

// ── Create form ──
const postTitle = ref('')
const postContent = ref('')
const postSaving = ref(false)

// ── Inline edit ──
const editingPost = ref<string | null>(null)
const editTitle = ref('')
const editContent = ref('')
const editSaving = ref(false)

const loading = computed(() => status.value === 'pending')

defineExpose({
  data,
  loading,
  refresh,
  endpoint: 'GET /api/hub/posts'
})

async function createPost() {
  if (!postTitle.value) return
  postSaving.value = true
  try {
    await $fetch('/api/hub/posts', { method: 'POST', body: { title: postTitle.value, content: postContent.value } })
    toast.add({ title: t('liveDemo.postCreated'), color: 'success', icon: 'i-lucide-check' })
    postTitle.value = ''
    postContent.value = ''
    refresh()
  } catch {
    toast.add({ title: t('liveDemo.error'), color: 'error' })
  } finally {
    postSaving.value = false
  }
}

async function deletePost(slug: string) {
  try {
    await $fetch(`/api/hub/posts/${slug}`, { method: 'DELETE' })
    toast.add({ title: t('liveDemo.postDeleted'), color: 'success', icon: 'i-lucide-trash-2' })
    if (editingPost.value === slug) editingPost.value = null
    refresh()
  } catch { toast.add({ title: t('liveDemo.error'), color: 'error' }) }
}

function startEditPost(post: { slug: string, title: string, content: string | null }) {
  editingPost.value = post.slug
  editTitle.value = post.title
  editContent.value = post.content || ''
}

function cancelEditPost() {
  editingPost.value = null
  editTitle.value = ''
  editContent.value = ''
}

async function updatePost() {
  if (!editingPost.value || !editTitle.value.trim()) return
  editSaving.value = true
  try {
    await $fetch(`/api/hub/posts/${editingPost.value}`, {
      method: 'PUT',
      body: { title: editTitle.value, content: editContent.value }
    })
    toast.add({ title: t('liveDemo.postUpdated'), color: 'success', icon: 'i-lucide-check' })
    editingPost.value = null
    editTitle.value = ''
    editContent.value = ''
    refresh()
  } catch {
    toast.add({ title: t('liveDemo.error'), color: 'error' })
  } finally {
    editSaving.value = false
  }
}
</script>

<template>
  <div>
    <!-- Create form -->
    <div class="mb-4">
      <UPageCard variant="subtle">
        <div class="flex flex-col gap-2">
          <UInput
            v-model="postTitle"
            :placeholder="t('liveDemo.postTitlePlaceholder')"
          />
          <UTextarea
            v-model="postContent"
            :placeholder="t('liveDemo.postContentPlaceholder')"
            :rows="2"
          />
          <div class="flex justify-end">
            <UButton
              icon="i-lucide-plus"
              :label="t('liveDemo.createPost')"
              :loading="postSaving"
              :disabled="!postTitle"
              @click="createPost"
            />
          </div>
        </div>
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
      v-else-if="data?.posts?.length"
      class="space-y-2"
    >
      <div
        v-for="post in data.posts"
        :key="post.slug"
        class="p-3 rounded-lg bg-(--ui-bg-elevated)/50"
      >
        <!-- Edit mode -->
        <div
          v-if="editingPost === post.slug"
          class="space-y-2"
        >
          <UInput
            v-model="editTitle"
            :placeholder="t('liveDemo.postTitlePlaceholder')"
            size="sm"
          />
          <UTextarea
            v-model="editContent"
            :placeholder="t('liveDemo.postContentPlaceholder')"
            :rows="2"
            size="sm"
          />
          <div class="flex items-center justify-end gap-2">
            <UButton
              :label="t('liveDemo.cancel')"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="cancelEditPost"
            />
            <UButton
              icon="i-lucide-check"
              :label="t('liveDemo.updatePost')"
              :loading="editSaving"
              :disabled="!editTitle.trim()"
              size="xs"
              @click="updatePost"
            />
          </div>
        </div>
        <!-- Display mode -->
        <div
          v-else
          class="flex items-start gap-3"
        >
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">
              {{ post.title }}
            </div>
            <div
              v-if="post.content"
              class="text-xs text-muted mt-0.5 truncate"
            >
              {{ post.content }}
            </div>
            <div class="text-xs text-dimmed mt-1 font-mono">
              {{ post.slug }}
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="startEditPost(post)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="deletePost(post.slug)"
            />
          </div>
        </div>
      </div>
    </div>
    <pre
      v-else
      class="text-sm font-mono text-muted overflow-x-auto leading-relaxed"
    ><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
  </div>
</template>
