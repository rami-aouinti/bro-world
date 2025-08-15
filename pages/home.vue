<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import UserStatusBanner from '~/components/App/UserStatusBanner.vue'
import Dashboard from '~/pages/home/Dashboard.vue'
import LoaderStatusBanner from '~/components/App/Loader/Home/LoaderStatusBanner.vue'
import DrawerManager from "~/components/App/AppBar/DrawerManager.vue";
import {useUserStore} from "~/stores/useUserStore";
import BasisMinibar from "~/components/App/BasisMinibar.vue";
import Post from "~/components/App/Post.vue";
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
const isLoading = ref(false)
const profile = ref<any[]>([])
const userStore = useUserStore();
const canTeleport = ref(false)
const loading = ref({
  user: true,
  post: true,
  story: true,
  plugin: true,
})

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const loadProfile = async (): Promise<number> => {
  if (user?.value) {
    const  data = await userStore.fetchProfile(user.value.id, user.value.username)
    if (data) {
      profile.value = data
    }
  }
}

onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    await loadProfile()
    await nextTick()
    setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
  } catch (e) {
  } finally {
    loading.value.user = false
  }
})
</script>

<template>
  <v-container fluid :dir="isRtl ? 'rtl' : 'ltr'" class="pa-0">
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <BasisMinibar></BasisMinibar>
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
          <Post></Post>
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
