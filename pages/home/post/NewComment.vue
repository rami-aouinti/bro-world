<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import UserAvatar from "~/components/App/UserAvatar.vue"

const { user } = useUserSession()
const comment = ref('')

// 👇 Ajout de l’emit
const emit = defineEmits(['comment-created'])

const props = defineProps<{
  post: {
    id: string
  }
}>()

const sendComment = async () => {
  if (!comment.value.trim()) return

  const formData = new FormData()
  formData.append('content', comment.value)

  const { data, error } = await useFetch(`/api/posts/post/${props.post.id}/comments`, {
    method: 'POST',
    body: formData,
  })

  if (data.value) {
    emit('comment-created', data.value)
    comment.value = ''

  } else {
    console.error("Error send comment:", error)
  }
}
</script>

<template>
  <div class="d-flex align-center mt-3">
    <div class="flex-shrink-0" style="padding-bottom: 18px;">
      <UserAvatar :user="user" size="48" />
    </div>

    <div class="flex-grow-1 ms-4 d-flex align-center">
      <v-textarea
        v-model="comment"
        append-inner-icon="mdi-send"
        rounded
        class="mx-2 w-100"
        label="Write your comment"
        row-height="10"
        rows="1"
        variant="outlined"
        auto-grow
        density="compact"
        @click:append-inner="sendComment"
      />
    </div>
  </div>
</template>
