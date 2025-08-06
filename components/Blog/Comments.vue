<script setup lang="ts">
import CommentItem from "~/components/Blog/CommentItem.vue";
const props = defineProps({ comments: Array });
</script>

<template>
  <div>
    <CommentItem v-for="c in props.comments" :key="c.id" :comment="c" />
  </div>
</template>
