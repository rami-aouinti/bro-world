<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useLocalePath } from '#i18n'

const localePath = useLocalePath()

// Session (loggedIn est un ref -> utiliser .value)
const session = await useUserSession()
const { loggedIn } = session // si besoin, toRefs(session)

// Tous tes items
type MenuItem = {
  title: string
  icon: string
  color?: string
  path: string
  requiresAuth?: boolean   // visible UNIQUEMENT quand connecté
  guestOnly?: boolean      // visible UNIQUEMENT quand NON connecté
}

const allItems: MenuItem[] = [
  { title: "Inbox",       icon: "mdi-message",   color: "default", path: "/inbox",              requiresAuth: true },
  { title: "Apps",       icon: "mdi-network",     color: "default", path: "/plugin",              guestOnly: true },
  { title: "Calendar",    icon: "mdi-calendar",  color: "default", path: "/calendar" },
  { title: "Order",       icon: "mdi-shopping",  color: "default", path: "/ecommerce/order",    requiresAuth: true },
  { title: "CV",          icon: "mdi-file-pdf",  color: "default", path: "/resume" },
  { title: "Jobs",     icon: "mdi-briefcase", color: "default", path: "/public-job" },
  { title: "Company",     icon: "mdi-database",  color: "default", path: "/crm",                requiresAuth: true },
  { title: "My Courses",  icon: "mdi-school",    color: "default", path: "/courses",            requiresAuth: true },
  { title: "My Files",    icon: "mdi-folder",    color: "default", path: "/user/channel/media", requiresAuth: true },
  { title: "Help",       icon: "mdi-help-circle",     color: "default", path: "/help",              guestOnly: true },
  { title: "About",    icon: "mdi-information", color: "default", path: "/about",        guestOnly: true },
  { title: "Contact",    icon: "mdi-message", color: "default", path: "/contact",        guestOnly: true },
]

// Filtre selon l’état de connexion
const items = computed(() => {
  return allItems.filter((item) => {
    if (item.requiresAuth) return !!loggedIn.value        // montrer si connecté
    if (item.guestOnly)   return !loggedIn.value          // montrer si déconnecté
    return true                                             // sinon, toujours visible
  })
})

// Thème (inchangé)
const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: v => { theme.global.name.value = v ? 'dark' : 'light' },
})
</script>

<template>
  <v-list class="custom-list" nav :lines="false">
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="localePath(item.path)"
        class="custom-item pa-3"
        color="primary"
      >
        <template #prepend>
          <v-icon :icon="item.icon" :color="item.color || 'default'" class="me-1" />
        </template>

        <v-list-item-title
          class="text-subtitle-2 text-uppercase font-weight-bold"
          :class="isDark ? 'text-white' : 'text-default'"
        >
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </MotionGroup>
  </v-list>
</template>

<style scoped>
.custom-list {
  background-color: transparent;
}

.custom-item {
  transition: all 0.2s ease;
  border-radius: 12px;
  padding-left: 12px;
  margin-bottom: 4px;
}

.custom-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  box-shadow: 0 3px 9px rgb(var(--v-theme-primary));
  transform: translateX(2px);
}

.router-link-exact-active {
  background-color: #e3f2fd;
  font-weight: 700;
}
</style>
