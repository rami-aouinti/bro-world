<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '~/stores/notification'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import ReusablePopoverList from '~/components/App/ReusablePopoverList.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const batchSize = 3

const totalHidden = computed(() => notifications.value.filter(n => n.new).length)

async function fetchNotifications() {
  await notificationStore.fetchNotifications()
  notifications.value.reverse()
}

function markAllAsRead() {
  for (const notif of notifications.value) {
    notif.new = false
    notif.show = false
  }
}

onMounted(fetchNotifications)
</script>

<template>
  <ReusablePopoverList
    icon="mdi-bell"
    :title="t('notifications')"
    :items="notifications"
    :badge-count="totalHidden"
    :batch-size="batchSize"
    :height="300"
    :empty-text="t('notification.empty')"
    color="secondary"
    @open="markAllAsRead"
  >
    <template #item="{ item }">
      <v-list-item class="px-2 py-1 list-item-hover-active border-radius-md">
        <v-row align="center">
          <v-col cols="3">
            <v-avatar size="48">
              <NuxtImg
                width="48"
                height="48"
                :src="item.subtitle"
                format="webp"
                :lazy-src="'/img/person.png'"
                loading="lazy"
                cover
              />
            </v-avatar>
          </v-col>
          <v-col cols="9">
            <NuxtLink
              :to="localePath(item.content)"
              class="text-decoration-none"
            >
              <h6 class="text-sm font-weight-normal">{{ item.title }}</h6>
            </NuxtLink>
            <RelativeTime :date="item.time" />
          </v-col>
        </v-row>
      </v-list-item>
    </template>
  </ReusablePopoverList>
</template>

<style scoped>
.text-decoration-none {
  text-decoration: none;
  color: inherit;
}
.text-decoration-none:hover {
  text-decoration: underline;
}
</style>
