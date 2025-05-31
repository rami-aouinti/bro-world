<script setup lang="ts">
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";
defineProps<{
  post:
    { id: string;
      title: string;
      content: string ,
      user: {
        id: string,
        username: string,
        avatar: string
      },
      date: string
    }
}>();
</script>

<template>
  <div class="py-3">
    <v-card rounded="xl" class="mx-3" variant="text">
      <AuthorPost :author="post.user" :date="post.publishedAt"></AuthorPost>
      <Post :post="post"></Post>
    </v-card>
  </div>
</template>
