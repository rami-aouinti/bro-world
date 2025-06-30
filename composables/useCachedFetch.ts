// ~/composables/useCachedFetch.ts
export async function useCachedFetch<T = any>(
  key: string,
  callback: () => Promise<T>,
  ttl = 300
): Promise<T> {
  const cacheKey = `cache_${key}`
  const cached = sessionStorage.getItem(cacheKey)

  if (cached) {
    try {
      const { data, expires } = JSON.parse(cached)
      if (Date.now() < expires) {
        return data
      }
    } catch (e) {
      console.warn('Cache parsing error:', e)
    }
  }

  const result = await callback()

  sessionStorage.setItem(cacheKey, JSON.stringify({
    data: result,
    expires: Date.now() + ttl * 1000,
  }))

  return result
}
