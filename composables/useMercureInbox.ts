import { getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'

export function useMercureInbox(conversations: Ref<any[]>, onMessage: (data: any, convId: string) => void) {
  let eventSource: EventSource | null = null

  const initMercure = (ids: string[]) => {
    if (eventSource) {
      eventSource.close()
    }

    const url = new URL('https://bro-world.org/.well-known/mercure')
    ids.forEach(id => url.searchParams.append('topic', `/messages/${id}`))
    url.searchParams.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyJodHRwczovL2Jyby13b3JsZC5vcmcvdXNlci9ub3RpZmljYXRpb25zLzEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCJdLCJwdWJsaXNoIjpbIioiXX0sImlhdCI6MTcxOTUxNTI4NSwiZXhwIjoxNzE5NTE4ODg1fQ.k2Zf_8YXHk7VfW7SwkpHjSkD7rm4_7yKD_ZZsd_ZIwo')

    eventSource = new EventSource(url.toString(), { withCredentials: true })

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const convId = data.conversationId || data.conversation?.id
      if (convId) {
        onMessage(data, convId)
      }
    }

    eventSource.onerror = (e) => {
      console.error('Mercure Inbox error', e)
    }
  }

  watch(conversations, (val) => {
    if (val.length > 0) {
      const ids = val.map(c => c.id)
      initMercure(ids)
    }
  }, { immediate: true })

  if (getCurrentInstance()) {
    onUnmounted(() => {
      eventSource?.close()
    })
  } else {
    console.warn('onUnmounted skipped: not in setup() context')
  }
}
