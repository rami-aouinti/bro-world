export interface Notification {
  show: boolean
  type: 'info' | 'error' | 'success' | 'warning'
  pushTitle: string
  pushContent: string
  pushSubtitle: string
  time: Date
  id: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    notificationCount: 0,
  }),

  actions: {
    async fetchNotifications() {
      try {
        const { data } = await $fetch<{ value: any[] }>('/api/profile/notifications')

        if (data?.value) {
          for (const notif of data.value) {
            this.notifications.push({
              id: this.notificationCount++,
              pushTitle: notif.pushTitle || 'No title',
              pushContent: notif.pushContent || '',
              pushSubtitle: notif.pushSubtitle || '',
              type: 'info',
              time: new Date(),
              show: true,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    },

    addNotification(pushTitle: string, type: Notification['type'] = 'info') {
      this.notifications.push({
        id: this.notificationCount++,
        pushTitle,
        pushContent: '',
        pushSubtitle: '',
        type,
        time: new Date(),
        show: true,
      })
    },

    delNotification(id: number) {
      const index = this.notifications.findIndex((m) => m.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
  },
})

export const Notify = {
  info: (pushTitle: string) =>
    useNotificationStore().addNotification(pushTitle, 'info'),
  success: (pushTitle: string) =>
    useNotificationStore().addNotification(pushTitle, 'success'),
  warning: (pushTitle: string) =>
    useNotificationStore().addNotification(pushTitle, 'warning'),
  error: (val: unknown) => {
    let pushTitle = ''
    if (typeof val === 'string') {
      pushTitle = val
    } else if (val instanceof Error) {
      pushTitle = val.message
    } else {
      pushTitle = JSON.stringify(val)
    }
    useNotificationStore().addNotification(pushTitle, 'error')
  },
}
