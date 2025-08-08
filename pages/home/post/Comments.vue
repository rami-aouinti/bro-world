<script setup lang="ts">
import NewComment from "~/pages/home/post/NewComment.vue";
import Comment from "~/pages/home/post/Comment.vue";
import { ref } from 'vue'
import { useLocalePath } from '#i18n'
const props = defineProps<{
  comments: {
    type: any,
    required: true,
  },
}>()
const comments = ref(props.comments)

const localePath = useLocalePath()
const { loggedIn, user } = useUserSession()


const reloadComments = async (data: any) => {
  comments.value.unshift(data.value);
}
</script>

<template>
  <div class="mb-1">
    <div v-for="comment in comments" :key="comment.id" class="d-flex mt-1">
      <Comment @comment-created="reloadComments" @comment-deleted="reloadComments" :comment="comment" />
    </div>
  </div>
</template>
