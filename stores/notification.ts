export interface Notification {
  show: boolean
  read: boolean
  type: 'info' | 'error' | 'success' | 'warning' | 'primary'
  title: string
  subtitle: string
  content: string
  time: Date
  id: number
  new: boolean
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    notificationCount: 0,
  }),

  actions: {
    async fetchNotifications() {
      try {
        const data = await $fetch('/api/profile/notifications')
        const notificationsRaw = Object.values(data)

        for (const notif of notificationsRaw) {
          if (notif.channel === 'PUSH') {
            this.notifications.push({
              id: this.notificationCount++,
              title: notif.pushTitle ?? 'No title',
              subtitle: notif.pushSubtitle ?? '',
              content: notif.pushContent ?? '',
              type: 'primary',
              time: notif.completedAt ? new Date(notif.completedAt) : new Date(),
              show: false,
              read: false,
              new: false
            })
          }
        }
        return this.notifications
      } catch (error) {
        console.error('Error fetching notifications:', error)
        return []
      }
    },

    addNotification(title: string, subtitle: string, content: string, type: Notification['type'] = 'info') {
      this.notifications.push({
        id: this.notificationCount++,
        title,
        subtitle,
        content,
        type,
        time: new Date(),
        show: true,
        read: true,
        new: true
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
  info: (title: string, subtitle: string, content: string) =>
    useNotificationStore().addNotification(title, subtitle, content, 'primary'),

  success: (title: string, subtitle: string, content: string) =>
    useNotificationStore().addNotification(title, subtitle, content, 'success'),

  warning: (title: string, subtitle: string, content: string) =>
    useNotificationStore().addNotification(title, subtitle, content, 'warning'),

  error: (val: unknown) => {
    let title = ''
    if (typeof val === 'string') {
      title = val
    } else if (val instanceof Error) {
      title = val.message
    } else {
      title = JSON.stringify(val)
    }
    useNotificationStore().addNotification(title, '', '', 'error')
  },
}
