<script setup lang="ts">
import { computed } from 'vue'
const items = [
  { title: "Settings", icon: "mdi-account-settings-variant", color: "default", path: "/setting" },
  { title: "Calendar", icon: "mdi-calendar", color: "default", path: "/calendar" },
  { title: "Order", icon: "mdi-shopping", color: "default", path: "/ecommerce/order" },
  { title: "CV", icon: "mdi-file-pdf", color: "default", path: "/resume" },
  { title: "My Jobs", icon: "mdi-briefcase", color: "default", path: "/jobs" },
  { title: "Company", icon: "mdi-database", color: "default", path: "/crm" },
  { title: "My Courses", icon: "mdi-school", color: "default", path: "/courses" },
  { title: "My Files", icon: "mdi-folder", color: "default", path: "/user/channel/media" },
];
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
</script>

<template>
  <v-list
    class="custom-list"
    nav
    :lines="false"
  >
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.path"
        class="custom-item pa-3"
        color="primary"
      >
        <template #prepend>
          <v-icon :icon="item.icon" :color="item.color" class="me-3"></v-icon>
        </template>

        <v-list-item-title class="text-subtitle-2 text-uppercase font-weight-bold" :class="isDark ? 'text-white' : 'text-default'">
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
