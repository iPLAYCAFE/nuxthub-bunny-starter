<script setup lang="ts">
/**
 * Content component for ::studio-video{} MDC block syntax.
 *
 * Named "StudioVideo" (not "Video") to avoid collision with the native
 * HTML <video> tag in ContentRenderer's htmlTags set. If the component
 * were named "Video", ContentRenderer would resolve it as native HTML
 * instead of routing to this Vue component.
 */
defineProps<{
  src?: string
  controls?: boolean
  loop?: boolean
  playsinline?: boolean
  preload?: string
}>()
</script>

<template>
  <div class="w-full overflow-hidden rounded-xl my-8">
    <video
      :src="src"
      :controls="controls"
      :loop="loop"
      :playsinline="playsinline"
      :preload="preload || 'metadata'"
      class="w-full rounded-xl"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>
