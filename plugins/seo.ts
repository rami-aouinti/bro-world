export default defineNuxtPlugin(() => {
  const route = useRoute()
  const description = computed(() =>
    route.meta?.description || 'Welcome to Bro World, your unique community platform.'
  )

  useSeoMeta({
    description,
    ogDescription: description,
    twitterDescription: description,
  })
})
