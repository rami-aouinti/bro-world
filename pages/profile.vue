<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import {useI18n} from 'vue-i18n'
import LoaderProfile from '~/components/App/Loader/Profile/LoaderProfile.vue'
import {useUserStore} from '~/stores/useUserStore'
const userStore = useUserStore()
const canTeleport = ref(false)
const { t } = useI18n()
const { user } = await useUserSession()
const avatarUrl = ref('')

const { data: profile, pending, error, refresh } = await useAsyncData(
  'profile-' + user.value.id,
  async () => await userStore.fetchProfile(user.value.username),
  {
    watch: [() => user.value.id],
    server: true
  }
)

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

const active = ref([])
const avatar = ref(null)
const open = ref([])
const users = ref([])

const items = computed(() => [
  {
    name: 'Friends',
    children: profile.friends,
    id: 'user',
  },
])

const selected = computed(() => {
  if (!active.value.length) return undefined

  const id = active.value[0]

  return users.value.find(user => user.id === id)
})
const activeConversation = ref<any | null>(null)
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

watch(selected, async () => {
  await fetchConversations()
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  await fetchConversations()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})

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
      </v-row>
      <v-row>
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
</style>
