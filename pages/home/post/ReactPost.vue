<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFetch } from '#app'
import Comments from "~/pages/home/post/Comments.vue";

const { user, loggedIn } = await useUserSession()
const showReplies = ref(false)
const props = defineProps<{
  post: {
    id: string
    likes?: any[]
    comments?: any[]
  }
}>()

const loading = ref(false)
const isLiking = ref(false)
const localLikes = ref([...props.post.likes ?? []])
const likeId = ref('')
function hasLiked() {
  if (localLikes.value && loggedIn) {
    for (const like of localLikes.value) {
      if (like?.user?.id == user.value.id) {
        likeId.value = like.id
        return isLiking.value = true;
      }
    }
  }
}

watch(!localLikes.value, () => {
  hasLiked()
}, { immediate: true })

const handleLike = async () => {
  loading.value = true
  if (!loggedIn) {
    Notify.error('You are not logged')
    return
  }

  if (isLiking.value === false) {
    try {
      const { data } = await useFetch(`/api/posts/${props.post.id}/like`, {
        method: 'POST',
      })
      localLikes.value.push({
        id: data.id,
        user: user.value
      })
      likeId.value = data.value.id
      isLiking.value = true
      Notify.success('Post is liked !')
    } catch (err) {
      Notify.error('Error : ' + err)
    }
  } else {
    try {
      await useFetch(`/api/posts/${likeId.value}/post`, {
        method: 'POST',
      })
      localLikes.value = localLikes.value.filter(
        like => like.user?.id !== user.value.id
      )
      isLiking.value = false
      Notify.success('Post is disliked !')
    } catch (err) {
      Notify.error('Error : ' + err)
    }
  }
  loading.value = false
}
</script>

<template>
  <div class="d-flex justify-end mb-2">
    <div class="d-flex align-center me-2">
      <v-icon
        v-if="!loading"
        size="24"
        class="me-1 cursor-pointer"
        :color="isLiking ? 'primary' : 'secondary'"
        @click="handleLike"
      >
        mdi-thumb-up
      </v-icon>
      <v-progress-circular
        v-else
        indeterminate
        size="24"
        color="primary"
      />
      <span v-if="localLikes.length > 0 && !loading" class="text-sm me-4" :class="isLiking ? 'text-primary' : 'text-secondary'">
          {{ localLikes.length }}
        </span>
    </div>
    <div class="d-flex align-center">
      <div class="d-flex align-center ms-auto">
        <v-icon
          size="24"
          class="me-1 cursor-pointer text-body"
          @click="showReplies = !showReplies"
        >
          mdi-comment-processing
        </v-icon>
        <span @click="showReplies = !showReplies" v-if="props.post?.comments?.length > 0" class="text-sm text-body me-4">
          {{ props.post.comments.length }}
        </span>
      </div>
    </div>
  </div>
  <div v-if="showReplies">
    <Comments :post="props.post" />
  </div>
</template>
