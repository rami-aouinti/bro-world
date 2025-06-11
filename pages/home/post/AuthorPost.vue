<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";
import { mergeProps, defineProps } from 'vue'

const props = defineProps<{
  post: {
    type: Object,
    required: true,
  },
}>();

const { user } = useUserSession()
const router = useRouter()
const route = useRoute()
const isFollowing = ref<boolean | null>(null)
const loading = ref(false)

const handleEdit = async (id: string | number) => {
  const res = await useFetch(`post/${id}`)
  console.log('Edit:', res)
}

const handleDelete = async (id: string | number) => {
  await useFetch(`post/${id}`, { method: 'DELETE' })
}


async function checkFollowStatus(userId: string) {
  loading.value = true
  if (user.value && userId) {
    const { data, error } = await useFetch(`/api/follow/status/${userId}`)
    if (!error.value) {
      isFollowing.value = data.value
    }
  }
  loading.value = false
}

function redirectToLogin() {
  router.push({
    path: '/login',
    query: {
      redirect: route.fullPath
    }
  })
}

async function toggleFollow(userId: string) {
  loading.value = true
  if (!user.value) {
    return redirectToLogin()
  }

  const { error } = await useFetch(`/api/follow/follow/${userId}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
  loading.value = false
}

async function toggleUnFollow(userId: string) {
  loading.value = true
  if (!user.value) {
    return redirectToLogin()
  }

  const { error } = await useFetch(`/api/follow/unfollow/${userId}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = false
  }
  loading.value = false
}

watch(
  () => props.post.user?.id,
  () => {
    if (user.value) {
      checkFollowStatus(props.post.user?.id)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (user.value) {
    await checkFollowStatus(props.post.user?.id)
  }
})
</script>



<template>
  <div class="d-flex align-center px-4 py-4">
    <div class="d-flex align-center">
      <a
        :href="props.post?.user?.username === user?.username
    ? '/profile'
    : `/user/${props.post?.user?.username}`"
        class="text-decoration-none"
      >
        <UserAvatar :user="props.post?.user" color="primary" size="48"></UserAvatar>
      </a>
      <div class="mx-4">
        <NuxtLink
          :to="props.post?.user?.username === user?.username
    ? '/profile'
    : `/user/${props.post?.user?.username}`"
          class="text-dark font-weight-600 text-sm text-decoration-none"
        >
          {{ props.post?.user?.firstName }} {{ props.user?.lastName }}
        </NuxtLink>
        <RelativeTime :date="props.post?.publishedAt"></RelativeTime>
      </div>
    </div>
    <div class="text-end ms-auto" v-if="isFollowing === false && props.post.user?.id !== user?.id">
      <v-btn
        icon
        :loading="loading"
        variant="text"
        size="small"
        class="text-primary"
        @click="toggleFollow(props.post.user?.id)"
      >
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </div>
    <div class="text-end ms-auto" v-if="isFollowing === true && props.post.user?.id !== user?.id">
      <v-btn
        icon
        :loading="loading"
        variant="text"
        size="small"
        class="text-primary"
        @click="toggleUnFollow(props.post.user?.id)"
      >
        <v-icon>mdi-account-minus</v-icon>
      </v-btn>
    </div>
    <div class="text-end ms-auto" v-if="props.post.user?.id === user?.id">
      <v-menu location="bottom" max-width="68">
        <template #activator="{ props: menu }">
          <v-btn
            icon
            variant="text"
            size="small"
            class="text-primary"
            v-bind="mergeProps(menu)"
          >
            <v-icon icon="mdi-menu" size="20" />
          </v-btn>
        </template>

        <v-list class="pa-2">

          <v-list-item>
            <v-btn icon="mdi-pencil" variant="text" color="warning" @click="handleEdit(props.post.id)" />

          </v-list-item>
          <v-list-item>
            <v-btn icon="mdi-delete" variant="text" color="error" @click="handleDelete(props.post.id)" />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>
