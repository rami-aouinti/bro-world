<template>
  <v-avatar :color="color" :size="size">
    <NuxtImg
      :alt="user?.username"
      :width="size" :height="size" v-if="user?.profile?.photo" :src="user?.profile?.photo ?? user?.avatar">
      ></NuxtImg>
    <NuxtImg :width="size" :height="size" :alt="user?.username" v-else>
      <span class="text-h6 white--text">
          {{ getInitials(user) }}
      </span>
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

const getInitials = (user) => {
  if (!user) return ''
  const first = user.firstName?.[0] || ''
  const last = user.lastName?.[0] || ''
  return (first + last).toUpperCase()
}
</script>
