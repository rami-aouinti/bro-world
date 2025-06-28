<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DialogConfirm from "~/components/DialogConfirm.vue";

import ShowSmsNotification
  from "~/components/Notification/Show/ShowSmsNotification.vue";
import ShowPushNotification
  from "~/components/Notification/Show/ShowPushNotification.vue";
import ShowEmailNotification
  from "~/components/Notification/Show/ShowEmailNotification.vue";
import EditSmsNotification
  from "~/components/Notification/Edit/EditSmsNotification.vue";
import EditPushNotification
  from "~/components/Notification/Edit/EditPushNotification.vue";
import EditEmailNotification
  from "~/components/Notification/Edit/EditEmailNotification.vue";
import Templates from "~/pages/admin/notificationManagement/templates.vue";
import NotificationChannel
  from "~/components/Notification/NotificationChannel.vue";

const notifications = ref([])
const loading = ref(true)
const token = ref('')
const dialogNew = ref(false)
const dialogShow = ref(false)
const dialogEdit = ref(false)
const notification = ref([])
const open = ref([])
const active = ref([])
definePageMeta({
  icon: 'mdi-view-list',
  title: 'Notifications',
  requiresAdmin: true,
  drawerIndex: 2,
})

function cancelEdit() {
  dialogEdit.value = false
}
const headers = [
  { title: 'Channel', value: 'channel' },
  { title: 'Scope', value: 'scope' },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]
const search = ref('')

async function fetchNotifications() {
  const { data } = await useFetch('/api/admin/notification/notifications')
  if (data.value) {
    notifications.value = data.value.reverse();
    loading.value = false
  }
}

watch(loading, () => {
  fetchNotifications()
}, { immediate: true })

onMounted(await fetchNotifications)

const dialogDelete = useTemplateRef('dialogDelete')

function showDialogDelete(id: string) {
  dialogDelete.value
    ?.open('Are you sure you want to delete this notification?')
    .then(async (confirmed: boolean) => {
      if (confirmed) {
        try {
          const response = await $fetch('/api/admin/notification/delete/notification/'+ id)
          if (!response.ok) {
            Notify.error('Not Deleted')
          } else {
            const index = notifications.value!.findIndex((v) => v.id === id)
            notifications.value!.splice(index, 1)
            Notify.success('Deleted')
          }
        } catch (e) {
          Notify.error(e)
        }
      }
    })
}

async function showDialogEdit(id: string) {
  const response = await $fetch('/api/admin/notification/edit/notification/'+ id)
  notification.value = await response.json()
  dialogEdit.value = true
}

async function showDialogShow(id: string) {
  const response = await $fetch('/api/admin/notification/show/notification/'+ id)
  notification.value = await response.json()
  dialogShow.value = true;
}

async function updateNotifications(id) {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/notification/edit/notification/'+ id)
      const data = await response.json();
      notifications.value = data.reverse();
      loading.value = false
  } catch (e) {
    console.error('Error to load notifications :', e)
  } finally {
    loading.value = false
  }
}

async function createNotification() {
  dialogNew.value = true;
}

function getStatus(item: {
  sendAfter: string | Date
  createdAt: string | Date
  completedAt: string | Date | null
}): string {
  const sendAfter = new Date(item.sendAfter)
  const createdAt = new Date(item.createdAt)

  if (sendAfter < createdAt) {
    if (item.completedAt) {
      return 'completed';
    } else {
      return 'failed'
    }
  } else {
    if (item.completedAt) {
      return 'completed';
    } else {
      return 'in progress'
    }
  }
}
</script>

