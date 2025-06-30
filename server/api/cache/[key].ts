// server/api/cache/[key].ts
import { getRedisClient } from '~/utils/redis';

export default defineEventHandler(async (event) => {
  const redis = await getRedisClient();
  const { key } = event.context.params!;
  if (event.method === 'GET') {
    const value = await redis.get(`cache:${key}`);
    return value ? JSON.parse(value) : null;
  }

  if (event.method === 'POST') {
    const body = await readBody<{ value: unknown; ttl?: number }>(event);
    await redis.set(`cache:${key}`, JSON.stringify(body.value), {
      EX: body.ttl || 300,
    });
    return { success: true };
  }

  return createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
