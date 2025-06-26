<script setup lang="ts">
const props = defineProps<{ topic: any }>()
</script>

<template>
  <NuxtLink v-if="props.topic" :to="props.topic.url">
    <div
      class="flex justify-center pb-12 mb-10 min-h-content mr-5"
      :class="{
        'hover:border-green-700 hover:dark:border-green-700': props.topic.accentColor === 'green',
        'hover:border-red-700 hover:dark:border-red-700': props.topic.accentColor === 'red',
        'hover:border-indigo-700 hover:dark:border-indigo-700': props.topic.accentColor === 'indigo'
      }"
    >
      <NuxtImg
        v-if="props.topic.image && props.topic.image !== '/img/nuxt3.svg'"
        :src="props.topic.image"
        alt="Topic image"
        width="400"
        height="200"
      />

      <div
        tabindex="0"
        class="focus:outline-none text-xl font-medium leading-5 text-gray-800 dark:text-white"
      >
        <div v-if="props.topic.showName" class="mt-5">
          {{ props.topic.displayName }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
