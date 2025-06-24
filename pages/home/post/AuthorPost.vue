<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";
import DeleteDialog from "~/components/DeleteDialog.vue";
import { mergeProps, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'

const props = defineProps<{
  post: {
    type: Object,
    required: true,
  },
}>()

const emit = defineEmits(['post-delete'])

const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useUserSession()
const router = useRouter()
const route = useRoute()

const isFollowing = ref<boolean | null>(null)
const loading = ref(false)
const deletePost = ref(false)

const handleEdit = async (id: string | number) => {
  try {
    const res = await $fetch(`/post/${id}`)
    console.log('Edit:', res)
  } catch (error) {
    console.error('Error editing post:', error)
  }
}

const checkFollowStatus = async (userId: string) => {
  loading.value = true
  try {
    const res = await $fetch(`/api/follow/status/${userId}`)
    isFollowing.value = res
  } catch (error) {
    console.error('Error checking follow status:', error)
  }
  loading.value = false
}

const toggleFollow = async (userId: string) => {
  if (!user.value) {
    return redirectToLogin()
  }

  loading.value = true
  try {
    await $fetch(`/api/follow/follow/${userId}`, {
      method: 'POST',
    })
    isFollowing.value = true
  } catch (error) {
    console.error('Error following:', error)
  }
  loading.value = false
}

const toggleUnFollow = async (userId: string) => {
  if (!user.value) {
    return redirectToLogin()
  }

  loading.value = true
  try {
    await $fetch(`/api/follow/unfollow/${userId}`, {
      method: 'POST',
    })
    isFollowing.value = false
  } catch (error) {
    console.error('Error unfollowing:', error)
  }
  loading.value = false
}

const redirectToLogin = () => {
  router.push({
    path: '/login',
    query: { redirect: route.fullPath }
  })
}

const handleDelete = (id: string | number) => {
  deletePost.value = true
}

watch(
  () => props.post.user?.id,
  () => {
    if (user.value && props.post.user?.id) {
      checkFollowStatus(props.post.user.id)
    }
  },
  { immediate: true }
)
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
        <UserAvatar :user="props.post?.user" color="primary" size="48" />
      </a>
      <div class="mx-4">
        <NuxtLink
          :to="props.post?.user?.username === user?.username
            ? localePath('/profile')
            : localePath(`/user/${props.post?.user?.username}`)"
          class="text-dark font-weight-600 text-sm text-decoration-none"
        >
          {{ props.post?.user?.firstName }} {{ props.user?.lastName }}
        </NuxtLink>
        <RelativeTime :date="props.post?.publishedAt" />
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
            <v-icon icon="mdi-dots-vertical" size="20" />
          </v-btn>
        </template>

        <v-list class="pa-2">
          <v-list-item>
            <v-icon
              size="small"
              icon="mdi-pencil"
              color="warning"
              @click="handleEdit(props.post.id)"
            />
          </v-list-item>
          <v-list-item>
            <v-icon
              size="small"
              color="error"
              @click="handleDelete(props.post.id)"
            >
              mdi-delete
            </v-icon>
          </v-list-item>
        </v-list>
      </v-menu>

      <DeleteDialog
        @deleted="emit('post-delete')"
        :model-value="deletePost"
        delete-url="/api/posts/post/delete"
        :item-id="props.post.id"
      />
    </div>
  </div>
</template>
