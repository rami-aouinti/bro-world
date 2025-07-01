<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";
import { usePostStore } from "~/stores/usePostStore"

const postStore = usePostStore()
const route = useRoute()
const slug = ref(route.params.slug)

const pending = ref(true)
const post = ref({})

const loadPost = async () => {
  try {
    if (slug?.value) {
      const postData = await postStore.fetchPost(slug.value)
      if (postData) {
        post.value = postData
      }
    }
  } catch (e) {
    console.error('Erreur de chargement du post :', e)
  } finally {
    pending.value = false
  }
}

watch(() => route.params.slug, async (newSlug) => {
  slug.value = newSlug
  await loadPost()
}, { immediate: true })

onMounted(() => {
  loadPost()
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

