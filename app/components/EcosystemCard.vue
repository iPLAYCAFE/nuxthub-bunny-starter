<script setup lang="ts">
defineProps<{
  name: string
  icon: string
  description: string
  url?: string
  highlights?: string[]
}>()
</script>

<template>
  <UPageCard
    :icon="icon"
    :title="name"
    :description="description"
    :to="url"
    :target="url ? '_blank' : undefined"
    spotlight
  >
    <template
      v-if="highlights?.length"
      #footer
    >
      <div class="flex flex-wrap gap-1.5">
        <UBadge
          v-for="h in highlights"
          :key="h"
          :label="h"
          size="xs"
          color="neutral"
          variant="subtle"
        />
      </div>
    </template>
  </UPageCard>
</template>
