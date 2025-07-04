<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import Post from "~/pages/home/post/Post.vue";
import { usePostStore } from "~/stores/usePostStore"

const postStore = usePostStore()
const route = useRoute()
const slug = ref(route.params.slug)

const { data: post, pending, error, refresh } = await useAsyncData(
  'post-' + slug.value,
  () => postStore.fetchPost(slug.value),
  {
    watch: [() => slug.value],
    server: true
  }
)
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

