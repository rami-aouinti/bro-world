export default defineNuxtPlugin(() => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()

  const baseUrl = runtimeConfig.public.siteUrl || ''
  const canonicalUrl = computed(() => baseUrl + route.fullPath)

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl.value,
      },
    ],
  })
})
