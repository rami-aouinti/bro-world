<script setup lang="ts">
import { ref } from "vue";
import Comments from "~/components/Blog/Comments.vue";
import NewComment from "~/components/Blog/NewComment.vue";

const props = defineProps({ post: Object });
const show = ref(false);
const comments = ref([...props.post.comments ?? []]);

const addComment = (c) => comments.value.unshift(c);
</script>

<template>
  <div>
    <v-btn variant="text" @click="show = !show">
      💬 {{ comments.length }} Comments
    </v-btn>

    <Comments v-if="show" :comments="comments" @comment-added="addComment" />
    <NewComment v-if="show" :post="props.post" @comment-created="addComment" />
  </div>
</template>
