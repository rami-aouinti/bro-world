// stores/event.ts
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { EventItem } from '~/types/EventItem' // Optionnel si tu veux externaliser le type

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as EventItem[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    todayEvents: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      return state.events.filter(e => e.time?.start?.startsWith(today))
    },
  },

  actions: {
    async fetchEventsFromApi() {
      this.loading = true
      this.error = null
      try {
        return await $fetch('/api/profile/events/events') // ou autre endpoint

      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addEvent(newEvent: EventItem) {
      const formData = new FormData()
      formData.append('title', newEvent.title)
      formData.append('start', newEvent.time.start) // <== C'est cette clé qui doit être correcte
      formData.append('end', newEvent.time.end)
      formData.append('color', newEvent.colorScheme ?? '')
      formData.append('description', newEvent.description ?? '')
      formData.append('location', newEvent.location ?? '')
      formData.append('allDay', false)
      formData.append('isPrivate', String(newEvent.isPrivate ?? false))

      return await $fetch('/api/profile/events/add', {
        method: 'POST',
        body: formData,
      })

    },



    async updateEvent(updated: EventItem) {
      const formData = new FormData()
      formData.append('title', updated.title)
      formData.append('start', updated.time.start) // <== C'est cette clé qui doit être correcte
      formData.append('end', updated.time.end)
      formData.append('color', updated.colorScheme ?? '')
      formData.append('description', updated.description ?? '')
      formData.append('location', updated.location ?? '')
      formData.append('allDay', false)
      formData.append('isPrivate', String(updated.isPrivate ?? false))

      const data = await $fetch(`/api/profile/events/${updated.id}/put`, {
        method: 'POST',
        body: formData,
      })
      const idx = this.events.findIndex(e => e.id === updated.id)
      if (idx !== -1) this.events[idx] = {...this.events[idx], ...updated}
    },

    async removeEvent(id: string) {
      const data = await $fetch(`/api/profile/events/${id}/delete`)
      this.events = this.events.filter(e => e.id !== id)
    },
  },
})
