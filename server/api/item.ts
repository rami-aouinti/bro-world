import { getRedisClient } from '~/server/utils/redis';

export default defineEventHandler(async () => {
  const redis = await getRedisClient();
  const value = await redis.get('item');
  return { result: value };
});
