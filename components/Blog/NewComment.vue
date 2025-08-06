<script setup lang="ts">
import { ref } from "vue";
import UserAvatar from "~/components/App/UserAvatar.vue";

const { user, loggedIn } = await useUserSession();
const emit = defineEmits(["comment-created"]);

const props = defineProps({
  post: { type: Object, required: true }
});

const comment = ref("");
const loading = ref(false);

async function sendComment() {
  if (!comment.value.trim()) return;
  if (!loggedIn.value) return Notify.error("You must be logged in!");

  loading.value = true;
  try {
    const data = await $fetch(`/api/posts/${props.post.id}/comments`, {
      method: "POST",
      body: { content: comment.value }
    });
    emit("comment-created", data);
    comment.value = "";
    Notify.success("Comment added!");
  } catch (e) {
    Notify.error("Failed to send comment");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="d-flex align-center mt-2">
    <UserAvatar :user="user" size="32" />
    <v-textarea v-model="comment" class="ms-3 flex-grow-1"
                label="Write a comment..." rows="1" auto-grow
                :append-inner-icon="loading ? 'mdi-loading' : 'mdi-send'"
                :class="{ 'mdi-spin': loading }"
                @click:append-inner="sendComment" />
  </div>
</template>
