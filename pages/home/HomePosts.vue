<script setup lang="ts">
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";
import { ref, defineProps, defineEmits } from 'vue'
const emit = defineEmits(['post-updated', 'post-deleted'])
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

</script>

<template>
  <div class="py-3">
    <v-card rounded="xl" class="mx-3" variant="text" elevation="10">
      <AuthorPost @post-updated="emit('post-updated')" @post-delete="emit('post-deleted')" :post="props.post"></AuthorPost>
      <Post :post="props.post"></Post>
    </v-card>
  </div>
</template>
