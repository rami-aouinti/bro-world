export async function useCachedFetch<T = any>(
  key: string,
  callback: () => Promise<T>,
  ttl = 300
): Promise<T> {
  if (process.server) {
    const { getRedisClient } = await import('~/server/utils/redis')
    const redis = await getRedisClient()
    const cacheKey = `cache_${key}`

    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const result = await callback()
    await redis.set(cacheKey, JSON.stringify(result), { EX: ttl })
    return result
  }

  // Côté client : on demande à l’API cache
  const data = await $fetch(`/api/cache/${key}`)
  if (data) return data

  // Pas en cache => on génère et on laisse le serveur le mettre en cache plus tard
  return await callback()
}
