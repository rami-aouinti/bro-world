<script setup lang="ts">
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";
defineProps<{
  post:
    { id: string;
      title: string;
      content: string ,
      author: {
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
    <v-card rounded="xl">
      <AuthorPost :author="post.author" :date="post.date"></AuthorPost>
      <Post :title="post.title" :content="post.content"></Post>
    </v-card>
  </div>
</template>
