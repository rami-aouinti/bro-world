<template>
  <div>
    <h4
      class="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 px-3 flex items-center gap-3 justify-center"
    >
      <v-icon v-if="icon" :icon="icon" class="text-gray-400" />
      {{ title }}
    </h4>

    <div class="mt-4">
      <slot />
    </div>

    <p
      v-if="description"
      class="mt-6 text-base text-gray-600 dark:text-gray-400 px-3 text-center"
      v-html="description"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>
