// server/api/redis/test.ts
import { getRedisClient } from '~/server/utils/redis'

export default defineEventHandler(async () => {
  const redis = await getRedisClient()
  const keys = await redis.keys('cache_*')
  const values = await Promise.all(keys.map(k => redis.get(k)))
  return keys.map((key, i) => ({
    key,
    value: values[i]
  }))
})
