<script setup lang="ts">
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import PostMedia from "~/components/Blog/PostMedia.vue";
import PostActions from "~/components/Blog/PostActions.vue";
import PostContent from "~/components/Blog/PostContent.vue";

const props = defineProps({
  post: { type: Object, required: true },
  friends: {},
  index: Number
});
const emit = defineEmits(['post-updated', 'post-deleted', 'post-reload']);

const cardSpacing = computed(() => (props.index === 0 ? 'mb-2' : 'my-2'));
</script>

<template>
  <div :class="cardSpacing">
    <v-card rounded="xl" class="bg-gradient-primary mx-3" variant="outlined">
      <div class="px-4 py-2">
        <AuthorPost :post="props.post"
                    :friends="props.friends"
                    @post-updated="emit('post-updated', $event)"
                    @post-delete="emit('post-deleted', $event)" />

        <PostContent :post="props.post" />
        <PostMedia :post="props.post" />

        <PostActions :friends="props.friends" :post="props.post"
                     @post-reload="emit('post-reload')" />

      </div>
    </v-card>
  </div>
</template>
