<script lang="ts" setup>

const props = defineProps({
  size: {
    type: [String, Number],
    default: 40
  },
  color: {
    type: String,
    default: 'primary'
  }
})

const { loggedIn, clear, user, pending } = useUserSession()
</script>
<template>
  <v-avatar :size="size"
            class="border-primary border-md rounded-circle">
    <NuxtImg
      :width="size"
      :height="size"
      :alt="user?.username"
      :src="user?.profile?.photo ?? '/person.png'"
      cover
    >
    </NuxtImg>
  </v-avatar>
</template>


