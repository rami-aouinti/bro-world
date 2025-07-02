<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePostStore } from '~/stores/usePostStore'

import UserStatusBanner from '~/components/App/UserStatusBanner.vue'
import HomeStories from '~/pages/home/HomeStories.vue'
import NewPost from '~/pages/home/post/NewPost.vue'
import HomePosts from '~/pages/home/HomePosts.vue'
import Dashboard from '~/pages/home/Dashboard.vue'
import LoaderStatusBanner from '~/components/App/Loader/Home/LoaderStatusBanner.vue'
import LoaderPost from '~/components/App/Loader/Home/LoaderPost.vue'
import CreateWorldDialog from "~/components/App/Home/CreateWorldDialog.vue";

const { locale } = useI18n()
const { user, loggedIn } = useUserSession()

const postStore = usePostStore()

const dialogCreateWorld = ref(false)
const loadingUser = ref(true)
const loadingPost = ref(true)
const loadingPlugin = ref(true)
const isLoading = ref(false)
const hasMore = ref(true)
const pending = ref(true)
const currentPage = ref(1)
const newPostsLoaded = ref(true)

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const totalPages = computed(() =>
  Math.ceil(postStore.total / postStore.limit)
)

const init = async () => {
  const newPosts = await postStore.fetchPosts(1, postStore.limit)
  if (newPosts) {
    postStore.setPosts({
      data: newPosts,
      page: 1,
      limit: postStore.limit,
      count: postStore.total,
    })
    hasMore.value = totalPages.value >= currentPage.value
    pending.value = false
    newPostsLoaded.value = false
    loadingPost.value = false
  }
}

const reloadPosts = async (data: any) => {
  loadingPost.value = true
  postStore.appendPost({ data })
  currentPage.value = 1
  loadingPost.value = false
}

const loadMore = async ({ done }) => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  pending.value = true

  const nextPage = currentPage.value + 1
  const newPosts = await postStore.fetchPosts(nextPage, postStore.limit)

  if (newPosts.length > 0) {
    postStore.appendPosts(newPosts)
    currentPage.value = nextPage
    isLoading.value = false
    done('ok')
  }
  hasMore.value = Math.ceil(postStore.total / postStore.limit) > nextPage
  pending.value = false
}

const plugins = ref<any[]>([])

const fetchPlugins = async () => {
  if (!loggedIn.value) return
  try {
    const data = await $fetch('/api/plugin/profile/get')
    if (data) {
      plugins.value = data
      loadingPlugin.value = false
    }
  } catch (e) {
    console.error('Erreur lors du fetch des plugins:', e)
    loadingPlugin.value = false
  }
}

onMounted(async () => {
  try {
    await init()
    await fetchPlugins()
    await nextTick()
  } catch (e) {
    console.error('Erreur dans onMounted de home.vue:', e)
  } finally {
    loadingUser.value = false
  }
})
</script>

<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingUser">
      <LoaderStatusBanner />
    </template>
    <template v-else>
      <UserStatusBanner v-if="loggedIn && !user?.enabled" />
    </template>

    <v-row>
      <v-col cols="12" lg="8">
        <template v-if="loadingUser">
          <LoaderPost />
        </template>

        <template v-else>
          <NewPost @post-created="reloadPosts" v-if="loggedIn" />
          <HomeStories v-if="loggedIn" />
        </template>

        <template v-if="loadingPost || loadingUser">
          <v-col cols="12" md="12" lg="12" v-for="n in 2" :key="n">
            <v-skeleton-loader
              type="card"
              class="pa-4 rounded-xl"
              height="200"
              rounded="xl"
            />
          </v-col>
        </template>
        <template v-else>
          <v-infinite-scroll :items="postStore.posts" mode="manual" @load="loadMore">
            <template v-for="(item, index) in postStore.posts" :key="item.id">
              <HomePosts
                @post-updated="reloadPosts"
                @post-deleted="reloadPosts"
                :post="item"
              />
            </template>
            <template v-slot:load-more="{ props }">
              <v-btn
                v-if="hasMore"
                icon="mdi-refresh"
                class="text-primary"
                variant="text"
                v-bind="props"
              ></v-btn>
            </template>
          </v-infinite-scroll>
        </template>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="xl" class="mx-3 mt-2 mb-4" variant="text" elevation="10">
          <div class="d-flex justify-center">
            <v-btn
              class="font-weight-bold w-100"
              color="primary"
              height="50"
              variant="text"
              @click="dialogCreateWorld = true"
            >
              <h6 class="text-h6 font-weight-bolder mb-0">Build your World Bro</h6>
            </v-btn>
          </div>
        </v-card>
        <CreateWorldDialog :plugins="plugins" v-model="dialogCreateWorld" />
        <ClientOnly>
          <Dashboard />
        </ClientOnly>
      </v-col>
    </v-row>
  </v-container>
</template>
