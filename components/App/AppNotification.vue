<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppNotificationItem from '~/components/App/AppNotificationItem.vue'
import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const notificationsShown = computed(() =>
  notifications.value.filter(n => n.show).reverse()
)

const showAll = ref(false)
const timeout = computed(() => (showAll.value ? -1 : 5000))

function deleteNotification(id: number) {
  notificationStore.delNotification(id)
}

function emptyNotifications() {
  notificationStore.$reset()
}

function toggleAll() {
  showAll.value = !showAll.value
  notifications.value.forEach(n => (n.show = showAll.value))
}
</script>

<template>
  <v-tooltip text="Toggle notifications" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :icon="notifications.length ? 'mdi-bell-badge-outline' : 'mdi-bell-outline'"
        :rounded="0"
        aria-label="Toggle notifications"
        title="Toggle notifications"
        @click="toggleAll"
      />
    </template>
  </v-tooltip>

  <ClientOnly>
    <teleport to="body">
      <v-card
        elevation="6"
        width="400"
        class="d-flex flex-column notification-card"
        :class="{ 'notification-card--open': showAll }"
      >
        <v-toolbar flat density="compact">
          <v-toolbar-title class="font-weight-light text-body-1">
            {{ notifications.length ? 'Notifications' : 'No New Notifications' }}
          </v-toolbar-title>

          <v-tooltip text="Clear all notifications" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                icon="mdi-bell-remove"
                aria-label="Clear all notifications"
                title="Clear all"
                @click="emptyNotifications"
              />
            </template>
          </v-tooltip>

          <v-tooltip :text="showAll ? 'Hide notifications' : 'Show notifications'" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="mr-0"
                size="small"
                icon="$expand"
                aria-label="Toggle notification visibility"
                :title="showAll ? 'Hide notifications' : 'Show notifications'"
                @click="toggleAll"
              />
            </template>
          </v-tooltip>
        </v-toolbar>

        <v-slide-y-reverse-transition
          tag="div"
          class="d-flex flex-column notification-box"
          group
          hide-on-leave
        >
          <div
            v-for="notification in notificationsShown"
            :key="notification.id"
            class="notification-item-wrapper"
          >
            <AppNotificationItem
              v-model="notification.show"
              :notification="notification"
              :timeout="timeout"
              class="notification-item"
              @close="deleteNotification(notification.id)"
            />
          </div>
        </v-slide-y-reverse-transition>
      </v-card>
    </teleport>
  </ClientOnly>
</template>

<style scoped>
.notification-item {
  width: 100%;
  border: 0;
}
.notification-card {
  z-index: 1;
  position: fixed;
  right: 15px;
  bottom: 48px;
  max-height: 100vh;
  overflow: visible;
  visibility: hidden;

  &.notification-card--open {
    visibility: visible;
    overflow: hidden;
    max-height: calc(100vh - 200px);

    .notification-box {
      overflow-y: overlay;
      pointer-events: auto;

      .notification-item-wrapper {
        transition: none !important;

        .notification-item {
          margin-bottom: 0;
          border-radius: 0;
          border-top: 1px solid #5656563d !important;
        }
      }
    }
  }
}
.notification-box {
  overflow-y: visible;
  visibility: visible;
  pointer-events: none;

  .notification-item {
    pointer-events: initial;
    user-select: initial;
    margin-bottom: 10px;
  }
}
</style>
