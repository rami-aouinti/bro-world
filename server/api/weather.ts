// server/api/weather.ts
import { getRedisClient } from '~/utils/redis';

export default defineEventHandler(async (event) => {
  const redis = await getRedisClient();
  const cacheKey = 'weather:paris';

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached); // Retourne les données en cache
  }

  // Sinon, appel API réelle
  const weather = await useFetch('https://api.weatherapi.com/v1/current.json', {
    query: {
      key: process.env.WEATHER_API_KEY,
      q: 'Paris',
    },
  });

  // Mise en cache pour 10 minutes (600 secondes)
  await redis.set(cacheKey, JSON.stringify(weather), {
    EX: 600,
  });

  return weather;
});
