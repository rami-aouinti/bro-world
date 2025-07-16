import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '~/stores/notification'

export const useMercureNotifications = (userId: string) => {
  const notificationsMercure = ref<any[]>([])
  let es: EventSource | null = null

  onMounted(() => {
    if (process.client && userId) {
      const store = useNotificationStore()

      const url = new URL('https://bro-world.org/.well-known/mercure')
      url.searchParams.append('topic', `/notifications/${userId}`)
      url.searchParams.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyJodHRwczovL2Jyby13b3JsZC5vcmcvdXNlci9ub3RpZmljYXRpb25zLzEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCJdLCJwdWJsaXNoIjpbIioiXX0sImlhdCI6MTcxOTUxNTI4NSwiZXhwIjoxNzE5NTE4ODg1fQ.k2Zf_8YXHk7VfW7SwkpHjSkD7rm4_7yKD_ZZsd_ZIwo')
      es = new EventSource(url.toString(), {
        withCredentials: true,
      })

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          const title = data.title ?? 'Notification'
          const subtitle = data.subtitle ?? ''
          const content = data.content ?? ''

          store.addNotification(title, subtitle, content, 'primary')
        } catch (e) {
          console.warn('Erreur parsing Mercure :', event.data)
        }
      }

      es.onerror = (err) => {
        console.error('Erreur Mercure :', err)
      }
    }
  })

  onUnmounted(() => {
    es?.close()
  })

  return { notificationsMercure }
}
