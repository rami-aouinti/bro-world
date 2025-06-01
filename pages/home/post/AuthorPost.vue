<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";

const props = defineProps<{
  author: {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    avatar: string
  },
  date: string
}>()

const isFollowing = ref<boolean | null>(null)

async function checkFollowStatus(authorId: string) {
  if (authorId) {
    const { data, error } = await useFetch(`/api/follow/status/${authorId}`)
    if (!error.value) {
      isFollowing.value = data.value
    }
  }
}

async function toggleFollow(authorId: string) {
  const { error } = await useFetch(`/api/follow/follow/${authorId}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

async function toggleUnFollow(authorId: string) {
  const { error } = await useFetch(`/api/follow/unfollow/${authorId}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

watch(props.author?.id, () => {
  checkFollowStatus(props.author?.id)
}, { immediate: true })

onMounted(async () => {
  await checkFollowStatus(props.author?.id)
})
</script>

<template>
  <div class="border-bottom d-flex align-center px-4 py-4">
    <div class="d-flex align-center">
      <a href="javascript:" class="text-decoration-none">
        <UserAvatar :user="author" color="primary" size="48"></UserAvatar>
      </a>
      <div class="mx-4">
        <NuxtLink
          :to="`/${author?.username}`"
          class="text-dark font-weight-600 text-sm text-decoration-none"
        >
          {{ author?.firstName }} {{ author?.lastName }}
        </NuxtLink>
        <RelativeTime :date="date"></RelativeTime>
      </div>
    </div>
    <div class="text-end ms-auto" v-if="isFollowing === false">
      <v-btn
        icon
        variant="text"
        size="small"
        class="text-primary"
        @click="toggleFollow(author?.id)"
      >
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </div>
    <div class="text-end ms-auto" v-if="isFollowing === true">
      <v-btn
        icon
        variant="text"
        size="small"
        class="text-primary"
        @click="toggleUnFollow(author?.id)"
      >
        <v-icon>mdi-account-minus</v-icon>
      </v-btn>
    </div>
  </div>
</template>