<template>
  <v-card-text>
      <client-only>
        <teleport to="#app-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            density="compact"
            class="mr-2"
            rounded="xl"
            flat
            icon-color
            glow
            variant="solo"
            style="width: 250px"
          />
        </teleport>
      </client-only>
    <v-btn
      icon
      variant="text"
      @click="createNotification"
    >
      <v-icon
        v-model:activated="active"
        single-line
        v-model:opened="open"
        hide-details
        density="compact"
        class="mr-2"
        rounded="xl"
        flat
        icon-color
        glow
        activatable
        variant="solo"
        size="32"
        fluid
        open-on-click
      >
        mdi-bell-plus
      </v-icon>
    </v-btn>
    <v-btn
      icon
      :loading="loading"
      variant="text"
      @click="updateNotifications"
    >
      <v-icon
        v-model:activated="active"
        single-line
        v-model:opened="open"
        hide-details
        density="compact"
        class="mr-2"
        rounded="xl"
        flat
        icon-color
        glow
        activatable
        variant="solo"
        size="32"
        fluid
        open-on-click
      >
        mdi-autorenew
      </v-icon>
    </v-btn>
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="ma-1" title="List of Notifications">
            <v-data-table
            :items="notifications"
            :headers="headers"
            item-value="id"
            :search="search"
            class="elevation-1"
            :loading="loading"
            loading-text="Load Notifications..."
          >
            <template #item.status="{ item }">
              <v-chip :color="getStatus(item) === 'failed' ? 'red' : getStatus(item) === 'completed' ? 'green' : 'blue'" class="ma-2">
                {{ getStatus(item) }}
              </v-chip>
            </template>

            <template #item.actions="{ item }">
              <v-defaults-provider
                :defaults="{
                  VBtn: {
                    size: 20,
                    rounded: 'sm',
                    variant: 'text',
                    class: 'ml-1',
                    color: '',
                  },
                  VIcon: {
                    size: 20,
                  },
                }"
              >
                <v-btn
                  v-tooltip="{ text: 'Show', location: 'top' }"
                  icon="mdi-eye-outline"
                  color="success"
                  @click.stop="showDialogShow(item.id)"
                />
                <v-btn
                  v-tooltip="{ text: 'Update', location: 'top' }"
                  v-if="getStatus(item) === 'in progress'"
                  icon="mdi-edit-outline"
                  color="warning"
                  @click.stop="showDialogEdit(item.id)"
                />
                <v-btn
                  v-tooltip="{ text: 'Delete', location: 'top' }"
                  icon="mdi-delete-outline"
                  color="primary"
                  @click.stop="showDialogDelete(item.id)"
                />
              </v-defaults-provider>
            </template>
          </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card class="ma-1">
            <templates></templates>
          </v-card>
        </v-col>
      </v-row>

      <DialogConfirm ref="dialogDelete" />
    </v-card-text>

  <v-dialog v-model="dialogNew" min-width="700px" max-width="1000px">
    <v-card  justify="center" align="center">
      <v-btn
        icon
        variant="text"
        color="primary"
        class="position-absolute top-0 right-0 mt-2 me-2"
        @click="dialogNew = false"
      >
        <v-icon icon="mdi-close" />
      </v-btn>
      <v-card-text class="font-weight-bold"  justify="center" align="center">
        <NotificationChannel></NotificationChannel>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogShow" max-width="750px">
    <v-card>
      <v-btn
        icon
        variant="text"
        color="primary"
        class="position-absolute top-0 right-0 mt-2 me-2"
        @click="dialogShow = false">
        <v-icon icon="mdi-close" />
      </v-btn>
      <v-card-text class="font-weight-bold d-flex">
        <ShowSmsNotification v-if="notification?.channel==='SMS'" :notification="notification"></ShowSmsNotification>
        <ShowPushNotification v-if="notification?.channel==='PUSH'" :notification="notification"></ShowPushNotification>
        <ShowEmailNotification v-if="notification?.channel==='EMAIL'" :notification="notification"></ShowEmailNotification>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogEdit" min-width="800px">
    <EditSmsNotification v-if="notification?.channel==='SMS'" :notification="notification" @cancelEdit="cancelEdit"></EditSmsNotification>
    <EditPushNotification v-if="notification?.channel==='PUSH'" :notification="notification" @cancelEdit="cancelEdit"></EditPushNotification>
    <EditEmailNotification v-if="notification?.channel==='EMAIL'" :notification="notification" @cancelEdit="cancelEdit"></EditEmailNotification>
  </v-dialog>
</template>
