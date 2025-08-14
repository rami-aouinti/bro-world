<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({ post: Object });
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
import { useLocalePath } from '#i18n'
import PostCard from "~/components/Blog/PostCard.vue";
const localePath = useLocalePath()
</script>

<template>
  <div class="d-flex align-center px-4 py-0">
    <NuxtLink :to="localePath(`/post/${props.post.slug}`)" class="text-decoration-none">
      <div v-if="props.post?.title" v-html="props.post?.title" class="font-weight-600 text-sm" :class="isDark ? 'text-white' : 'text-default'">
      </div>
      <div v-if="props.post?.content" v-html="props.post?.content" class="font-weight-600 text-sm" :class="isDark ? 'text-white' : 'text-default'">
      </div>
    </NuxtLink>
  </div>
  <div v-if="props.post?.sharedFrom" class="font-weight-600 text-sm" :class="isDark ? 'text-white' : 'text-default'">
    <PostCard :post="props.post.sharedFrom" />
  </div>
</template>
