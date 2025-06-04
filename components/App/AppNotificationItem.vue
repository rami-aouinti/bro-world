<script setup lang="ts">
import { computed, toRef, watch } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import type { Notification } from '~/stores/notification'

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
    :text="notificationRef.text"
    :title="new Date(notificationRef.time).toLocaleString()"
  >
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
:deep(.v-alert-title) {
  line-height: 1.25rem;
  font-size: 14px;
  font-weight: 300;
}
</style>
