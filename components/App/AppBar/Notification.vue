<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useNotificationStore } from '~/stores/notification'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import ReusablePopoverList from '~/components/App/ReusablePopoverList.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'

const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const { t } = useI18n()
const localePath = useLocalePath()
const notificationStore = useNotificationStore()
const isNotificationReady = ref(true)
const batchSize = 3
const notifications = ref<any[]>([])

async function fetchNotifications() {
  notifications.value = await notificationStore.fetchNotifications()
  notifications.value.reverse()
  isNotificationReady.value = false
}
const totalHidden = computed(() => notifications.value.filter(n => n.new).length)

function markAllAsRead() {
  for (const notif of notifications.value) {
    notif.new = false
    notif.show = false
  }
}
onMounted(async () => {
  await fetchNotifications()
})
watch(isNotificationReady, async () => {
  await fetchNotifications()
})
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
    :color="isDark ? 'white' : 'default'"
    @open="markAllAsRead"
  >
    <template #item="{ item }">
      <v-list-item class="pa-1 list-item-hover-active d-flex align-center border-radius-md chat-list-item">
        <v-row align="center">
          <v-col cols="3">
            <v-avatar size="36">
              <NuxtImg
                width="36"
                height="36"
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
