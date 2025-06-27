import { ref, onMounted, onUnmounted } from 'vue'

export const useMercureGlobaleNotifications = () => {
  const notificationsMercure = ref<any[]>([])
  let es: EventSource | null = null

  onMounted(async () => {
    if (!process.client) return

    const url = new URL('https://bro-world.org/.well-known/mercure')
    url.searchParams.append('topic', '/user/notifications/')
    url.searchParams.append('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyIvdXNlci9ub3RpZmljYXRpb25zLyJdfSwiZXhwIjoxOTUwMDAwMDAwfQ.zK4L3lwn88cL7m9bc9yBa3z27Uz_rEsSk1j1u-VUjZ4')

    es = new EventSource(url.toString(), { withCredentials: true })

    es.onmessage = (event) => {
      notificationsMercure.value.push(JSON.parse(event.data))
    }

    es.onerror = (err) => {
      console.error('Mercure error:', err)
    }
  })

  onUnmounted(() => {
    es?.close()
  })

  return { notificationsMercure }
}
