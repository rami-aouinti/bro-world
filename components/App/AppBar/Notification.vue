<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import { useNotificationStore } from '~/stores/notification'
import RelativeTime from "~/components/App/RelativeTime.vue"

const { t } = useI18n()
const localePath = useLocalePath()
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const menuOpen = ref(false)
const displayedNotifications = ref([]) // dynamique

const totalHidden = computed(() => notifications.value.filter(n => n.new).length)

const batchSize = 3

async function fetchNotifications() {
  await notificationStore.fetchNotifications()
  notifications.value.reverse()
  displayedNotifications.value = notifications.value.slice(0, batchSize)
}

function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
  const alreadyLoaded = displayedNotifications.value.length
  const nextBatch = notifications.value.slice(alreadyLoaded, alreadyLoaded + batchSize)

  if (nextBatch.length === 0) {
    done('empty')
    return
  }

  displayedNotifications.value.push(...nextBatch)
  done('ok')
}

watch(menuOpen, (opened) => {
  if (opened) {
    for (const notif of notifications.value) {
      notif.show = false
      notif.new = false
    }
  }
})

onMounted(fetchNotifications)
</script>


<template>
  <v-menu v-model="menuOpen" location="bottom">
    <template #activator="{ props: menu }">
      <v-btn
        icon
        title="Notification"
        aria-label="notification"
        v-bind="menu"
        class="opacity-80 ml-0"
      >
        <v-badge
          v-if="totalHidden > 0"
          color="primary"
          :content="totalHidden"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-1">
      <v-infinite-scroll
        v-if="displayedNotifications.length"
        :height="300"
        :items="displayedNotifications"
        @load="load"
      >
        <template v-for="notification in displayedNotifications" :key="notification.id">
          <v-list-item class="py-1 px-1 d-flex align-center list-item-hover-active border-radius-md" width="300">
            <v-row align="center" class="pa-0 ma-0">
              <v-col cols="3">
                <v-avatar size="48" class="me-1">
                  <NuxtImg
                    width="48"
                    height="48"
                    :src="notification.subtitle"
                    :alt="`Avatar ${notification.id}`"
                    cover
                  />
                </v-avatar>
              </v-col>
              <v-col cols="9">
                <div>
                  <NuxtLink
                    :to="localePath(notification.content)"
                    class="notification-link text-decoration-none text-sm"
                  >
                    <h6 class="text-sm font-weight-normal">
                      {{ notification.title }}
                    </h6>
                  </NuxtLink>
                  <RelativeTime :date="notification.time" />
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </template>
      </v-infinite-scroll>

      <v-list-item
        v-if="notifications.length === 0"
        class="py-2 px-3"
      >
        <span class="text-sm font-weight-normal text-typo">
          {{ t('notifications.empty') }}
        </span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<style scoped>
.notification-link {
  color: inherit;
}

.notification-link:hover {
  text-decoration: none;
}
</style>
