<script setup lang="ts">
import { ref, computed, onMounted, nextTick, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePostStore } from '~/stores/usePostStore'
import { useStoryStore } from '~/stores/useStoryStore'

import UserStatusBanner from '~/components/App/UserStatusBanner.vue'
import HomeStories from '~/pages/home/HomeStories.vue'
import NewPost from '~/pages/home/post/NewPost.vue'
import HomePosts from '~/pages/home/HomePosts.vue'
import Dashboard from '~/pages/home/Dashboard.vue'
import LoaderStatusBanner from '~/components/App/Loader/Home/LoaderStatusBanner.vue'
import LoaderPost from '~/components/App/Loader/Home/LoaderPost.vue'

const CreateWorldDialog = defineAsyncComponent(() => import('~/components/App/Home/CreateWorldDialog.vue'))

const { locale } = useI18n()
const { user, loggedIn } = useUserSession()
const postStore = usePostStore()
const storyStore = useStoryStore()

const dialogCreateWorld = ref(false)
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)
const stories = ref<any[]>([])
const plugins = ref<any[]>([])

const loading = ref({
  user: true,
  post: true,
  story: true,
  plugin: true,
})

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const totalPages = computed(() =>
  Math.ceil(postStore.total / postStore.limit)
)

const loadInitialPosts = async () => {
  try {
    const newPosts = await postStore.fetchPosts(1, postStore.limit)
    if (newPosts) {
      postStore.setPosts({
        data: newPosts,
        page: 1,
        limit: postStore.limit,
        count: postStore.total,
      })
      hasMore.value = totalPages.value >= currentPage.value
    }
  } catch (e) {
    console.error('Erreur fetch posts:', e)
  } finally {
    loading.value.post = false
  }
}

const loadMore = async ({ done }) => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  const nextPage = currentPage.value + 1
  const newPosts = await postStore.fetchPosts(nextPage, postStore.limit)

  if (newPosts?.length) {
    postStore.appendPosts(newPosts)
    currentPage.value = nextPage
    done('ok')
  } else {
    done('empty')
  }

  hasMore.value = totalPages.value > nextPage
  isLoading.value = false
}

const fetchPlugins = async () => {
  try {
    if (!loggedIn.value) return
    const data = await $fetch('/api/plugin/profile/get')
    if (data) plugins.value = data
  } catch (e) {
    console.error('Erreur fetch plugins:', e)
  } finally {
    loading.value.plugin = false
  }
}

const loadStories = async () => {
  try {
    if (loggedIn.value && user.value?.id) {
      const data = await storyStore.fetchStories(user.value.id)
      stories.value = data ?? []
    }
  } catch (e) {
    console.error('Erreur fetch stories:', e)
  } finally {
    loading.value.story = false
  }
}

const reloadPosts = (post: any) => {
  postStore.appendPost({ data: post })
}

const reloadStories = async () => {
  await loadStories()
  Notify.success("Story created!", user?.photo ?? 'https://placehold.net/avatar-5.svg', `/user/${user.username}`)
}

onMounted(async () => {
  try {
    await loadInitialPosts()
    await fetchPlugins()
    await nextTick()
    await loadStories()
  } catch (e) {
    console.error('Erreur onMounted:', e)
  } finally {
    loading.value.user = false
  }
})
</script>

<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- STATUS BANNER -->
    <LoaderStatusBanner v-if="loading.user" />
    <UserStatusBanner v-else-if="loggedIn && !user?.enabled" />

    <v-row>
      <!-- LEFT: POSTS -->
      <v-col cols="12" lg="8" style="min-height: 600px;">
        <!-- TOP -->
        <template v-if="loading.user">
          <LoaderPost />
        </template>

        <template v-else>
          <NewPost v-if="loggedIn" @post-created="reloadPosts" @story-created="reloadStories" />
          <ClientOnly>
            <template v-if="loading.story">
              <v-skeleton-loader type="avatar" class="mx-2" style="width: 50px; height: 50px;" />
            </template>
            <HomeStories v-else-if="loggedIn" :stories="stories" />
          </ClientOnly>
        </template>

        <!-- POSTS -->
        <template v-if="loading.post">
          <v-col cols="12" v-for="n in 2" :key="n" style="min-height: 200px;">
            <v-skeleton-loader type="card" class="pa-4 rounded-xl" height="200" />
          </v-col>
        </template>

        <template v-else>
          <v-infinite-scroll :items="postStore.posts" mode="manual" @load="loadMore">
            <HomePosts
              v-for="(item, index) in postStore.posts"
              :key="item.id"
              :post="item"
              @post-updated="reloadPosts"
              @post-deleted="reloadPosts"
            />
            <template #load-more="{ props }">
              <v-btn
                v-if="hasMore"
                icon="mdi-refresh"
                class="text-primary"
                variant="text"
                v-bind="props"
                aria-label="Load more posts"
              />
            </template>
          </v-infinite-scroll>
        </template>
      </v-col>

      <!-- RIGHT SIDEBAR -->
      <v-col cols="12" lg="4" style="min-height: 600px;">
        <v-card class="mx-3 mt-2 mb-4" rounded="xl" variant="text" elevation="10" style="min-height: 80px;">
          <div class="d-flex justify-center">
            <v-btn
              class="font-weight-bold w-100"
              color="primary"
              height="80"
              variant="text"
              @click="dialogCreateWorld = true"
              aria-label="Build your World Bro"
            >
              <h6 class="text-h6 font-weight-bolder mb-0">
                Build your World Bro
              </h6>
            </v-btn>
          </div>
        </v-card>

        <CreateWorldDialog v-model="dialogCreateWorld" :plugins="plugins" />

        <ClientOnly>
          <template v-if="loading.plugin">
            <v-skeleton-loader type="card" class="mx-3 rounded-xl" height="300" />
          </template>
          <template v-else>
            <NuxtLazyHydrate when-visible once>
              <Dashboard />
            </NuxtLazyHydrate>
          </template>
        </ClientOnly>
      </v-col>
    </v-row>
  </v-container>
</template>
