<script setup lang="ts">
const theme = useTheme()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined))
)
import { useMercureGlobaleNotifications } from '~/composables/useMercureGlobaleNotifications'
import { useMercureNotifications } from '~/composables/useMercureNotifications'

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

const keywords = computed(() => {
  return route.meta?.keywords || route.matched[0]?.meta?.keywords || 'social, Bro world, Community'
})
if (process.client) {
  useMercureGlobaleNotifications()
}
const { loggedIn, user } = await useUserSession()
const isMounted = ref(true)
// Démarre l'écoute Mercure dès que le site est chargé côté client
const init = async () => {
  if (process.client) {
    if (user.value) {
      useMercureNotifications(user.value.id)
      isMounted.value = false
    }
  }
  if (!loggedIn) {
    isMounted.value = false
  }
}

watch(isMounted, () => {
  init()
}, { immediate: true })

const { locale } = useI18n()

useHead({
  title,
  titleTemplate: (t) => (t ? `${t} | Bro World` : 'Bro World'),
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
  keywords: keywords,
  themeColor: '#091b2d',

  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
})
</script>

<template>
  <NuxtLayout />
</template>
<style scoped>
.tox {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.tox-editor-container {
  background-color: transparent !important;
}

.tox-edit-area__iframe {
  background-color: transparent !important;
}

.tox-sidebar-wrap {
  background-color: transparent !important;
}
.tox .tox-menubar {
  background-color: transparent !important;
}
.tox-edit-area {
  background-color: transparent !important;
  border: none !important;
}
</style>
