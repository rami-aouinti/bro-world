<script setup lang="ts">
import InfiniteList from '~/components/Blog/InfiniteList.vue'
import { usePostStore } from '~/stores/usePostStore'
import UserStatusBanner from '~/components/App/UserStatusBanner.vue'
import HomeStories from '~/pages/home/HomeStories.vue'
import NewPost from '~/pages/home/post/NewPost.vue'
import HomePosts from '~/pages/home/HomePosts.vue'
import HomeFilters from '~/pages/home/HomeFilters.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import LoaderStatusBanner
  from "~/components/App/Loader/Home/LoaderStatusBanner.vue";
import LoaderPost from "~/components/App/Loader/Home/LoaderPost.vue";
import { ref, onMounted } from 'vue'
const { loggedIn } = useUserSession()
const postStore = usePostStore()
const { locale } = useI18n()
const loadingUser = ref(true)
const currentPage = ref(1)
const limit = ref(5)
const totalPages = ref(1)
async function reloadPosts() {
  postStore.clearPosts()
  await postStore.fetchPosts()
}

onMounted(async () => {
  await nextTick()
  loadingUser.value = false
})
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
</script>
<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingUser">
      <LoaderStatusBanner />
    </template>
    <template v-else>
      <UserStatusBanner v-if="loggedIn" />
    </template>
    <v-row>
      <v-col cols="12" lg="8">
        <!-- Loader pendant chargement -->
        <template v-if="loadingUser">
          <LoaderPost />
        </template>

        <!-- Composants réels -->
        <template v-else>
          <NewPost @post-created="reloadPosts" v-if="loggedIn" />
          <HomeStories v-if="loggedIn" />
        </template>

        <InfiniteList
          v-if="!postStore.loaded"
          fetch-url="/api/posts"
          :limit="20"
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
          <v-pagination
            rounded="circle"
            color="primary"
            v-model="currentPage"
            :length="totalPages"
            class="mt-4"
          />
        </div>

        <v-alert v-else type="info" color="primary" class="mt-10 mx-6">
          No Posts
        </v-alert>
      </v-col>

      <v-col cols="12" lg="4">
        <HomeFilters />
      </v-col>
    </v-row>
  </v-container>
</template>

