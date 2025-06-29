<script setup lang="ts">
import NewComment from "~/pages/home/post/NewComment.vue";
import Comment from "~/pages/home/post/Comment.vue";
import { ref } from 'vue'
import { useLocalePath } from '#i18n'
const props = defineProps<{
  post: {
    id: string
    comments: any[]
  },
}>()

const localePath = useLocalePath()
const { loggedIn, user } = useUserSession()
const comments = ref(props.post.comments)

const reloadComments = async (data: any) => {
  comments.value.unshift(data.value);
}
</script>

<template>
  <div class="mb-1">
    <hr class="horizontal dark mt-1 mb-5" />

    <div v-for="comment in comments" :key="comment.id" class="d-flex mt-3">
      <Comment @comment-created="reloadComments" @comment-deleted="reloadComments" :comment="comment" />
    </div>

    <NewComment
      :post="props.post"
      v-if="loggedIn"
      @comment-created="reloadComments"
    />
  </div>
</template>
