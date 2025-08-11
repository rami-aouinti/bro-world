<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="d-flex align-center justify-space-between px-4 pt-4">
          <h6 class="text-h6 font-weight-bold text-typo">
            Today's Events
          </h6>
          <v-btn
            variant="text"
            @click="openNewEventDialog"
            color="primary"
            prepend-icon="mdi-plus"
          >
            Event
          </v-btn>
        </div>
        <div class="px-4 pt-3 pb-3">
          <v-list style="background-color: transparent; height: 300px;" density="compact" v-if="todayEvents.length">
            <v-list-item-group class="border-radius-sm">
              <v-list-item
                v-for="(item, i) in todayEvents"
                :key="item.id"
                class="px-0 border-radius-sm"
                :class="i < events.length - 1 ? 'mb-6' : ''"
                :ripple="false"
              >
                <v-list-item-content class="py-0">
                  <div class="d-flex align-center">
                    <v-avatar
                      size="50"
                      class="text-white px-2 py-2 me-4 bg-gradient-default shadow"
                    >
                      <v-icon class="text-white" size="20">mdi-calendar</v-icon>
                    </v-avatar>

                    <div class="d-flex flex-column">
                      <h6 class="mb-1 text-dark text-sm font-weight-bold">
                        {{ item.title }}
                      </h6>
                      <span class="text-sm text-body font-weight-light">
                          {{ formatTime(item.time.start) + ' - ' + formatTime(item.time.end) }}
                        </span>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-alert v-else type="primary" density="compact">No events today</v-alert>
        </div>
      </teleport>
    </client-only>
    <v-row>
      <v-dialog v-model="newEventDialog" max-width="600">
        <v-card rounded="xl" :loading="isUpdating">
          <v-card-title class="text-h6 text-primary px-6 py-4">
            New Event
          </v-card-title>
          <v-card-text>
            <v-text-field rounded="xl" v-model="newEventTitle" label="Event title" />
            <v-row dense>
              <v-col cols="12" md="6">
                <v-date-input
                  v-model="newEventDate"
                  color="primary"
                  header-color="primary"
                  max-width="368"
                  rounded="xl"
                  label="Select a date"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                ></v-date-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-date-input
                  v-model="newEventDateEnd"
                  color="primary"
                  header-color="primary"
                  max-width="368"
                  rounded="xl"
                  label="Select a date"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                ></v-date-input>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn prepend-icon="mdi-content-save" :loading="isUpdating"
                   :disabled="isUpdating"
                   :variant="isUpdating ? 'tonal' : undefined" color="primary" @click="createEvent">Save</v-btn>
            <v-spacer />
            <v-btn prepend-icon="mdi-delete" :loading="isUpdating"
                   :disabled="isUpdating"
                   :variant="isUpdating ? 'tonal' : undefined" color="error" @click="newEventDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3" variant="text" elevation="10">
          <Qalendar
            :events="events"
            :config="config"
            :is-loading="loading"
            @event-was-clicked="onEventClicked"
            @interval-was-clicked="onIntervalClicked"
            @event-was-dragged="onEventDragged"
          >
            <template #eventDialog="props">
              <div style="max-width: 600px;">
                <v-card v-if="props.eventDialogData && props.eventDialogData.title" :loading="isUpdating">
                  <v-card-title class="text-h6 text-primary px-6 py-4">Edit: {{ props.eventDialogData.title }}</v-card-title>

                  <v-card-text>
                    <v-text-field rounded="xl" v-model="props.eventDialogData.title" label="Event title" />
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-date-input
                          v-model="props.eventDialogData.time.start"
                          rounded="xl"
                          color="primary"
                          header-color="primary"
                          max-width="368"
                          label="Select a date"
                          prepend-icon=""
                          prepend-inner-icon="$calendar"
                          variant="solo"
                        ></v-date-input>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-date-input
                          v-model="props.eventDialogData.time.end"
                          rounded="xl"
                          color="primary"
                          header-color="primary"
                          max-width="368"
                          label="Select a date"
                          prepend-icon=""
                          prepend-inner-icon="$calendar"
                          variant="solo"
                        ></v-date-input>
                      </v-col>
                    </v-row>

                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn prepend-icon="mdi-content-save" :loading="isUpdating"
                           :disabled="isUpdating"
                           :variant="isUpdating ? 'tonal' : undefined" color="primary" @click="save(props.eventDialogData); props.closeEventDialog()">Save</v-btn>
                    <v-spacer />
                    <v-btn prepend-icon="mdi-delete" :loading="isUpdating"
                           :disabled="isUpdating"
                           :variant="isUpdating ? 'tonal' : undefined" color="error" @click="remove(props.eventDialogData.id); props.closeEventDialog()">Delete</v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </template>
          </Qalendar>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, nextTick, shallowRef, computed, watch } from 'vue'
import { Qalendar } from "qalendar"
import dayjs from 'dayjs'
import type { EventItem } from '~/types/EventItem'
import {useEventStore} from "~/stores/useEventStore";
import EventDialog from "~/components/EventDialog.vue";
const eventStore = useEventStore()
const storeEvents = computed(() => eventStore.events)
const events = ref<EventItem[]>([])

