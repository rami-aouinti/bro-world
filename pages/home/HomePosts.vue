<script setup lang="ts">
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";
const emit = defineEmits(['post-updated', 'post-deleted', 'post-reload'])
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  index: Number
})
const cardSpacing = computed(() => {
  if (props.index === 0) return 'mb-2'
  return 'my-2'
})
</script>

<template>
  <div :class="cardSpacing">
  <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3" variant="text" elevation="10">
      <div class="bg-gradient-primary shadow-primary px-4 py-2">
        <AuthorPost @post-updated="(data) => emit('post-updated', data)" @post-delete="(data) => emit('post-deleted', data)" :post="props.post"></AuthorPost>
        <Post @post-reload="emit('post-reload')" :post="props.post"></Post>
      </div>
    </v-card>
  </div>
</template>
