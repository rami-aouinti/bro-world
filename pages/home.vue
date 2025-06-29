<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
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
const { loggedIn, user } = useUserSession()

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
    hasMore.value = totalPages >= currentPage
    pending.value = false
    newPostsLoaded.value = false
    loadingPost.value = false
  }
}

const reloadPosts = async (data: any) => {
  loadingPost.value = true
  postStore.appendPost({data})
  currentPage.value = 1
  loadingPost.value = false
}


const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  pending.value = true

  const nextPage = currentPage.value + 1
  const newPosts = await postStore.fetchPosts(nextPage, postStore.limit)

  if (newPosts.length > 0) {
    postStore.appendPosts(newPosts)
    currentPage.value = nextPage
    isLoading.value = false
  }
  hasMore.value = Math.ceil(postStore.total / postStore.limit) > nextPage;
  pending.value = false
}

const plugins = ref<any[]>([])

const fetchPlugins = async () => {
  const { data } = await useFetch('/api/plugin/profile/get')
  if (data.value) {
    plugins.value = data.value
    loadingPlugin.value = false
  }
}

watch(loadingPlugin, () => {
  fetchPlugins()
}, { immediate: true })

watch(newPostsLoaded, init, { immediate: false })

onMounted(async () => {
  await init()
  await fetchPlugins
  await nextTick()
  loadingUser.value = false
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
          <HomePosts
            v-if="postStore.posts.length > 0"
            v-for="post in postStore.posts"
            :key="post.id"
            @post-updated="reloadPosts"
            @post-deleted="reloadPosts"
            :post="post"
          />
          <div class="d-flex justify-center mt-4" v-if="hasMore && !pending && postStore.posts.length > 0">
            <v-btn color="primary" :loading="isLoading" @click="loadMore">
              Load more
            </v-btn>
          </div>
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
