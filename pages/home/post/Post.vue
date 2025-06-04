<script setup lang="ts">
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";

defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="px-4 py-4">
    <NuxtLink :to="`/post/${post.slug}`" class="text-decoration-none">
      <p class="text-left mb-6 text-body font-weight-light">
        {{ post.title }}
      </p>
    </NuxtLink>
    <NuxtImg
      src="https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&w=1950&q=80"
      :alt="`image-${post.slug}`"
      class="border-radius-lg shadow-lg"
      width="100%"
      height="auto"
      :preload="true"
      loading="eager"
      fetchpriority="high"
    />
    <ReactPost :post="post"></ReactPost>
    <Comments :post="post"></Comments>
  </div>
</template>
