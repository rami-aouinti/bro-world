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
      v-if="post?.medias?.length > 0"
      :alt="`image-${post.slug}`"
      :src="post?.medias[0]?.path"
      style="width: 100%; height: auto"
      class="border-radius-lg shadow-lg"
      :preload="true"
      loading="eager"
      fetchpriority="high"
    />
    <ReactPost :post="post"></ReactPost>
    <Comments :post="post"></Comments>
  </div>
</template>
