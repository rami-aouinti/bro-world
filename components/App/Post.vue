<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePostStore } from '~/stores/usePostStore'
import { useStoryStore } from '~/stores/useStoryStore'

import HomeStories from '~/pages/home/HomeStories.vue'
import NewPost from '~/pages/home/post/NewPost.vue'
import HomePosts from '~/pages/home/HomePosts.vue'
import LoaderPost from '~/components/App/Loader/Home/LoaderPost.vue'
import {useUserStore} from "~/stores/useUserStore";

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
  try {
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
</template>
