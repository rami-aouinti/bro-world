import { isRef, toRaw } from 'vue';

export const useCachedFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300
): Promise<T> => {
  const { data: cached } = await useFetch(`/api/cache/${key}`);

  if (cached.value) {
    return cached.value as T;
  }

  let freshData = await fetcher();

  // Sécurité : enlever réactivité
  if (isRef(freshData)) {
    freshData = toRaw(freshData.value);
  }

  await $fetch(`/api/cache/${key}`, {
    method: 'POST',
    body: {
      value: freshData,
      ttl,
    },
  });

  return freshData;
};
