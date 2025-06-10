<template>
  <v-avatar :color="color" :width="size" :height="size">
    <NuxtImg
      :alt="user?.username"
      :width="size - 2" :height="size - 2" :src="user?.profile?.photo ?? '/person.png'">
      >
    </NuxtImg>
  </v-avatar>
</template>

<script lang="ts" setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: [String, Number],
    default: 40
  },
  color: {
    type: String,
    default: 'primary'
  }
})
</script>
