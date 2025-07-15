<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { ref, computed, onMounted, nextTick } from 'vue'
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
import DrawerManager from "~/components/App/AppBar/DrawerManager.vue";
import {useUserStore} from "~/stores/useUserStore";
definePageMeta({
  layout: 'default',
  breadcrumb: 'disabled',
  title: 'Home',
  description: 'Welcome to the home page where you can find the latest posts and stories.',
  meta: [
    { name: 'description', content: 'Welcome to the home page where you can find the latest posts and stories.' },
    { name: 'keywords', content: 'home, posts, stories, social' },
  ],
  head: {
    title: 'Home',
    meta: [
      { name: 'description', content: 'Welcome to the home page where you can find the latest posts and stories.' },
      { name: 'keywords', content: 'home, posts, stories, social' },
    ],
  },
  scrollToTop: true,
})

const { locale } = useI18n()
const { user, loggedIn } = useUserSession()
const postStore = usePostStore()
const storyStore = useStoryStore()

const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)
const stories = ref<any[]>([])
const profile = ref<any[]>([])
const userStore = useUserStore();

const items = [
  { title: "Settings", icon: "mdi-account-settings-variant", color: "deep-purple", path: "/setting" },
  { title: "Calendar", icon: "mdi-calendar", color: "amber", path: "/calendar" },
  { title: "Shop", icon: "mdi-storefront", color: "pink", path: "/shop" },
  { title: "Jobs", icon: "mdi-briefcase", color: "blue", path: "/jobs" },
  { title: "CRM", icon: "mdi-database", color: "teal", path: "/crm" },
  { title: "Courses", icon: "mdi-school", color: "green", path: "/courses" },
  { title: "Quiz", icon: "mdi-gamepad-variant", color: "indigo", path: "/quiz" },
  { title: "My Files", icon: "mdi-folder", color: "orange", path: "/user/channel/media" },
  { title: "Recent", icon: "mdi-history", color: "cyan", path: "/recent" },
];

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

const loadProfile = async (): Promise<number> => {
  if (user?.value) {
    const  data = await userStore.fetchProfile(user.value.id, user.value.username)
    if (data) {
      profile.value = data
    }
  }
}

const checkFollowStatus = async (userId: string): Promise<number> => {
  try {
    const friends = profile.value?.friends
    if (!friends) return 0

    for (const friend of Object.values(friends)) {
      if (friend.user === userId) return friend.status
    }

    return 0
  } catch (e) {
    console.error("Error checking follow status:", e)
    return 0
  }
}

const loadInitialPosts = async () => {
  try {
    const newPosts = await postStore.fetchPosts(1, postStore.limit)

    if (newPosts && Array.isArray(newPosts)) {
      // Ajouter status async pour chaque post
      const postsWithStatus = await Promise.all(
        newPosts.map(async (post: any) => {
          if (post.user?.id !== user.value?.id) {
            post.status = await checkFollowStatus(post.user.id)
          } else {
            post.status = 0
          }
          return post
        })
      )

      postStore.setPosts({
        data: postsWithStatus,
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
  const postsWithStatus = await Promise.all(
    newPosts.map(async (post: any) => {
      if (post.user?.id !== user.value?.id) {
        post.status = await checkFollowStatus(post.user.id)
      } else {
        post.status = 0
      }
      return post
    })
  )
  if (postsWithStatus?.length) {
    postStore.appendPosts(postsWithStatus)
    currentPage.value = nextPage
    done('ok')
  } else {
    done('empty')
  }

  hasMore.value = totalPages.value > nextPage
  isLoading.value = false
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

const addPost = (post: any) => {
  if (!post || typeof post !== 'object' || !post.id) {
    console.warn('[reloadPosts] Post non valide :', post)
    return
  }

  postStore.appendPost({ data: post })
  reloadPosts()
}

const editPost = (post: any) => {
  if (!post || typeof post !== 'object' || !post.id) {
    console.warn('[editPost] Post non valide :', post)
    return
  }

  const index = postStore.posts.findIndex((p: any) => p.id === post.id)

  if (index !== -1) {
    postStore.posts[index] = post
  } else {
    console.warn('[editPost] Post non trouvé dans le store, ajout en fallback')
    postStore.appendPost({ data: post })
  }
  reloadPosts()
}

const deletePost = (postId: string | number) => {
  if (!postId) {
    console.warn('[deletePost] postId invalide:', postId)
    return
  }

  postStore.posts = postStore.posts.filter((p: any) => p.id !== postId)
  reloadPosts()
}

const reloadPosts = () => {
  postStore.fetchPosts()
}

const reloadStories = async () => {
  await loadStories()
  Notify.success("Story created!", user?.photo ?? 'https://placehold.net/avatar-5.svg', `/user/${user.username}`)
}

onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    await loadProfile()
    await loadInitialPosts()
    await nextTick()
    await loadStories()
  } catch (e) {
  } finally {
    loading.value.user = false
  }
})
</script>

<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'" class="pa-0">
    <client-only>
      <teleport to="#menu-bar-world">
        <v-list
          style="background-color: transparent;"
          :lines="false"
          nav
        >
          <v-list-item
            v-for="(item, i) in items"
            :to="item.path"
            :key="i"
            :value="item"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon :color="item.color" :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </teleport>
    </client-only>
    <div
      class="flex-grow-1"
      style="max-width: 100%"
      :style="$vuetify.display.lgAndUp ? 'padding-right: 360px;' : ''"
    >
      <v-row justify="center" class="align-center justify-center" style="max-width: 100%;">
        <v-col cols="12">
          <LoaderStatusBanner v-if="loading.user" />
          <template v-else-if="loggedIn && !user?.enabled">
            <NuxtLazyHydrate when-visible once>
              <UserStatusBanner />
            </NuxtLazyHydrate>
          </template>

          <template v-if="loading.user">
            <LoaderPost />
          </template>
          <template v-else>
            <NewPost v-if="loggedIn" @post-created="(post) => addPost(post)" @story-created="reloadStories" />
          </template>
          <ClientOnly>
            <template v-if="loading.story">
              <v-skeleton-loader type="avatar" class="mx-2" style="width: 50px; height: 50px;" />
            </template>
            <template v-else-if="loggedIn">
              <NuxtLazyHydrate when-visible once>
                <HomeStories v-if="stories.length" :stories="stories" />
              </NuxtLazyHydrate>
            </template>
          </ClientOnly>
          <template v-if="loading.post">
            <v-skeleton-loader
              type="card"
              class="pa-4 rounded-xl mb-4"
              height="200"
              v-for="n in 10"
              :key="n"
            />
          </template>
          <template v-else>
            <v-infinite-scroll :items="postStore.posts" mode="manual" @load="loadMore">
              <HomePosts
                v-for="(item, index) in postStore.posts"
                :key="item.id"
                :post="item"
                :index="index"
                @post-reload="reloadPosts"
                @post-updated="(post) => editPost(post)"
                @post-deleted="(post) => deletePost(post)"
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
    </div>
    <div
      class="d-none d-lg-block"
      style="position: fixed; top: 76px; right: 0; width: 400px; padding: 0 8px; overflow-y: auto; max-height: calc(100vh - 76px);"
    >

    <ClientOnly>
        <template v-if="loading.user">
          <v-skeleton-loader type="card" class="mx-3 rounded-xl" height="300" />
        </template>
        <template v-else>
          <Dashboard />
        </template>
      </ClientOnly>
    </div>
    <DrawerManager />
  </v-container>
</template>
