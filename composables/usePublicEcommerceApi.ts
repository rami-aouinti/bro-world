// composables/useEcommerceApi.ts
export function usePublicEcommerceApi<T = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
    key?: string
    lazy?: boolean
    immediate?: boolean
  } = {}
) {
  const method = options.method || 'GET'

  return useAsyncData<T>(
    options.key || endpoint,
    async () => {
      const url = `/api/shop/forwardpub?endpoint=${encodeURIComponent(endpoint)}&method=${method}`
      const raw = await $fetch<string>(url, {
        method,
        body: options.body,
        responseType: 'text'
      })
      const fixedRaw = raw.trim().match(/^\{.*\}/s)?.[0]
      if (!fixedRaw) throw new Error('Invalid JSON format')
      return JSON.parse(fixedRaw)
    },
    {
      lazy: options.lazy ?? false,
      immediate: options.immediate ?? true,
      server: true
    }
  )
}
