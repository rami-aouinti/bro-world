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

const { loggedIn } = useUserSession()
const postStore = usePostStore()
const { locale } = useI18n()
const loadingUser = ref(true)

onMounted(async () => {
  await nextTick()
  loadingUser.value = false
})
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
</script>
<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingUser">
      <v-card class="mb-3 px-4 py-3 d-flex align-center rounded-xl" variant="text">
        <v-skeleton-loader type="avatar" class="mr-3" />
        <v-skeleton-loader
          class="rounded-pill"
          height="16px"
          width="100%"
        />
      </v-card>
    </template>
    <template v-else>
      <UserStatusBanner v-if="loggedIn" />
    </template>
    <v-row>
      <v-col cols="12" lg="8">
        <!-- Loader pendant chargement -->
        <template v-if="loadingUser">
          <!-- Simule l’input “Hello John, new post?” -->
          <v-card class="mb-3 px-4 py-3 d-flex align-center rounded-xl" variant="text">
            <v-skeleton-loader type="avatar" class="mr-3" />
            <v-skeleton-loader
              class="rounded-pill"
              height="36px"
              width="100%"
            />
          </v-card>

          <!-- Simule les boutons Video / Photo / Story -->
          <v-card class="mb-4 px-4 py-3 d-flex justify-space-around rounded-xl" variant="text">
            <v-skeleton-loader type="button" width="80px" class="mx-2" />
            <v-skeleton-loader type="button" width="80px" class="mx-2" />
            <v-skeleton-loader type="button" width="80px" class="mx-2" />
          </v-card>

          <!-- Simule la zone des stories -->
          <v-card class="mb-4 px-4 py-3 rounded-xl" variant="text">
            <v-row dense justify="start" no-gutters>
              <v-col v-for="n in 5" :key="n" class="mx-2" cols="auto">
                <v-skeleton-loader type="avatar" class="mx-auto" />
              </v-col>
            </v-row>
          </v-card>
        </template>

        <!-- Composants réels -->
        <template v-else>
          <NewPost />
          <HomeStories />
        </template>

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

