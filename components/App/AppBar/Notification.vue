<script setup lang="ts">
import { ref, computed , mergeProps } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalePath } from '#i18n'
const { t, locale } = useI18n()
const localePath = useLocalePath()
import { useNotificationStore } from '~/stores/notification'
import RelativeTime from "~/components/App/RelativeTime.vue";
const loading = ref(true)
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const countNotification = ref(0)
async function fetchNotifications() {
  await notificationStore.fetchNotifications()
}

watch(loading, () => {
  fetchNotifications()
}, { immediate: true })

onMounted(await fetchNotifications)
</script>

<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn
        icon
        title="Notification"
        aria-label="notification"
        v-bind="mergeProps(menu)"
        class="opacity-80 ml-0"
      >
        <v-badge
          v-if="notifications.length > 0"
          color="primary"
          :content="notifications.length"
        >
          <template #default>
            <v-icon>mdi-bell</v-icon>
          </template>
        </v-badge>

        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-2">
      <v-list-item
        v-if="notifications.length"
        v-for="notification in notifications"
        :key="notification.id"
        class="py-2 px-3 d-flex align-center list-item-hover-active border-radius-md"
      >

        <v-row align="center" class="pa-0 ma-0">
          <!-- Avatar -->
          <v-col cols="auto">
            <v-avatar size="36" class="me-1">
              <NuxtImg
                width="36"
                height="36"
                :src="notification?.subtitle"
                :alt="`Avatar ${notification?.id}`"
                cover
              />
            </v-avatar>
          </v-col>
          <v-col cols="auto">
            <div>
              <NuxtLink :to="localePath(notification?.content)" class="text-primary text-decoration-none text-sm">
                <h6 class="text-sm font-weight-normal text-typo mb-1">
                  {{ notification?.title }}
                </h6>
              </NuxtLink>
              <RelativeTime :date="notification?.createdAt" />
            </div>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item
        v-else
        class="py-2 px-3 d-flex align-center list-item-hover-active border-radius-md"
      >
        <span class="text-sm font-weight-normal text-typo">
         No New Notifications
        </span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
