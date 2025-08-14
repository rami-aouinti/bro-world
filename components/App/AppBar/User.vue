<script setup lang="ts">
import { mergeProps, ref, computed } from 'vue'
import { useLocalePath } from '#i18n'
import { useI18n } from 'vue-i18n'
import UserAvatar from "~/components/App/UserAvatar.vue"

const { t, locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
const { loggedIn, clear, user, pending } = useUserSession()
const localePath = useLocalePath()
const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: v => { theme.global.name.value = v ? 'dark' : 'light' },
})
const loggedUser = ref([
  { icon: "mdi-account-settings-variant", color: 'default', path: "/setting", title: "setting" },
  { icon: "mdi-network", color: 'info', path: "/plugin", title: "apps" },
  { icon: "mdi-calendar", color: 'warning', path: "/calendar", title: "calendar" },
  { icon: "mdi-help-circle", color: 'danger', path: "/help", title: "help" },
  { icon: "mdi-information", color: 'light', path: "/about", title: "about" },
  { icon: "mdi-message", color: 'pink', path: "/contact", title: "contact" },
])

const notLoggedUser = ref([
  { icon: "mdi-account", color: 'white', path: "/login", title: "login" },
  { icon: "mdi-account-plus", color: 'white', path: "/register", title: "register" },
  { icon: "mdi-network", color: 'white', path: "/plugin", title: "apps" },
  { icon: "mdi-help-circle", color: 'white', path: "/help", title: "help" },
  { icon: "mdi-information", color: 'white', path: "/about", title: "about" },
  { icon: "mdi-contact-mail", color: 'white', path: "/contact", title: "contact" },
])
</script>

<template>
  <v-menu location="bottom" transition="slide-y-transition" offset-y offset-x width="220">
    <template #activator="{ props: menu }">
      <v-btn aria-label="account" title="account" color="secondary" icon v-bind="mergeProps(menu)" class="ml-0">
        <v-icon v-if="!loggedIn" icon="mdi-account-circle" size="26" />
        <UserAvatar v-if="loggedIn && !pending" :user="user" size="26" color="primary" />
      </v-btn>
    </template>

    <!-- Menu si connecté -->
    <v-list class="pa-1" v-if="loggedIn">
      <v-list-item
        class="list-item-hover-active d-flex align-items-center border-radius-md primary-list-item"
        :to="localePath('/profile')"
        :class="{ 'rtl-item': isRtl }"
      >
        <v-list-item-title class="text-body-2 font-weight-600 mb-0">
          <v-row>
            <v-col>
              <v-icon color="success" class="me-2">mdi-face</v-icon>
            </v-col>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">
                {{ t('navbar.profile') }}
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="(item, i) in loggedUser"
        :key="i"
        :to="localePath(item.path)"
        class="list-item-hover-active d-flex align-items-center border-radius-md primary-list-item"
        :class="{ 'rtl-item': isRtl }"
      >
        <v-list-item-title class="text-body-2 font-weight-600 mb-0">
          <v-row>
            <v-col>
              <v-icon :color="isDark ? 'white' : 'default'" class="me-2">{{ item.icon }}</v-icon>
            </v-col>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2" :class="isDark ? 'text-white' : 'text-default'">
                {{ t(`navbar.${item.title}`) }}
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item
        class="list-item-hover-active d-flex align-items-center border-radius-md primary-list-item"
        @click="clear"
        :class="{ 'rtl-item': isRtl }"
      >
        <v-list-item-title class="text-body-2 font-weight-600 mb-0">
          <v-row>
            <v-col>
              <v-icon color="danger" class="me-2">mdi-logout</v-icon>
            </v-col>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">
                {{ t('navbar.logout') }}
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Menu si non connecté -->
    <v-list class="pa-1" v-else>
      <v-list-item
        v-for="(item, i) in notLoggedUser"
        :key="i"
        :to="localePath(item.path)"
        class="list-item-hover-active d-flex align-items-center border-radius-md primary-list-item"
        :class="{ 'rtl-item': isRtl }"
      >
        <v-list-item-title class="text-body-2 font-weight-600 mb-0">
          <v-row>
            <v-col>
              <v-icon :color="item.color || 'primary'" class="me-2">{{ item.icon }}</v-icon>
            </v-col>
            <v-col>
              <h6 class="text-sm font-weight-normal ms-2 text-typo">
                {{ t(`navbar.${item.title}`) }}
              </h6>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
/* RTL support */
.rtl-item {
  direction: rtl;
}

.rtl-item .v-list-item__prepend {
  order: 2;
  margin-inline-start: 12px !important;
  margin-inline-end: 0 !important;
}

.rtl-item .v-list-item__content {
  order: 1;
  text-align: right;
}

.rtl-item .v-icon {
  vertical-align: middle;
}
</style>
