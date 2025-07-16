<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import UserAvatar from '~/components/App/UserAvatar.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'
import DeleteDialog from '~/components/DeleteDialog.vue'
import BaseDialog from '~/components/BaseDialog.vue'

const props = defineProps<{
  post: any
}>()

const emit = defineEmits(['post-delete', 'post-updated'])

const { user } = await useUserSession()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const isFollowing = ref<boolean | null>(null)
const loading = ref(true)
const deleteDialog = ref(false)
const editDialog = ref(false)

const postContent = ref('')
const youtubeId = ref<string | null>(null)
const imageUrl = ref<string | null>(null)
const files = ref<File[]>([])

// --- Watch follow status
watch(
  () => props.post.user?.id,
  () => {
    if (user.value && props.post.user?.id) checkFollowStatus(props.post.user.id)
  },
  { immediate: true }
)

// --- Link preview
function detectLinks() {
  if (youtubeId.value || imageUrl.value) return
  const ytMatch = postContent.value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/)
  const imgMatch = postContent.value.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/)
  if (ytMatch) youtubeId.value = ytMatch[1], postContent.value = ''
  else if (imgMatch) imageUrl.value = imgMatch[1], postContent.value = ''
}

const clearPreview = () => {
  youtubeId.value = null
  imageUrl.value = null
}

const formPayload = computed(() => {
  const payload: Record<string, any> = {}
  if (youtubeId.value) payload.url = `https://www.youtube.com/watch?v=${youtubeId.value}`
  else if (imageUrl.value) payload.url = imageUrl.value
  if (postContent.value.trim()) payload.title = postContent.value.trim()
  return payload
})

// --- Follow actions
const checkFollowStatus = async (userId: string) => {
  try {
    const friend = user.value.friends?.find((f: any) => f.user === userId)
    if (friend) {
      isFollowing.value = friend.status === 1 || friend.status === 3
    } else {
      isFollowing.value = false
    }
  } catch (error) {
    console.error('Error checking follow status:', error)
  } finally {
    loading.value = false
  }
}

const toggleFollow = async (userId: string, follow = true) => {
  if (!user.value) return redirectToLogin()
  loading.value = true
  try {
    await $fetch(`/api/follow/${follow ? 'follow' : 'unfollow'}/${userId}`, { method: 'POST' })
    isFollowing.value = follow
  } catch (error) {
    console.error('Error follow toggle:', error)
  } finally {
    loading.value = false
  }
}

const redirectToLogin = () => {
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

// --- Post actions
const handleEdit = () => {
  postContent.value = props.post.title
  editDialog.value = true
}

const handleSuccess = (data: any) => {
  postContent.value = ''
  clearPreview()
  Notify.success('Post updated!', user.photo ?? '', `/post/${data.slug}`)
  emit('post-updated', data)
}

const handleSuccessDelete = () => {
  Notify.success("Post updated!", user.photo ?? "https://bro-world-space.com", "/post/" + props.post.slug)
  emit('post-delete', props.post.id)
}

const handleError = (e: any) => {
  Notify.error('Operation failed')
  console.error(e)
}
</script>
<template>
  <div class="d-flex align-center px-4 py-4">
    <!-- User Info -->
    <div class="d-flex align-center">
      <NuxtLink :to="props.post?.user?.username === user?.username ? '/profile' : `/user/${props.post.user?.username}`">
        <UserAvatar :user="props.post.user" size="48" color="primary" />
      </NuxtLink>
      <div class="mx-4">
        <NuxtLink
          :to="props.post?.user?.username === user?.username ? localePath('/profile') : localePath(`/user/${props.post.user?.username}`)"
          class="text-dark font-weight-600 text-sm text-decoration-none"
        >
          {{ props.post.user?.firstName }} {{ props.post.user?.lastName }}
        </NuxtLink>
        <RelativeTime :date="props.post.publishedAt" />
      </div>
    </div>

    <!-- Follow / Edit / Delete -->
    <div class="ms-auto d-flex align-center">
      <v-btn
        v-if="props.post.user?.id !== user?.id && isFollowing === false"
        icon :loading="loading"
        variant="text"
        size="small"
        class="text-primary"
        @click="toggleFollow(props.post.user?.id, true)"
      >
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>

      <v-btn
        v-if="props.post.user?.id !== user?.id && isFollowing === true"
        icon :loading="loading"
        variant="text"
        size="small"
        class="text-primary"
        @click="toggleFollow(props.post.user?.id, false)"
      >
        <v-icon>mdi-account-minus</v-icon>
      </v-btn>

      <v-menu v-if="props.post.user?.id === user?.id" location="bottom">
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" class="text-primary" v-bind="props">
            <v-icon size="20">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-icon size="small" color="warning" @click="handleEdit">mdi-pencil</v-icon>
          </v-list-item>
          <v-list-item>
            <v-icon size="small" color="error" @click="deleteDialog = true">mdi-delete</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- Edit Dialog -->
    <BaseDialog
      v-model="editDialog"
      title="Edit Post"
      color="primary"
      :closeButton="[{ text: 'Cancel', action: 'close' }]"
      :saveButton="[{ text: 'Save', color: 'primary', action: '/api/posts/post/edit/' + props.post.id }]"
      :files="files"
      :forms="formPayload"
      @success="handleSuccess"
      @error="handleError"
    >
      <v-card-text>
        <v-text-field
          v-model="postContent"
          label="Post Title"
          variant="outlined"
          required
          @input="detectLinks"
        />

        <div v-if="youtubeId" class="my-4">
          <v-btn icon size="small" variant="text" @click="clearPreview"><v-icon>mdi-close</v-icon></v-btn>
          <iframe
            :src="`https://www.youtube.com/embed/${youtubeId}`"
            width="100%" height="200"
            frameborder="0" allowfullscreen
          />
        </div>

        <div v-if="imageUrl" class="my-4 text-center">
          <v-btn icon size="small" variant="text" @click="clearPreview"><v-icon>mdi-close</v-icon></v-btn>
          <NuxtImg :src="imageUrl" format="webp" loading="lazy" style="max-height: 300px; max-width: 100%;" />
        </div>
      </v-card-text>
    </BaseDialog>

    <!-- Delete Dialog -->
    <DeleteDialog
      v-model="deleteDialog"
      :deleteUrl="`/api/posts/post/delete/${props.post.id}`"
      :closeButton="[{ text: 'Cancel', action: 'close' }]"
      @deleted="handleSuccessDelete"
    />
  </div>
</template>
