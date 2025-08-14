<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import {useI18n} from 'vue-i18n'
import LoaderProfile from '~/components/App/Loader/Profile/LoaderProfile.vue'
import { useUserStore } from '~/stores/useUserStore'
import { usePostStore } from '~/stores/usePostStore'
import PostCard from '~/components/Blog/PostCard.vue'
import { useEventStore } from '~/stores/useEventStore'
import { Qalendar } from 'qalendar'
import dayjs from 'dayjs'

const postStore = usePostStore()
const eventStore = useEventStore()
const userStore = useUserStore()
const canTeleport = ref(false)
const { t } = useI18n()
const { user } = await useUserSession()

const { data: profile, pending, error, refresh } = await useAsyncData(
  'profile-' + user.value.id,
  async () => await userStore.fetchProfile(user.value.username),
  {
    watch: [() => user.value.id],
    server: true
  }
)

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const isLoading = ref(false)
const active = ref([])
const avatar = ref(null)
const open = ref([])
const users = ref([])
const loading = ref({
  user: true,
  post: true,
})
const items = computed(() => [
  {
    name: 'Friends',
    children: profile.friends,
    id: 'user',
  },
])
const currentPage = ref(1)
const selected = computed(() => {
  if (!active.value.length) return undefined

  const id = active.value[0]

  return users.value.find(user => user.id === id)
})
const conversations = ref<any[]>([])
const search = ref('')

const fetchConversations = async () => {
  const data = await $fetch('/api/messenger/conversations')
  console.log(data)
  conversations.value = data

  console.log(conversations)

}
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const totalPages = computed(() => Math.ceil(postStore.total / postStore.limit))
const hasMore = ref(true)
const events = ref<any[]>([])
const calendarConfig = ref({
  week: { startsOn: 'monday', nDays: 7, scrollToHour: 5 },
  month: { showTrailingAndLeadingDates: false },
  defaultMode: 'month',
  isSilent: true,
  showCurrentTime: true,
})

