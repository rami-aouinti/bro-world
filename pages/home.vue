<script setup lang="ts">
import HomeStories from "~/pages/home/HomeStories.vue";
import HomePosts from "~/pages/home/HomePosts.vue";
import HomeFilters from "~/pages/home/HomeFilters.vue";
import NewPost from "~/pages/home/post/NewPost.vue";
const { loggedIn } = useUserSession()
const { data: posts, pending, error } = useFetch('/api/posts')
</script>

<template>
  <v-container fluid>
    <HomeStories v-if="loggedIn"></HomeStories>
    <v-row>
      <v-col lg="8" cols="12">
        <NewPost v-if="loggedIn"></NewPost>
        <p v-if="pending">Loading...</p>
        <p v-if="error">Error : {{ error.message }}</p>
        <div v-for="post in posts" :key="post.id">
          <HomePosts :post="post"></HomePosts>
        </div>
      </v-col>
      <v-col lg="4" cols="12">
        <HomeFilters></HomeFilters>
      </v-col>
    </v-row>
  </v-container>
</template>
