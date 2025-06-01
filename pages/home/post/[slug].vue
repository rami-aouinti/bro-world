<script setup lang="ts">
import { useRoute } from 'vue-router'
import Comments from "~/pages/home/post/Comments.vue";
import ReactPost from "~/pages/home/post/ReactPost.vue";

const route = useRoute()
const slug = route.params.slug
const pending = ref(false)
const post = ref({})
const loadPost = async () => {
  pending.value = true
  const { data } = await useFetch(`/api/posts/${slug}`)
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

definePageMeta({
  middleware: ['auth'],
})

</script>
<template>
  <v-container
    fluid
  >
    <div class="px-4 py-4">
      <p class="text-left mb-6 text-body font-weight-light">
        {{ post.title }}
      </p>
      <v-img
        src="https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        class="border-radius-lg shadow-lg"
      />
      <ReactPost :post="post"></ReactPost>
      <Comments :post="post"></Comments>
    </div>
  </v-container>
</template>
