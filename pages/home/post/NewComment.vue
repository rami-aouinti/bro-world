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
        @click:append-inner="sendComment"
      />
    </div>
  </div>
</template>
