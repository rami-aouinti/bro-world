<script setup lang="ts">
const theme = useTheme()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined)),
)

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const baseUrl = runtimeConfig.public.siteUrl || 'https://bro-world-space.com'
const canonicalUrl = computed(() => baseUrl + route.fullPath)

const title = computed(() => {
  return route.meta?.title || route.matched[0]?.meta?.title || ''
})

const description = computed(() => {
  return route.meta?.description || route.matched[0]?.meta?.description || 'Welcome to Bro World — your unique community platform.'
})

useHead({
  title,
  titleTemplate: (t) => (t ? `${t} | Bro World` : 'Bro World'),
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', href: '/earth_favicon.ico' },
    { rel: 'canonical', href: canonicalUrl.value },
  ],
  meta: [
    {
      name: 'google-site-verification',
      content: 'TMfvcd4kWDKIVfrwdD3GFq6J9itPdd0ipFJdxO_yMro',
    },
  ]
})

useSeoMeta({
  description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
})
</script>


<template>
  <NuxtLayout />
</template>
