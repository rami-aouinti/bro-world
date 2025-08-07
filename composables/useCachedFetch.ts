export async function useCachedFetch<T = any>(
  key: string,
  callback: () => Promise<T>,
  ttl = 31536000
): Promise<T> {
  const cacheKey = `${key}`

  if (process.server) {
    const { getRedisClient } = await import('~/server/utils/redis')
    const redis = await getRedisClient()

    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const result = await callback()
    await redis.set(cacheKey, JSON.stringify(result), { EX: ttl })
    return result
  }

  // Côté client : on tente de récupérer le cache
  const data = await $fetch(`/api/cache/${key}`).catch(() => null)
  if (data) return data

  // Pas trouvé → on génère + on enregistre en POST
  const result = await callback()
  await $fetch(`/api/cache/${key}`, {
    method: 'POST',
    body: { value: result, ttl },
  })

  return result
}

export async function deleteCachedKey(key: string): Promise<void> {
  const cacheKey = `${key}`

  if (process.server) {
    const { getRedisClient } = await import('~/server/utils/redis')
    const redis = await getRedisClient()
    await redis.del(cacheKey)
  } else {
    await $fetch(`/api/cache/${cacheKey}`, { method: 'DELETE' }).catch(() => {})
  }
}
