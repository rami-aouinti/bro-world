<script setup lang="ts">
import Comment from "~/pages/home/post/Comment.vue";
import { computed, ref} from 'vue'
import UserAvatar from "~/components/App/UserAvatar.vue";
const emit = defineEmits(['comment-commented'])
const { user, loggedIn } = await useUserSession()
const sendingComment = ref(false)
const props = defineProps<{
  comment: {
    id: string
    content: string
    publishedAt: string
    likes?: any[]
    user?: any[]
    children?: any[]
  }
}>()

const showReplies = ref(false)
const newReply = ref('')
const loadingReactComment = ref(true)
const loading = ref(false)
const isLiking = ref(false)
const localLikes = ref([...props.comment.likes ?? []])
const children = ref(props.comment.children)
const likeId = ref('')
function hasLiked() {
  if (localLikes.value && loggedIn && loadingReactComment) {
    for (const like of localLikes.value) {
      if (like?.user?.id == user?.value?.id) {
        likeId.value = like.id
        loadingReactComment.value = false;
        return isLiking.value = true;
      }
    }
  }
}

watch(loadingReactComment, () => {
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
      const { data } = await useFetch(`/api/posts/comment/${props.comment.id}/like`, {
        method: 'POST',
      })
      localLikes.value.push({
        id: data.id,
        user: user.value
      })
      likeId.value = data.value.id
      isLiking.value = true
      Notify.success('Comment is liked by me', user.photo, 'https://bro-world-space.com/post/' + props.post.slug)
    } catch (err) {
      Notify.error('Error : ' + err)
    }
  } else {
    try {
      await useFetch(`/api/posts/${likeId.value}/comment`, {
        method: 'POST',
      })
      localLikes.value = localLikes.value.filter(
        like => like.user?.id !== user.value.id
      )
      isLiking.value = false
      Notify.success('Comment is disliked by me', user.photo, 'https://bro-world-space.com/post/' + props.post.slug)
    } catch (err) {
      Notify.error('Error : ' + err)
    }
  }
  loading.value = false
}


const sendComment = async () => {
  sendingComment.value = true
  const formData = new FormData();
  formData.append('content', newReply.value);
  const {data, error} = await useFetch(`/api/posts/post/comment/${props.comment.id}/comments`, {
    method: 'POST',
    body: formData
  });
  if (data.value) {
    data.value.content = sendingComment.value
    data.value.user = user.value
    children.value.unshift(data.value);
    emit('comment-commented')
    newReply.value = ''
  } else {
    console.error("Error send comment:", error);
  }
  sendingComment.value = false
}
</script>

<template>
  <v-card-actions class="d-flex justify-end">
  <div>
    <v-icon
      size="20"
      v-if="!loading"
      class="me-1 cursor-pointer"
      :aria-label="isLiking ? 'Unlike comment' : 'Like comment'"
      :color="isLiking ? 'primary' : 'secondary'"
      @click="handleLike"
    >mdi-thumb-up</v-icon
    >
    <v-progress-circular
      v-else
      indeterminate
      size="24"
      color="primary"
    />
    <span v-if="localLikes.length > 0 && !loading " class="text-sm me-4" :class="isLiking ? 'text-primary' : 'text-secondary'">
          {{ localLikes.length }}
        </span>
    <v-icon
      size="20"
      aria-label="Show replies"
      class="material-icons-round me-1 text-body cursor-pointer"
      @click="showReplies = !showReplies"
    >mdi-comment-processing</v-icon
    >
    <span aria-label="Number of replies" @click="showReplies = !showReplies" class="text-sm me-2 text-body">{{ props.comment.children?.length || '' }}</span>
  </div>
  </v-card-actions>
  <!-- Replies + Input -->
  <div v-if="showReplies" class="mt-3 ms-5">
    <div
      v-for="reply in children"
      :key="reply.id"
      class="mb-2"
    >
      <Comment :comment="reply"></Comment>
    </div>
    <div class="d-flex align-center mt-3">
      <div class="flex-shrink-0" style="padding-bottom: 18px;">
        <UserAvatar :user="user" size="32" />
      </div>

      <div class="flex-grow-1 ms-4 d-flex align-center">
        <v-textarea
          v-model="newReply"
          :append-inner-icon="sendingComment ? 'mdi-loading' : 'mdi-send'"
          :class="{ 'mdi-spin': sendingComment }"
          rounded
          class="mx-0 w-100"
          label="Write your comment"
          :aria-label="sendingComment ? 'Sending comment...' : 'Send comment'"
          row-height="10"
          rows="1"
          variant="outlined"
          auto-grow
          density="compact"
          @click:append-inner="sendComment"
        />
      </div>
    </div>
  </div>
</template>
