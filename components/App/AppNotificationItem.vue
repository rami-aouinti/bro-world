<script setup lang="ts">
import { computed, toRef, watch } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import type { Notification } from '~/stores/notification'
import RelativeTime from "~/components/App/RelativeTime.vue";
import { useLocalePath } from '#i18n'
const { t, locale } = useI18n()
const localePath = useLocalePath()
const props = defineProps<{
  timeout: number
  notification: Notification
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isShow = defineModel<boolean>({ default: false })

const timeoutRef = toRef(props, 'timeout')
const notificationRef = toRef(props, 'notification')

const { start, stop } = useTimeoutFn(() => {
  isShow.value = false
}, timeoutRef, { immediate: false })

watch(timeoutRef, (val) => {
  val !== -1 ? start() : stop()
}, { immediate: true })

const isPersistent = computed(() => timeoutRef.value === -1)
</script>

<template>
  <v-alert
    v-if="isShow"
    :border="isPersistent ? 'start' : false"
    :variant="isPersistent ? 'outlined' : undefined"
    :density="isPersistent ? 'compact' : undefined"
    :theme="isPersistent ? undefined : 'dark'"
    :elevation="isPersistent ? 0 : 3"
    :type="notificationRef.type"
  >
    <template #prepend>
      <v-avatar size="48">
        <v-img width="48" heigth="48" loading="lazy" :alt="notificationRef.id" :src="notificationRef.subtitle" />
      </v-avatar>
    </template>

    <template #default>
      <NuxtLink
        :to="localePath(notificationRef.content)"
        class="notification-link text-decoration-none text-sm"
        style="color: inherit;"
      >
        <h6 class="text-sm font-weight-normal mb-1">
          {{ notificationRef.title }}
        </h6>
      </NuxtLink>
      <RelativeTime :date="notificationRef.time" />
    </template>

    <template #close>
      <v-tooltip text="Close alert" location="top">
        <template #activator="{ props }">
          <v-btn
            icon="$close"
            v-bind="props"
            aria-label="Close alert"
            title="Close"
            @click="emit('close')"
          />
        </template>
      </v-tooltip>
    </template>
  </v-alert>
</template>

<style scoped>
.notification-link {
  color: inherit;
}

.notification-link:hover {
  text-decoration: none;
}

:deep(.v-alert-title) {
  line-height: 1rem;
  font-size: 12px;
  font-weight: 200;
}
</style>