const fetchEvents = async () => {
  try {
    const data = await eventStore.fetchEventsFromApi()
    if (Array.isArray(data)) {
      events.value = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        time: {
          start: dayjs(e.start).format('YYYY-MM-DD HH:mm'),
          end: dayjs(e.end).format('YYYY-MM-DD HH:mm'),
        },
        colorScheme: e.color || 'meetings',
      }))
    }
  } catch (e) {
    console.error('Erreur fetch events:', e)
  }
}
const checkFollowStatus = async (userId: string): Promise<number> => {
  try {
    const friends = profile.value?.friends
    if (!friends || typeof friends !== 'object') return 0
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
    let newPosts: any[] = []
    newPosts = await postStore.fetchMyPosts(1, postStore.limit, user.value.id)

    if (Array.isArray(newPosts)) {
      const postsWithStatus = await Promise.all(
        newPosts.map(async (post: any) => {
          post.status = (post.user?.id !== user.value?.id)
            ? await checkFollowStatus(post.user.id)
            : 0
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


const reloadPosts = async () => {
  await postStore.invalidateMyPostCache(user.value?.id)
  await loadInitialPosts()
}

const editPost = (post: any) => {
  if (!post?.id) return
  const index = postStore.posts.findIndex((p: any) => p.id === post.id)
  index !== -1 ? (postStore.posts[index] = post) : postStore.appendPost({ data: post })
  reloadPosts()
}
watch(selected, async () => {
  await fetchConversations()
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  await fetchConversations()
  await loadInitialPosts()
  await fetchEvents()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
const deletePost = (postId: string | number) => {
  if (!postId) return
  postStore.posts = postStore.posts.filter((p: any) => p.id !== postId)
  reloadPosts()
}
const loadMore = async ({ done }) => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  const nextPage = currentPage.value + 1
  const newPosts = await postStore.fetchPosts(nextPage, postStore.limit, user.value?.id)
  const postsWithStatus = await Promise.all(
    newPosts.map(async (post: any) => {
      post.status = (post.user?.id !== user.value?.id)
        ? await checkFollowStatus(post.user.id)
        : 0
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
const accountSettings = ref([
  { text: 'emailWhenFollow', switchState: true },
  { text: 'emailWhenAnswer', switchState: false },
])

const applicationSettings = ref([
  { text: 'newProjects', switchState: true },
  { text: 'monthlyUpdates', switchState: false },
])

definePageMeta({
  layout: 'default',
  description: 'Profile page',
  breadcrumb: 'disabled',
  title: 'Profile',
  meta: [
    { name: 'description', content: 'User profile page with personal information and settings.' },
    { name: 'keywords', content: 'profile, user, settings' },
  ],
  head: {
    title: 'Profile',
    meta: [
      { name: 'description', content: 'User profile page with personal information and settings.' },
      { name: 'keywords', content: 'profile, user, settings' },
    ],
  },
  middleware: 'auth',
  scrollToTop: true,
})
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <div class="text-subtitle-1 text-uppercase font-weight-bold mb-1" :class="isDark ? 'text-white' : 'text-default'">
            {{ t('profile.account') }}
          </div>
          <v-list class="pa-0 bg-transparent" lines="one">
            <Motion preset="slideVisibleLeft" :duration="400">
              <v-list-item class="setting-line bg-transparent">
                <v-list-item-title class="setting-label" :class="isDark ? 'text-white' : 'text-default'">
                  <v-icon class="me-3" color="primary">mdi-email</v-icon>
                  {{ profile?.email ?? t('profile.notProvided') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="setting-line bg-transparent">
                <v-list-item-title class="setting-label" :class="isDark ? 'text-white' : 'text-default'">
                  <v-icon class="me-3" color="primary">mdi-cellphone</v-icon>
                  {{ profile?.profile?.phone ?? t('profile.notProvided') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="setting-line bg-transparent">
                <v-list-item-title class="setting-label" :class="isDark ? 'text-white' : 'text-default'">
                  <v-icon class="me-3" color="primary">mdi-map-marker</v-icon>
                  {{ profile?.locale ?? t('profile.notProvided') }}
                </v-list-item-title>
              </v-list-item>
            </Motion>
          </v-list>

          <div class="text-subtitle-1 text-uppercase font-weight-bold mb-1" :class="isDark ? 'text-white' : 'text-default'">
            Settings
          </div>

          <v-list class="pa-0 bg-transparent" lines="one">
            <MotionGroup preset="slideVisibleLeft" :duration="800">
            <v-list-item
                v-for="setting in [...accountSettings, ...applicationSettings]"
                :key="setting.text"
                class="setting-line bg-transparent"
              >
                <v-list-item-title class="setting-label" :class="isDark ? 'text-white' : 'text-default'">
                  {{ t(`profile.settings.${setting.text}`) }}
                </v-list-item-title>
                <template #append>
                  <v-switch
                    v-model="setting.switchState"
                    hide-details
                    color="primary"
                    density="compact"
                    class="switch mx-2"
                  />
                </template>
              </v-list-item>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <div v-if="pending">
      <LoaderProfile />
    </div>
    <div v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-card
            class="plugin-card d-flex flex-column mb-4"
            elevation="10"
            rounded="xl"
            variant="text"
            hover
            max-width="360"
          >
            <v-card-title class="text-h6 text-default font-weight-bold">
              Blogs
            </v-card-title>

            <v-card-subtitle class="text-grey-darken-1 px-4">
              Sub
            </v-card-subtitle>

            <v-card-text class="text-body-2 px-6 py-2">
              Content
            </v-card-text>
          </v-card>
          <h2 class="text-h6 font-weight-bold mb-4" :class="isDark ? 'text-white' : 'text-default'">{{ t('profile.myPosts') }}</h2>
          <template v-if="loading.post">
            <v-skeleton-loader type="card" class="mb-4" v-for="n in 3" :key="n" />
          </template>
          <template v-else>
            <v-infinite-scroll :items="postStore.posts" mode="manual" @load="loadMore">
              <PostCard
                v-for="(item, index) in postStore.posts"
                :key="item.id"
                :post="item"
                :friends="profile?.friends"
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
        <v-col cols="12" md="6">
          <v-card
            class="plugin-card d-flex flex-column mb-4"
            elevation="10"
            rounded="xl"
            variant="text"
            hover
            max-width="360"
          >
            <v-card-title class="text-h6 text-default font-weight-bold">
              Blogs
            </v-card-title>

            <v-card-subtitle class="text-grey-darken-1 px-4">
              Sub
            </v-card-subtitle>

            <v-card-text class="text-body-2 px-6 py-2">
              Content
            </v-card-text>
          </v-card>
          <h2 class="text-h6 font-weight-bold mb-4" :class="isDark ? 'text-white' : 'text-default'">{{ t('profile.myEvents') }}</h2>
          <Qalendar :events="events" :config="calendarConfig" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<style scoped>
/* This is for documentation purposes and will not be needed in your application */
::v-deep(.v-application__wrap) {
  min-height: 0 !important;
}
.info-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.label {
  font-weight: 600;
  color: #212121;
}
.value {
  color: #9e9e9e;
  font-weight: 500;
}
.setting-line {
  padding-left: 0;
  padding-right: 0;
  border-radius: 8px;
  transition: background 0.2s;
}
.setting-line:hover {
  background: #f5f5f5;
}
.setting-label {
  font-size: 0.875rem;
  color: #424242;
}
.switch {
  margin-inline-end: 0.5rem;
}
.demo-panel-static,
.demo-panel-relative {
  margin: 0 80px 50px;
  padding: 24px;
  min-height: 300px;
}
.demo-panel-static {
  position: static;
}
.demo-panel-relative {
  position: relative;
}

.v-selection-control--disabled,
.v-input--disabled .v-selection-control {
  opacity: .1;
}

.v-radio {
  flex-grow: 0 !important;
}

h5 {
  margin-bottom: 12px;
}

code {
  display: block;
  font-size: .8rem;
  margin-top: 12px;
}

::v-deep(.v-label) {
  margin-left: 8px;
}
.plugin-card {
  border-radius: 24px;
  overflow: hidden;
  padding-top: 0;
  background-color: var(--v-theme-surface);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(220, 9, 160, 0.1);
}
.plugin-card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgb(3, 32, 61);
}
</style>
<style>
@import "qalendar/dist/style.css";
</style>
