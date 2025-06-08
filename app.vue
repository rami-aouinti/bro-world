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
  return route.meta?.title || route.matched[0]?.meta?.title || 'Bro World'
})

const description = computed(() => {
  return route.meta?.description || route.matched[0]?.meta?.description || 'Welcome to Bro World — your unique community platform.'
})

const keywords = computed(() => {
  return route.meta?.description || route.matched[0]?.meta?.description || 'social, Bro world, Community'
})

useHead({
  title,
  titleTemplate: (t) => (t ? `${t} | Bro World` : 'Bro World'),
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', href: '/earth_favicon.ico' },
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
    {
      hid: 'gtm-script',
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N632XHTD');`,
      type: 'text/javascript'
    }
  ],
  __dangerouslyDisableSanitizersByTagID: {
    'gtm-script': ['innerHTML']
  }
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
  <noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N632XHTD"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
  </noscript>
  <NuxtLayout />
</template>
