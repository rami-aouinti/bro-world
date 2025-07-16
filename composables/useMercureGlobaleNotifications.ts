import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '~/stores/notification'


export const useMercureGlobaleNotifications = () => {
  const notificationsMercure = ref<any[]>([])
  let es: EventSource | null = null

  onMounted(() => {
    if (process.client) {
      const store = useNotificationStore()
      const url = new URL('https://bro-world.org/.well-known/mercure')
      url.searchParams.append('topic', '/notifications')
      url.searchParams.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyJodHRwczovL2Jyby13b3JsZC5vcmcvdXNlci9ub3RpZmljYXRpb25zLzEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCJdLCJwdWJsaXNoIjpbIioiXX0sImlhdCI6MTcxOTUxNTI4NSwiZXhwIjoxNzE5NTE4ODg1fQ.k2Zf_8YXHk7VfW7SwkpHjSkD7rm4_7yKD_ZZsd_ZIwo')
      es = new EventSource(url.toString(), {
        withCredentials: true, // crucial pour envoyer le cookie JWT
      })

      es.onmessage = (event) => {
        const data = JSON.parse(event.data)
        store.addNotification(data.title)
      }

      es.onerror = (err) => {
        console.error('Mercure error:', err)
      }
    }
  })

  onUnmounted(() => {
    es?.close()
  })

  return { notificationsMercure }
}
