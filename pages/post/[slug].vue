<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
)
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import { usePostStore } from "~/stores/usePostStore"
import BasisMinibar from "~/components/App/BasisMinibar.vue";
import PostCard from "~/components/Blog/PostCard.vue";
import PostCompletCard from "~/components/Blog/PostCompletCard.vue";

const postStore = usePostStore()

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
    <client-only>
      <teleport to="#menu-bar-world">
        <BasisMinibar></BasisMinibar>
      </teleport>
    </client-only>
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
      <v-col cols="12">
        <v-card rounded="xl" class="mx-3" variant="text" elevation="10">
          <PostCompletCard :post="post" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

