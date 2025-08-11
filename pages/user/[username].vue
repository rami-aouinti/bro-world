<script setup lang="ts">
import { useRoute } from 'vue-router'
import LoaderUser from "~/components/App/Loader/Profile/LoaderUser.vue";
import {useUserStore} from "~/stores/useUserStore";
import {useI18n} from 'vue-i18n'
const { t } = useI18n()
import { onMounted, ref, watch, computed, nextTick } from 'vue'
const route = useRoute()
const { user } = await useUserSession()
const profile = ref<any>(null)
const isFollowing = ref<boolean | null>(null)
const isOwnProfile = ref(false)
const pending = ref(false)
const username = route.params.username
const avatarUrl = ref('')
const canTeleport = ref(false)
const userStore = useUserStore()
const loadProfile = async () => {
  pending.value = true
  const data  = await userStore.fetchProfile(username)
  if (data) {
    avatarUrl.value = data?.photo ?? 'https://placehold.net/avatar-5.svg'
    profile.value = data
    isOwnProfile.value = user?.username === profile.value.username
    if (!isOwnProfile.value) await checkFollowStatus()
    isOwnProfile.value = user?.username === profile.value.username
  }
  pending.value = false
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
const checkFollowStatus = async () => {
  const { data } = await useFetch(`/api/follow/status/${profile.value.id}`)
  if (data.value) isFollowing.value = data.value
}

async function toggleFollow() {
  const { error } = await useFetch(`/api/follow/follow/${profile.value.id}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

async function toggleUnFollow() {
  const { error } = await useFetch(`/api/follow/unfollow/${profile.value.id}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

watch(username, () => {
  loadProfile()
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  await loadProfile()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})

const accountSettings = ref([
  { text: 'Email me when someone follows me', switchState: true },
  { text: 'Email me when someone answers on my post', switchState: false },
])

const applicationSettings = ref([
  { text: 'New launches and projects', switchState: true },
  { text: 'Monthly product updates', switchState: false },
])

const conversations = ref([
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
])
definePageMeta({
  layout: 'default',
  description: 'Profile page',
  breadcrumb: 'disabled',
})
</script>
<template>
  <v-container
    fluid
  >
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-1">
          <v-row align="center" class="pa-0 ma-0">
            <!-- Avatar -->
            <v-col cols="auto">
              <v-avatar size="40" class="border-primary border-lg rounded-circle">
                <NuxtImg :lazy-src="'/img/person.png'" format="webp" loading="lazy" cover width="40" height="40" :src="avatarUrl" alt="Avatar" />
              </v-avatar>
            </v-col>

            <!-- Nom et Type -->
            <v-col cols="auto">
              <div>
                <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                  {{ profile?.firstName }} {{ profile?.lastName }}
                </h6>
                <h6 class="mb-1 text-h7 text-typo font-weight-bold">
                  {{
                    profile?.profile?.title
                  }}
                </h6>
              </div>
            </v-col>
          </v-row>
          <div class="d-flex align-center justify-center mx-3 my-2">
            <div  v-if="!isOwnProfile">
              <v-btn
                class="me-2"
                variant="outlined"

                color="secondary"

                to="/inbox"
              >
                Inbox
              </v-btn>
              </div>
            <div  v-if="!isOwnProfile && isFollowing">
              <v-btn


                variant="outlined"
                color="primary"
                @click="toggleUnFollow"
              >
                Unfollow
              </v-btn>
            </div>
            <div v-if="!isOwnProfile && !isFollowing">

              <v-btn


                variant="outlined"
                color="primary"
                @click="toggleFollow"
              >
                Follow
              </v-btn>
            </div>




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
        </div>
      </teleport>
    </client-only>
    <div v-if="pending">
      <LoaderUser />
    </div>
    <v-row v-else >
    </v-row>
  </v-container>
</template>
