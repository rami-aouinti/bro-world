<script setup lang="ts">
import HomeStories from "~/pages/home/HomeStories.vue";
import HomePosts from "~/pages/home/HomePosts.vue";
import HomeFilters from "~/pages/home/HomeFilters.vue";
import NewPost from "~/pages/home/post/NewPost.vue";
const { loggedIn } = useUserSession()
const { data: posts, pending, error } = useFetch('/api/posts')
definePageMeta({
  layout: 'default',
})

</script>

<template>
  <v-container fluid>
    <HomeStories v-if="loggedIn"></HomeStories>
    <v-row>
      <v-col lg="8" cols="12">
        <NewPost v-if="loggedIn"></NewPost>
        <div
          v-if="pending"
          class="d-flex justify-center align-center"
          style="height: 25vh"
        >
          <v-progress-circular
            :size="120"
            :width="10"
            color="primary"
            indeterminate
          />
        </div>
        <div v-else>
          <div v-for="post in posts" :key="post.id">
            <HomePosts :post="post"></HomePosts>
          </div>
        </div>
        <v-alert v-if="error" type="error" class="ma-4">
          An error occurred while loading posts.
        </v-alert>
      </v-col>
      <v-col lg="4" cols="12">
        <HomeFilters></HomeFilters>
      </v-col>
    </v-row>
  </v-container>
</template>
