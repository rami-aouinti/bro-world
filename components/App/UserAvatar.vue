<template>
  <v-avatar :color="color" :size="size"
            class="rounded-circle">
    <NuxtImg
      :alt="props.user?.username"
      :width="size + 2" :height="size + 2" :src="props.user?.profile?.photo ?? '/person.png'">
      >
    </NuxtImg>
  </v-avatar>
</template>

<script lang="ts" setup>
const props = defineProps({
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
