<script setup lang="ts">
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";

defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="py-3">
    <v-card rounded="xl" class="mx-3" variant="text">
      <AuthorPost :author="post.user" :date="post.publishedAt"></AuthorPost>
      <Post :post="post"></Post>
    </v-card>
  </div>
</template>
