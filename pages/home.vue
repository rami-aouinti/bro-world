<script setup lang="ts">
import HomeStories from "~/pages/home/HomeStories.vue";
import HomePosts from "~/pages/home/HomePosts.vue";
import HomeFilters from "~/pages/home/HomeFilters.vue";
import HomeProfile from "~/pages/home/HomeProfile.vue";
import HomeProfileTabs from "~/pages/home/HomeProfileTabs.vue";
import NewPost from "~/pages/home/post/NewPost.vue";

const { data: posts, pending, error } = useFetch('/api/posts')
</script>

<template>
  <v-container fluid>
    <v-card rounded="xl">
      <v-row>
        <HomeProfile></HomeProfile>
        <HomeProfileTabs></HomeProfileTabs>
      </v-row>
      <HomeStories></HomeStories>
      <v-row>
        <v-col lg="8" cols="12">
          <NewPost></NewPost>
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
    </v-card>
  </v-container>
</template>
