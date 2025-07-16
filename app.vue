<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useI18n } from 'vue-i18n'
import { useMercureGlobaleNotifications } from '~/composables/useMercureGlobaleNotifications'
import { useMercureNotifications } from '~/composables/useMercureNotifications'

const theme = useTheme()
const route = useRoute()
const { locale } = useI18n()
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.siteUrl || 'https://bro-world-space.com'

// Fournir le thème à l'application
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined))
)

// Canonical + SEO metas
const canonicalUrl = computed(() => baseUrl + route.fullPath)
const title = computed(() => route.meta?.title || route.matched[0]?.meta?.title || 'Bro World')
const description = computed(() =>
  route.meta?.description || route.matched[0]?.meta?.description || 'Welcome to Bro World — your unique community platform.'
)
const keywords = computed(() =>
  route.meta?.keywords || route.matched[0]?.meta?.keywords || 'social, Bro world, Community'
)

// SEO Head
useHead({
  title,
  titleTemplate: t => (t ? `${t} | Bro World` : 'Bro World'),
  htmlAttrs: {
    dir: computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr')),
    lang: computed(() => locale.value),
  },
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hrefLang: 'en', href: baseUrl + '/en' },
    { rel: 'alternate', hrefLang: 'de', href: baseUrl + '/de' },
    { rel: 'alternate', hrefLang: 'fr', href: baseUrl + '/fr' },
    { rel: 'alternate', hrefLang: 'ar', href: baseUrl + '/ar' },
    { rel: 'alternate', hrefLang: 'x-default', href: baseUrl + '/' },
  ],
  meta: [
    { name: 'google-site-verification', content: 'TMfvcd4kWDKIVfrwdD3GFq6J9itPdd0ipFJdxO_yMro' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
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
  author: "rami.aouinti@gmail.com",
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: '/social-img.png',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: '/social-img.png',
  twitterCard: 'summary_large_image',
  keywords,
  themeColor: '#e91e63',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  ogLocale: locale,
  ogSiteName: 'Bro World',
})

// Notifications
const { loggedIn, user } = await useUserSession()
const notificationsStarted = ref(false)

onMounted(() => {
  useMercureGlobaleNotifications()

  if (user.value && loggedIn && !notificationsStarted.value) {
    useMercureNotifications(user.value.id)
    notificationsStarted.value = true
  }
})
</script>

<template>
  <NuxtLayout />
</template>
