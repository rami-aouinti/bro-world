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

const { user } = useUserSession()
const router = useRouter()
const route = useRoute()

const isFollowing = ref<boolean | null>(null)

async function checkFollowStatus(authorId: string) {
  if (user.value && authorId) {
    const { data, error } = await useFetch(`/api/follow/status/${authorId}`)
    if (!error.value) {
      isFollowing.value = data.value
    }
  }
}

function redirectToLogin() {
  router.push({
    path: '/login',
    query: {
      redirect: route.fullPath
    }
  })
}

async function toggleFollow(authorId: string) {
  if (!user.value) {
    return redirectToLogin()
  }

  const { error } = await useFetch(`/api/follow/follow/${authorId}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

async function toggleUnFollow(authorId: string) {
  if (!user.value) {
    return redirectToLogin()
  }

  const { error } = await useFetch(`/api/follow/unfollow/${authorId}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = false
  }
}

watch(
  () => props.author?.id,
  () => {
    if (user.value) {
      checkFollowStatus(props.author?.id)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (user.value) {
    await checkFollowStatus(props.author?.id)
  }
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
          :to="`/profile/${author?.username}`"
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
