// composables/useBlogApi.ts
export function useBlogApi<T = unknown>(
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
      const url = `/api/admin/blog/forward?endpoint=${encodeURIComponent(endpoint)}&method=${method}`
      return await $fetch<string>(url, {
        method,
        body: options.body,
      })
    },
    {
      lazy: options.lazy ?? false,
      immediate: options.immediate ?? true,
      server: true
    }
  )
}
