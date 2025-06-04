<script setup lang="ts">
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";
defineProps<{
  post: []
}>();
</script>

<template>
  <div class="px-4 py-4">
    <NuxtLink :to="`/posts/post/${post.slug}`" class="text-decoration-none">
      <p class="text-left mb-6 text-body font-weight-light">
        {{ post.title }}
      </p>
    </NuxtLink>
    <v-img
      src="https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
      class="border-radius-lg shadow-lg"
    />
    <ReactPost :post="post"></ReactPost>
    <Comments :post="post"></Comments>
  </div>
</template>
