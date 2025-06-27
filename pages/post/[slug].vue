<script setup lang="ts">
import { useRoute } from 'vue-router'
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";

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

watch(!slug, () => {
  loadPost()
}, { immediate: true })

onMounted(async () => {
  await loadPost()
})

</script>
<template>
  <v-container fluid>
    <div v-if="pending" class="d-flex justify-center align-center">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="8">
          <v-skeleton-loader
            type="card"
            class="pa-4 rounded-xl"
            height="200"
            rounded="xl"
          />
        </v-col>
      </v-row>
    </div>

    <v-row v-else justify="center">
      <v-col cols="12" md="8" lg="8">
        <v-card rounded="xl" class="mx-3" variant="text" elevation="10">
          <AuthorPost :post="post" />
          <Post :post="post" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

