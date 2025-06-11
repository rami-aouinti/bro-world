<script setup lang="ts">
import { ref, computed , mergeProps } from 'vue'
import { storeToRefs } from 'pinia'

import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const dropdown = [
  {
    icon: 'mdi-email',
    title: 'Check new messages',
  },
  {
    icon: 'mdi-podcast',
    title: 'Manage podcast session',
  },
  {
    icon: 'mdi-shopping-cart',
    title: 'Payment successfully completed',
  },
]
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
        <v-icon size="20" class="me-3 text-body">mdi-bell-outline</v-icon>
        <span class="text-sm font-weight-normal text-typo">
          {{ notification.text }}
        </span>
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
