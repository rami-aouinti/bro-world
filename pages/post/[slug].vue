<script setup lang="ts">
import { useRoute } from 'vue-router'
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";
import AuthorPost from "~/pages/home/post/AuthorPost.vue";

const route = useRoute()
const slug = route.params.slug
const pending = ref(true)
const post = ref({})
const loadPost = async () => {
  const { data } = await useFetch(`/api/posts/post/${slug}`)
  if (data.value) {
    post.value = data.value
  }
  pending.value = false
}

watch(slug, () => {
  loadPost()
}, { immediate: true })

onMounted(async () => {
  await loadPost()
})

</script>
<template>
  <v-container
    fluid
  >
    <div v-if="pending" class="d-flex justify-center align-center" style="height: 25vh">
      <v-progress-circular :size="120" :width="10" color="primary" indeterminate />
    </div>
    <v-card v-else rounded="xl" class="mx-3" variant="text">
      <AuthorPost :post="post"></AuthorPost>
      <div class="px-4 py-4">
        <p class="text-left mb-6 text-body font-weight-light">
          {{ post.title }}
        </p>
        <NuxtImg
          v-if="post?.medias?.length > 0"
          :alt="`image-${post.slug}`"
          :src="post?.medias[0]?.path"
          layout="responsive"
          style="width: 100%; height: auto"
          class="border-radius-lg shadow-lg"
          :preload="true"
          loading="eager"
          fetchpriority="high"
        />
        <ReactPost :post="post"></ReactPost>
        <Comments :post="post"></Comments>
      </div>
    </v-card>
  </v-container>
</template>
