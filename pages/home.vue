<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
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
const rightDrawer = ref(false)

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
const drawerWidth = ref('calc(100vw - 100px)')

onMounted(async () => {
  try {
    await loadInitialPosts()
    drawerWidth.value = `calc(100vw - 100px)`
    await nextTick()
    await loadStories()
    await fetchPlugins()
  } catch (e) {
    console.error('Erreur onMounted:', e)
  } finally {
    loading.value.user = false
  }
})
</script>

<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'" class="pa-0">
    <!-- ✅ Flex container principal -->
    <div class="d-flex" style="min-height: 100vh;">

      <!-- ✅ Contenu principal qui s’adapte automatiquement -->
      <div
        class="flex-grow-1"
        :style="$vuetify.display.lgAndUp ? 'padding-right: 400px;' : ''"
      >
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <LoaderStatusBanner v-if="loading.user" />
              <template v-else-if="loggedIn && !user?.enabled">
                <NuxtLazyHydrate when-visible once>
                  <UserStatusBanner />
                </NuxtLazyHydrate>
              </template>
            </v-col>

            <!-- Haut -->
            <v-col cols="12">
              <template v-if="loading.user">
                <LoaderPost />
              </template>
              <template v-else>
                <NewPost v-if="loggedIn" @post-created="reloadPosts" @story-created="reloadStories" />
                <ClientOnly>
                  <template v-if="loading.story">
                    <v-skeleton-loader type="avatar" class="mx-2" style="width: 50px; height: 50px;" />
                  </template>
                  <template v-else-if="loggedIn">
                    <NuxtLazyHydrate when-visible once>
                      <HomeStories :stories="stories" />
                    </NuxtLazyHydrate>
                  </template>
                </ClientOnly>
              </template>
            </v-col>
            <!-- Posts -->
            <v-col cols="12">
              <template v-if="loading.post">
                <v-skeleton-loader
                  type="card"
                  class="pa-4 rounded-xl mb-4"
                  height="200"
                  v-for="n in 2"
                  :key="n"
                />
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
          </v-row>
        </v-container>
      </div>

      <!-- ✅ Colonne droite fixe -->
      <div
        class="d-none d-lg-block"
        style="position: fixed; top: 80px; right: 0; width: 400px; height: calc(100vh - 100px); overflow-y: auto; padding: 0 8px;"
      >
        <v-card class="mx-3 mb-4" rounded="xl" variant="text" elevation="10">
          <div class="d-flex justify-center">
            <v-btn
              class="font-weight-bold w-100"
              color="primary"
              height="80"
              variant="text"
              @click="dialogCreateWorld = true"
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
            <Dashboard />
          </template>
        </ClientOnly>
      </div>
    </div>
    <!-- ✅ Drawer mobile pour sidebar droite -->
    <v-navigation-drawer
      v-model="rightDrawer"
      location="right"
      :width="rightDrawer ? drawerWidth : 0"
      temporary
      touchless="false"
      scrim="rgba(0, 0, 0, 0.4)"
      class="d-lg-none"
      style="
    top: 70px;
    height: calc(100vh - 120px);
    border-top-left-radius: 65px;
    border-bottom-left-radius: 65px;
    overflow: hidden;
  "
    >
      <!-- ✅ Contenu scrollable -->
      <div style="height: 100%; overflow-y: auto; padding: 16px;">
        <v-card class="mx-3 mb-4" rounded="xl" variant="text" elevation="10">
          <div class="d-flex justify-center">
            <v-btn
              class="font-weight-bold w-100"
              color="primary"
              height="80"
              variant="text"
              @click="dialogCreateWorld = true"
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
            <Dashboard />
          </template>
        </ClientOnly>
      </div>
    </v-navigation-drawer>
    <v-btn
      :icon="rightDrawer ? 'mdi-close' : 'mdi-world'"
      color="primary"
      class="
      d-lg-none my-1
      fixed-plugin-button
      position-fixed
"
      @click="rightDrawer = !rightDrawer"
      aria-label="Open sidebar"
    >
    </v-btn>
  </v-container>
</template>
