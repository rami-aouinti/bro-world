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
const localePath = useLocalePath()
</script>

<template>
  <div class="d-flex align-center px-4 py-0">
    <NuxtLink :to="localePath(`/post/${props.post.slug}`)" class="text-decoration-none">
      <div v-if="props.post?.title" v-html="props.post?.title" class="font-weight-600 text-sm" :class="isDark ? 'text-white' : 'text-default'">
      </div>
      <div v-if="props.post?.content" v-html="truncate(props.post?.content, 500)" class="font-weight-600 text-sm" :class="isDark ? 'text-white' : 'text-default'">
      </div>
    </NuxtLink>
  </div>
</template>
