<script setup lang="ts">
import { THEME_KEY } from 'vuetify'
const theme = useTheme()
provide(THEME_KEY, computed(() => (theme.current.value.dark ? 'dark' : undefined)))

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const baseUrl = runtimeConfig.public.siteUrl || 'https://bro-world-space.com'
const canonicalUrl = computed(() => baseUrl + route.fullPath)

const title = computed(() => {
  return route.meta?.title || route.matched[0]?.meta?.title || 'Bro World'
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

    // Multilingue
    { rel: 'alternate', hrefLang: 'en', href: baseUrl + '/en' },
    { rel: 'alternate', hrefLang: 'de', href: baseUrl + '/de' },
    { rel: 'alternate', hrefLang: 'fr', href: baseUrl + '/fr' },
    { rel: 'alternate', hrefLang: 'ar', href: baseUrl + '/ar' },
    { rel: 'alternate', hrefLang: 'x-default', href: baseUrl + '/' },
  ],
  meta: [
    { name: 'google-site-verification', content: 'TMfvcd4kWDKIVfrwdD3GFq6J9itPdd0ipFJdxO_yMro' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: canonicalUrl.value,
        name: 'Bro World',
        description: description.value,
      }),
    },
  ],
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: '/social-img.png',

  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '/social-img.png',
  twitterCard: 'summary_large_image',

  themeColor: '#091b2d',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
})
</script>

<template>
  <NuxtLayout />
</template>
