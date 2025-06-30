// server/api/set-item.ts
import { getRedisClient } from '~/utils/redis';

export default defineEventHandler(async (event) => {
  const redis = await getRedisClient();
  const body = await readBody<{ key: string; value: string }>(event);
  await redis.set(body.key, body.value);
  return { success: true };
});