watch(storeEvents.value, (val) => {
  events.value = [...val]
}, { immediate: true })
const model = shallowRef(null)
const time = ref(null)
const canTeleport = ref(false)


const { user, loggedIn } = useUserSession()

const config = ref({
  week: { startsOn: 'monday', nDays: 7, scrollToHour: 5 },
  eventDialog: { isCustom: true },
  month: { showTrailingAndLeadingDates: false },
  defaultMode: 'month',
  isSilent: true,
  showCurrentTime: true,
  dayIntervals: {
    length: 15,
    height: 100,
    displayClickableInterval: true
  },
  colorSchemes: {
    meetings: { color: "#fff", backgroundColor: "#ff4081" },
    sports: { color: "#fff", backgroundColor: "#ff4081" },
  },
})

const newEventDialog = ref(false)
const newEventTitle = ref('')
const newEventDate = ref(new Date())
const newEventDateEnd = ref(new Date())
const newEventStartTime = ref('09:00')
const newEventEndTime = ref('10:00')

function onIntervalClicked(data) {
  const [datePart, startHour] = data.time.start.split(' ')
  const [, endHour] = data.time.end.split(' ')

  newEventDate.value = datePart // ✅ string "2025-07-07"
  newEventStartTime.value = startHour
  newEventEndTime.value = endHour
  newEventTitle.value = ''
  newEventDialog.value = true
}
function openNewEventDialog() {
  newEventTitle.value = ''
  newEventDate.value = ref(new Date())
  newEventStartTime.value = '09:00'
  newEventEndTime.value = '10:00'
  newEventDialog.value = true
}
async function onEventDragged(draggedEvent) {
  const updated = {
    ...draggedEvent,
    time: {
      start: draggedEvent.time.start,
      end: draggedEvent.time.end,
    },
  }

  try {
    await eventStore.updateEvent(updated)
    console.log('✅ Event updated via drag:', updated)
  } catch (err) {
    console.error('❌ Failed to update event via drag:', err)
  }
}
async function createEvent() {
  isUpdating.value = true
  const dateStr = dayjs(newEventDate.value).format('YYYY-MM-DD')
  const start = `${dateStr} ${newEventStartTime.value}`
  const end = `${dateStr} ${newEventEndTime.value}`

  const newEvent = {
    id: Math.random().toString(36).substring(2),
    title: newEventTitle.value || 'Untitled Event',
    time: { start, end },
    isEditable: true,
    colorScheme: 'meetings',
  }

  const data = await eventStore.addEvent(newEvent)
  if (Array.isArray(data)) {
    events.value = data.map((e) => ({
      id: e.id,
      title: e.title,
      time: {
        start: dayjs(e.start).format('YYYY-MM-DD HH:mm'),
        end: dayjs(e.end).format('YYYY-MM-DD HH:mm'),
      },
      isEditable: true,
      colorScheme: e.color || 'meetings', // ou un fallback
    }))
  }
  await nextTick()
  updateTodayEvents()
  isUpdating.value = false
  newEventDialog.value = false

}
const isUpdating = ref(false)

function onEventClicked(e) {
  console.log('event clicked', e)
}

async function save(updated) {
  isUpdating.value = true
  const data = await eventStore.updateEvent(updated)
  const idx = events.value.findIndex(e => e.id === updated.id)
  if (idx !== -1) {
    events.value[idx].title = updated.title
  }
  await fetchEvents()
  isUpdating.value = false
}

async function remove(id) {
  isUpdating.value = true
  const data = await eventStore.removeEvent(id)
  await fetchEvents()
  const idx = events.value.findIndex(e => e.id === id)
  if (idx !== -1) {
    events.value.splice(idx, 1)
  }
  isUpdating.value = false
}

const todayEvents = ref([])

const updateTodayEvents = () => {
  const today = dayjs().format('YYYY-MM-DD')
  todayEvents.value = events.value.filter((e) =>
    e.time?.start?.startsWith(today)
  )
}
const fetchEvents = async () => {
  try {
    if (loggedIn.value) {
      const data = await eventStore.fetchEventsFromApi()
      if (Array.isArray(data)) {
        events.value = data.map((e) => ({
          id: e.id,
          title: e.title,
          time: {
            start: dayjs(e.start).format('YYYY-MM-DD HH:mm'),
            end: dayjs(e.end).format('YYYY-MM-DD HH:mm'),
          },
          isEditable: true,
          colorScheme: e.color || 'meetings', // ou un fallback
        }))
      }
    }
  } catch (e) {
    console.error('Erreur fetch events:', e)
  } finally {
    loading.value = false
  }
}

const formatTime = (datetime: string) => dayjs(datetime).format('HH:mm')

const loading = ref(true)
onMounted(async () => {
  await fetchEvents()
  await nextTick()
  updateTodayEvents()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})

watchEffect(updateTodayEvents)
</script>
<style>
@import "qalendar/dist/style.css";
</style>
<style scoped>
:deep(.calendar-month__day) {
  min-height: 140px !important;
}
</style>
