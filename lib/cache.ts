// lib/cache.ts
import redis from '~/utils/redis';

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCache<T>(key: string, value: T, ttl = 300): Promise<void> {
  await redis.set(key, JSON.stringify(value), { EX: ttl });
}
