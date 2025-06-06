<template>
  <v-container fluid>
    <v-sheet class="d-flex" height="54" tile>
      <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        density="compact"
        label="View Mode"
        variant="outlined"
        hide-details
      />
      <v-select
        v-model="weekday"
        :items="weekdays"
        class="ma-2"
        density="compact"
        label="Weekdays"
        variant="outlined"
        hide-details
      />
    </v-sheet>

    <v-sheet height="700">
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
        event-color="color"
        event-draggable
        event-resizable
        @click:event="editEvent"
        @click:date="createEvent"
        @change:event="onEventChange"
        @event-drop="onEventDrop"
      />
    </v-sheet>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editedIndex === -1 ? 'Add' : 'Edit' }} Event</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="editedEvent.title" label="Title" />

          <v-menu v-model="menu1" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="formatDate(editedEvent.start)"
                label="Start date"
                @update:modelValue="val => editedEvent.start = new Date(val)"
              />
            </template>
            <v-date-picker v-model="editedEvent.start" />
          </v-menu>

          <v-menu v-model="menu2" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="formatDate(editedEvent.end)"
                label="End date"
                @update:modelValue="val => editedEvent.end = new Date(val)"
              />
            </template>
            <v-date-picker v-model="editedEvent.end" />
          </v-menu>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          <v-btn
            v-if="editedIndex !== -1"
            color="red darken-1"
            text
            @click="remove"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const calendar = ref(null)
const type = ref('month')
const types = ['month', 'week', 'day']

const weekday = ref([0, 1, 2, 3, 4, 5, 6])
const weekdays = [
  { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
]

const value = ref(new Date())

const dialog = ref(false)
const menu1 = ref(false)
const menu2 = ref(false)
const editedIndex = ref(-1)

const defaultEvent = {
  title: '',
  start: new Date(),
  end: new Date(),
  color: 'blue',
}
const editedEvent = reactive({ ...defaultEvent })

const today = new Date()
const events = ref([
  {
    title: 'Conférence Tech',
    start: new Date(today),
    end: new Date(today),
    color: 'blue',
  },
  {
    title: 'Formation Vue.js',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    color: 'green',
  },
  {
    title: 'Réunion équipe',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    color: 'indigo',
  },
])

function editEvent({ event }) {
  editedIndex.value = events.value.indexOf(event)
  Object.assign(editedEvent, event)
  dialog.value = true
}

function createEvent({ date }) {
  editedIndex.value = -1
  Object.assign(editedEvent, {
    ...defaultEvent,
    start: new Date(date),
    end: new Date(date),
  })
  dialog.value = true
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(events.value[editedIndex.value], editedEvent)
  } else {
    events.value.push({ ...editedEvent })
  }
  close()
}

function remove() {
  if (editedIndex.value > -1) {
    events.value.splice(editedIndex.value, 1)
  }
  close()
}

function close() {
  dialog.value = false
  editedIndex.value = -1
  Object.assign(editedEvent, { ...defaultEvent, start: new Date(), end: new Date() })
}

function onEventChange({ event }) {
  const idx = events.value.findIndex(e => e.title === event.title)
  if (idx !== -1) {
    events.value[idx].start = new Date(event.start)
    events.value[idx].end = new Date(event.end)
  }
}

function formatDate(date) {
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toISOString().substring(0, 10)
    : ''
}

function onEventDrop({ event }) {
  const idx = events.value.findIndex(e => e.title === event.title)
  if (idx !== -1) {
    events.value[idx].start = new Date(event.start)
    events.value[idx].end = new Date(event.end)
  }
}
</script>
