<script setup lang="ts">
import InfiniteList from '~/components/Blog/InfiniteList.vue'
import { usePostStore } from '~/stores/usePostStore'
import UserStatusBanner from '~/components/App/UserStatusBanner.vue'
import HomeStories from '~/pages/home/HomeStories.vue'
import NewPost from '~/pages/home/post/NewPost.vue'
import HomePosts from '~/pages/home/HomePosts.vue'
import HomeFilters from '~/pages/home/HomeFilters.vue'

const { loggedIn } = useUserSession()
const postStore = usePostStore()

</script>

<template>
  <v-container fluid>
    <UserStatusBanner v-if="loggedIn" />
    <v-row>
      <v-col cols="12" lg="8">
        <NewPost v-if="loggedIn" />
        <HomeStories v-if="loggedIn" />
        <InfiniteList
          v-if="!postStore.loaded"
          fetch-url="/api/posts"
          :limit="5"
          @loaded="postStore.setPosts"
        >
          <template #default="{ items }">
            <div v-for="post in items" :key="post.id">
              <HomePosts :post="post" />
            </div>
          </template>
        </InfiniteList>

        <div v-else-if="postStore.posts.length">
          <div v-for="post in postStore.posts" :key="post.id">
            <HomePosts :post="post" />
          </div>
        </div>
        <v-alert v-else type="warning" class="mt-4">
          No Posts
        </v-alert>
      </v-col>

      <v-col cols="12" lg="4">
        <HomeFilters />
      </v-col>
    </v-row>
  </v-container>
</template>
