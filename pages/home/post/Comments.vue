<script setup lang="ts">
import NewComment from "~/pages/home/post/NewComment.vue";
import ReactComment from "~/pages/home/post/ReactComment.vue";
import UserAvatar from "~/components/App/UserAvatar.vue";
defineProps<{
  post: []
}>();
const { loggedIn } = useUserSession()
</script>

<template>
  <div class="mb-1">
    <hr class="horizontal dark mt-1 mb-5" />
    <div v-for="comment in post.comments" class="d-flex mt-3">
      <div class="flex-shrink-0">
        <UserAvatar :user="comment.user" size="32"></UserAvatar>
      </div>
      <div class="flex-grow-1 ms-4">
        <h5
          class="text-left text-h6 text-typo font-weight-bold mt-0 mb-2"
        >
          {{ comment.user.firstName }} {{ comment.user.lastName }}
        </h5>
        <p class="text-left text-sm font-weight-light text-body">
          {{ comment.content }}
        </p>
        <ReactComment></ReactComment>
      </div>
    </div>
    <NewComment v-if="loggedIn"></NewComment>
  </div>
</template>
