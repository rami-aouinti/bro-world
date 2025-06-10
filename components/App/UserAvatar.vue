<template>
  <v-avatar :size="size"
            class="border-primary border-md rounded-circle">
    <NuxtImg
      :width="size"
      :height="size"
      :alt="props.user?.username"
      :src="props.user?.profile?.photo ?? '/person.png'"
      cover
    >
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
