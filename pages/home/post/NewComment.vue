<script setup lang="ts">
import { ref } from 'vue'
import UserAvatar from "~/components/App/UserAvatar.vue";
const { user } = useUserSession()
const comment = ref('')
const sendComment = () => {
  if (comment.value.trim()) {
    console.log('Comment sent:', comment.value)
    comment.value = ''
  }
}
</script>

<template>
  <div class="d-flex mt-6">
    <div class="flex-shrink-0">
      <UserAvatar :user="user" size="32"></UserAvatar>
    </div>
    <div class="flex-grow-1 ms-4">
      <v-textarea
        v-model="comment"
        append-inner-icon="mdi-send"
        rounded
        class="mx-2"
        label="Write your comment"
        row-height="8"
        rows="1"
        variant="outlined"
        auto-grow
        @click:append-inner="sendComment"
      />
    </div>
  </div>
</template>
