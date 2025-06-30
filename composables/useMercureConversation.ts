// composables/useMercureConversation.ts
import { onMounted, onUnmounted, ref, watch } from 'vue'

export const useMercureConversation = (conversationId: Ref<string | null>, callback: (message: any) => void) => {
  const es = ref<EventSource | null>(null)

  const subscribe = (id: string) => {
    const url = new URL('https://bro-world.org/.well-known/mercure')
    url.searchParams.append('topic', `/messages/${id}`)
    url.searchParams.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyJodHRwczovL2Jyby13b3JsZC5vcmcvdXNlci9ub3RpZmljYXRpb25zLzEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCJdLCJwdWJsaXNoIjpbIioiXX0sImlhdCI6MTcxOTUxNTI4NSwiZXhwIjoxNzE5NTE4ODg1fQ.k2Zf_8YXHk7VfW7SwkpHjSkD7rm4_7yKD_ZZsd_ZIwo')

    const source = new EventSource(url.toString(), {
      withCredentials: true,
    })

    source.onmessage = (event) => {
      const data = JSON.parse(event.data)
      callback(data)
    }

    source.onerror = (err) => {
      console.error('Mercure error:', err)
    }

    es.value = source
  }

  watch(conversationId, (id, oldId) => {
    if (es.value) {
      es.value.close()
    }

    if (id) {
      subscribe(id)
    }
  })

  onUnmounted(() => {
    es.value?.close()
  })
}
