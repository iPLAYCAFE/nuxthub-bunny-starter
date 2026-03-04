<script setup lang="ts">
const { t } = useI18n()

const wsUrl = computed(() => {
  if (import.meta.server) return ''
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/_ws`
})

const isConnected = ref(false)
const messages = ref<Array<{ type: string, from?: string, data?: string, message?: string, timestamp?: string }>>([])
const inputMessage = ref('')
let ws: WebSocket | null = null

function connect() {
  if (ws) return
  ws = new WebSocket(wsUrl.value)

  ws.onopen = () => {
    isConnected.value = true
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      messages.value.push(data)
    } catch {
      messages.value.push({ type: 'message', data: event.data })
    }
  }

  ws.onclose = () => {
    isConnected.value = false
    ws = null
  }
}

function disconnect() {
  ws?.close()
  ws = null
  isConnected.value = false
}

function sendMessage() {
  if (!ws || !inputMessage.value.trim()) return
  ws.send(inputMessage.value.trim())
  messages.value.push({
    type: 'self',
    data: inputMessage.value.trim(),
    timestamp: new Date().toISOString()
  })
  inputMessage.value = ''
}

onUnmounted(() => {
  ws?.close()
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <!-- Connection controls -->
    <UPageCard variant="subtle">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="relative flex h-3 w-3">
            <span
              v-if="isConnected"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            />
            <span
              class="relative inline-flex rounded-full h-3 w-3"
              :class="isConnected ? 'bg-green-500' : 'bg-zinc-400'"
            />
          </span>
          <span class="font-medium">
            {{ isConnected ? t('ws.connected') : t('ws.disconnected') }}
          </span>
        </div>
        <UButton
          v-if="!isConnected"
          :label="t('ws.connect')"
          icon="i-lucide-plug"
          color="primary"
          @click="connect"
        />
        <UButton
          v-else
          :label="t('ws.disconnect')"
          icon="i-lucide-unplug"
          color="neutral"
          variant="outline"
          @click="disconnect"
        />
      </div>
    </UPageCard>

    <!-- Message input (always visible to prevent layout shift) -->
    <div class="flex gap-2">
      <UInput
        v-model="inputMessage"
        :placeholder="isConnected ? t('ws.placeholder') : t('ws.disconnected')"
        class="flex-1"
        :disabled="!isConnected"
        @keyup.enter="sendMessage"
      />
      <UButton
        :label="t('ws.sendMessage')"
        icon="i-lucide-send"
        color="primary"
        :disabled="!isConnected || !inputMessage.trim()"
        @click="sendMessage"
      />
    </div>

    <!-- Messages -->
    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0' }"
    >
      <div class="h-10 px-4 flex items-center gap-2 border-b border-(--ui-border)">
        <UIcon
          name="i-lucide-messages-square"
          class="w-4 h-4 text-primary"
        />
        <span class="text-sm font-medium">{{ t('ws.messages') }}</span>
        <UBadge
          v-if="messages.length"
          :label="String(messages.length)"
          size="xs"
          color="primary"
          variant="subtle"
        />
      </div>
      <div class="max-h-64 overflow-y-auto">
        <div
          v-if="!messages.length"
          class="p-8 text-center text-muted text-sm"
        >
          {{ t('ws.noMessages') }}
        </div>
        <div
          v-else
          class="divide-y divide-(--ui-border)"
        >
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="px-4 py-2.5 text-sm flex items-start gap-3"
            :class="msg.type === 'self' ? 'bg-primary/5' : ''"
          >
            <UBadge
              :label="msg.type === 'self' ? t('ws.you') : msg.type === 'connected' || msg.type === 'disconnected' ? t('ws.system') : (msg.from?.slice(0, 6) || '?')"
              :color="msg.type === 'self' ? 'primary' : msg.type === 'connected' || msg.type === 'disconnected' ? 'warning' : 'neutral'"
              size="xs"
              variant="subtle"
              class="shrink-0 mt-0.5"
            />
            <span class="text-muted break-all">
              {{ msg.data || msg.message || JSON.stringify(msg) }}
            </span>
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
