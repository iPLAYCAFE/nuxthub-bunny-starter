<script setup lang="ts">
const { t } = useI18n()
const { loggedIn, user, clear: logout } = useUserSession()
const { data: providers } = await useFetch('/api/auth/providers')
const githubOAuthEnabled = computed(() => providers.value?.github ?? false)
const protectedResponse = ref<Record<string, unknown> | null>(null)
const protectedLoading = ref(false)
const authRedirectCookie = useCookie('auth-redirect')

function loginWithGitHub() {
  authRedirectCookie.value = useRoute().fullPath
  navigateTo('/auth/github', { external: true })
}

async function testProtectedEndpoint() {
  protectedLoading.value = true
  protectedResponse.value = null
  try {
    const data = await $fetch('/api/auth/session')
    protectedResponse.value = data
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }, message?: string }
    protectedResponse.value = { error: e.data?.message || e.message || 'Unauthorized' }
  } finally {
    protectedLoading.value = false
  }
}

const securityFeatures = computed(() => [
  { icon: 'i-simple-icons-github', title: t('auth.feat_oauth'), desc: t('auth.feat_oauth_desc') },
  { icon: 'i-lucide-lock', title: t('auth.feat_session'), desc: t('auth.feat_session_desc') },
  { icon: 'i-lucide-shield-check', title: t('auth.feat_csrf'), desc: t('auth.feat_csrf_desc') },
  { icon: 'i-lucide-timer', title: t('auth.feat_rateLimit'), desc: t('auth.feat_rateLimit_desc') }
])
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Session Status Card -->
      <UPageCard
        variant="subtle"
        :ui="{ container: 'p-6 sm:p-6' }"
        class="min-w-0"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-3 h-3 rounded-full shrink-0"
            :class="loggedIn ? 'bg-green-500 animate-pulse' : 'bg-muted'"
          />
          <h3 class="font-bold text-lg">
            {{ t('auth.sessionStatus') }}
          </h3>
          <UBadge
            :label="loggedIn ? t('auth.loggedIn') : t('auth.notLoggedIn')"
            :color="loggedIn ? 'success' : 'neutral'"
            variant="subtle"
            size="xs"
          />
        </div>

        <!-- Logged In State -->
        <div
          v-if="loggedIn && user"
          class="space-y-4 min-w-0"
        >
          <div class="flex items-center gap-3 min-w-0">
            <img
              v-if="user.avatarUrl"
              :src="user.avatarUrl"
              :alt="user.name || user.id || 'User'"
              class="w-10 h-10 rounded-full shrink-0 bg-gray-700"
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
            >
            <div
              v-else
              class="w-10 h-10 rounded-full shrink-0 bg-primary/20 flex items-center justify-center"
            >
              <span class="text-sm font-bold text-primary">{{ (user.name ?? user.id ?? 'U')[0]!.toUpperCase() }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-semibold truncate">
                {{ t('auth.welcomeBack') }} {{ user.name || user.id }}
              </div>
              <div
                v-if="user.email"
                class="text-xs text-muted truncate"
              >
                {{ t('auth.email') }}: {{ user.email }}
              </div>
            </div>
          </div>

          <!-- Session JSON preview -->
          <div class="bg-(--ui-bg-muted) rounded-lg p-3 overflow-hidden">
            <pre class="text-xs font-mono text-muted whitespace-pre-wrap break-all"><code>{{ JSON.stringify({ user, loggedIn }, null, 2) }}</code></pre>
          </div>

          <UButton
            :label="t('auth.logout')"
            icon="i-lucide-log-out"
            color="neutral"
            variant="outline"
            block
            @click="logout()"
          />
        </div>

        <!-- Logged Out State -->
        <div
          v-else
          class="space-y-4"
        >
          <p class="text-sm text-muted">
            {{ t('auth.guestMessage') }}
          </p>

          <UButton
            :label="t('auth.loginGitHub')"
            icon="i-simple-icons-github"
            color="neutral"
            size="lg"
            block
            :disabled="!githubOAuthEnabled"
            @click="loginWithGitHub"
          />
          <div
            v-if="!githubOAuthEnabled"
            class="bg-(--ui-bg-muted) rounded-lg p-3"
          >
            <p class="text-xs text-muted">
              <UIcon
                name="i-lucide-info"
                class="w-3.5 h-3.5 inline-block mr-1"
              />
              {{ t('auth.oauthHint') }}
            </p>
          </div>
        </div>
      </UPageCard>

      <!-- Protected API Test Card -->
      <UPageCard
        variant="subtle"
        :ui="{ container: 'p-6 sm:p-6' }"
        class="min-w-0"
      >
        <div class="flex items-center gap-3 mb-6">
          <UIcon
            name="i-lucide-shield"
            class="w-5 h-5 text-primary"
          />
          <h3 class="font-bold text-lg">
            {{ t('auth.protectedApi') }}
          </h3>
        </div>

        <p class="text-sm text-muted mb-4">
          {{ t('auth.protectedApiDesc') }}
        </p>

        <UButton
          :label="t('auth.testProtected')"
          icon="i-lucide-play"
          color="primary"
          variant="subtle"
          block
          :loading="protectedLoading"
          @click="testProtectedEndpoint"
        />

        <div
          v-if="protectedResponse"
          class="mt-4 min-w-0"
        >
          <div class="text-xs font-mono text-muted mb-1">
            {{ t('auth.responseLabel') }}:
          </div>
          <div class="bg-(--ui-bg-muted) rounded-lg p-3 overflow-hidden">
            <pre
              class="text-xs font-mono whitespace-pre-wrap break-all"
              :class="protectedResponse.error ? 'text-red-400' : 'text-muted'"
            ><code>{{ JSON.stringify(protectedResponse, null, 2) }}</code></pre>
          </div>
        </div>
      </UPageCard>
    </div>

    <!-- Security Features Grid -->
    <div class="mt-8">
      <h3 class="text-sm font-bold text-muted mb-4 text-center">
        {{ t('auth.features') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <UPageCard
          v-for="f in securityFeatures"
          :key="f.title"
          variant="subtle"
          :ui="{ container: 'text-center p-4 sm:p-4' }"
        >
          <UIcon
            :name="f.icon"
            class="w-6 h-6 text-primary mx-auto mb-2"
          />
          <div class="font-bold text-sm">
            {{ f.title }}
          </div>
          <div class="text-xs text-muted mt-1">
            {{ f.desc }}
          </div>
        </UPageCard>
      </div>
    </div>
  </div>
</template>
