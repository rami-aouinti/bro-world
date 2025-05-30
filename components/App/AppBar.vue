<script setup lang="ts">
import { mergeProps } from 'vue'

const theme = useTheme()
const drawer = useState('drawer')
const route = useRoute()
const breadcrumbs = computed(() => {
  return route!.matched
    .filter((item) => item.meta && item.meta.title)
    .map((r) => ({
      title: r.meta.title!,
      disabled: r.path === route.path || false,
      to: r.path,
    }))
})
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const { loggedIn, clear, user } = useUserSession()

function back() {
  window.history.back()
}
function refresh() {
  window.location.reload()
}
const router = useRouter()
const canGoBack = ref(false)
router.afterEach(() => {
  canGoBack.value = window.navigation.canGoBack
})
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer />
    <div class="d-none d-sm-flex align-center">
      <v-btn
        v-tooltip="{ text: 'Go Back' }"
        :disabled="!canGoBack"
        icon="ph:arrow-left"
        @click="back()"
      />
      <v-btn icon="ph:arrow-clockwise" @click="refresh()" />
    </div>
    <div id="app-bar" />
    <v-switch
      v-model="isDark"
      color=""
      hide-details
      density="compact"
      inset
      false-icon="mdi-white-balance-sunny"
      true-icon="mdi-weather-night"
      class="opacity-80"
    />
    <v-defaults-provider
      :defaults="{ VBtn: { rounded: 0, class: 'px-5', size: 'x-small' } }"
    >
      <v-btn
        v-tooltip="`${isFullscreen ? 'Full Screen' : ''}`"
        style="height: 31px; padding-top: 2px"
        large
        :icon="isFullscreen ? 'ph:corners-in' : 'ph:corners-out'"
        @click="toggleFullscreen()"
      />
    </v-defaults-provider>
    <v-menu location="bottom">
      <template #activator="{ props: menu }">
        <v-tooltip location="bottom">
          <template #activator="{ props: tooltip }">
            <v-btn icon v-bind="mergeProps(menu, tooltip)" class="ml-1">
              <v-icon v-if="!loggedIn" icon="mdi-account-circle" size="36" />
              <v-avatar v-else color="primary" size="36">
                <v-img :src="user?.avatar_url ?? user?.picture" />
              </v-avatar>
            </v-btn>
          </template>
          <span>{{ loggedIn ? user!.login : 'User' }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-if="!loggedIn"
          title="Login"
          prepend-icon="mdi-login"
          href="/login"
        />
        <v-list-item
          v-else
          title="Logout"
          prepend-icon="mdi-logout"
          @click="clear"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
