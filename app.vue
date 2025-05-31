<script setup lang="ts">
const theme = useTheme()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined)),
)
const route = useRoute()
const title = computed(() => {
  return route.meta?.title || route.matched[0].meta?.title || ''
})
useHead({
  title,
  titleTemplate: (t) => (t ? `${t} | Bro World` : 'Bro World'),
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/earth_favicon.ico' }],
  meta: [
    {
      name: 'google-site-verification',
      content: 'TMfvcd4kWDKIVfrwdD3GFq6J9itPdd0ipFJdxO_yMro',
    },
  ],
  script: [
    {
      src: 'https://speed-insights.vercel.app/script.js',
      defer: true,
      'data-sample-rate': '100',
    },
  ],
})
useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  description: 'Bro World System',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image',
})

</script>

<template>
  <NuxtLayout />
</template>
