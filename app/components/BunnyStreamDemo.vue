<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()

const libraryId = computed(() => config.public.bunnyStreamLibraryId as string)
const videoId = computed(() => config.public.bunnyStreamVideoId as string)
const hasConfig = computed(() => !!libraryId.value && !!videoId.value)

// Player controls
const autoplay = ref(false)
const loop = ref(false)
const muted = ref(false)
const preload = ref(false)
const showSpeed = ref(false)
const responsive = ref(false)

const embedUrl = computed(() => {
  if (!hasConfig.value) return ''
  const params = new URLSearchParams()
  // Always pass autoplay explicitly to override the dashboard default
  params.set('autoplay', autoplay.value ? 'true' : 'false')
  if (loop.value) params.set('loop', 'true')
  if (muted.value) params.set('muted', 'true')
  if (preload.value) params.set('preload', 'true')
  if (showSpeed.value) params.set('showSpeed', 'true')
  if (responsive.value) params.set('responsive', 'true')
  const qs = params.toString()
  return `https://player.mediadelivery.net/embed/${libraryId.value}/${videoId.value}${qs ? `?${qs}` : ''}`
})

const features = computed(() => [
  { icon: 'i-lucide-play-circle', label: t('stream.feat_adaptive'), desc: t('stream.feat_adaptive_desc') },
  { icon: 'i-lucide-shield-check', label: t('stream.feat_drm'), desc: t('stream.feat_drm_desc') },
  { icon: 'i-lucide-captions', label: t('stream.feat_captions'), desc: t('stream.feat_captions_desc') },
  { icon: 'i-lucide-monitor', label: t('stream.feat_4k'), desc: t('stream.feat_4k_desc') },
  { icon: 'i-lucide-palette', label: t('stream.feat_player'), desc: t('stream.feat_player_desc') },
  { icon: 'i-lucide-globe', label: t('stream.feat_cdn'), desc: t('stream.feat_cdn_desc') }
])

const controls = computed(() => [
  { key: 'autoplay', model: autoplay, label: t('stream.autoplay'), icon: 'i-lucide-play' },
  { key: 'loop', model: loop, label: t('stream.loop'), icon: 'i-lucide-repeat' },
  { key: 'muted', model: muted, label: t('stream.muted'), icon: 'i-lucide-volume-x' },
  { key: 'preload', model: preload, label: t('stream.preload'), icon: 'i-lucide-download' },
  { key: 'showSpeed', model: showSpeed, label: t('stream.speed'), icon: 'i-lucide-gauge' },
  { key: 'responsive', model: responsive, label: 'Responsive', icon: 'i-lucide-maximize' }
])
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Video player -->
    <div
      v-if="hasConfig"
      class="space-y-4"
    >
      <!-- Responsive 16:9 iframe container -->
      <UPageCard
        variant="subtle"
        :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
      >
        <div
          class="relative w-full"
          style="padding-top: 56.25%"
        >
          <iframe
            :src="embedUrl"
            loading="lazy"
            style="border: 0; position: absolute; top: 0; height: 100%; width: 100%"
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowfullscreen="true"
          />
        </div>
      </UPageCard>

      <!-- Player controls -->
      <UPageCard variant="subtle">
        <div class="flex flex-wrap gap-3 justify-center">
          <UButton
            v-for="ctrl in controls"
            :key="ctrl.key"
            :icon="ctrl.icon"
            :label="ctrl.label"
            :color="ctrl.model.value ? 'primary' : 'neutral'"
            :variant="ctrl.model.value ? 'subtle' : 'ghost'"
            size="xs"
            @click="ctrl.model.value = !ctrl.model.value"
          />
        </div>
        <p class="text-xs text-dimmed mt-3 text-center font-mono break-all">
          {{ embedUrl }}
        </p>
      </UPageCard>
    </div>

    <!-- Fallback: no config -->
    <UPageCard
      v-else
      variant="subtle"
    >
      <div class="text-center py-6 space-y-3">
        <UIcon
          name="i-lucide-video"
          class="w-12 h-12 text-muted mx-auto"
        />
        <div class="text-sm text-muted">
          {{ t('stream.noConfig') }}
        </div>
        <pre class="text-xs font-mono text-dimmed bg-(--ui-bg-elevated)/50 rounded-lg p-3 inline-block text-left"><code>NUXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID=your-library-id
NUXT_PUBLIC_BUNNY_STREAM_VIDEO_ID=your-video-id</code></pre>
      </div>
    </UPageCard>

    <!-- Feature highlights -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      <div
        v-for="f in features"
        :key="f.label"
        class="flex items-start gap-2 p-3 rounded-lg bg-(--ui-bg-elevated)/30"
      >
        <UIcon
          :name="f.icon"
          class="w-4 h-4 text-primary shrink-0 mt-0.5"
        />
        <div>
          <div class="text-xs font-medium">
            {{ f.label }}
          </div>
          <div class="text-xs text-dimmed">
            {{ f.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
