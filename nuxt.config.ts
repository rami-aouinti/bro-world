import { aliases } from 'vuetify/iconsets/mdi'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import compression from 'vite-plugin-compression'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
    'nuxt-auth-utils',
    'nuxt-echarts',
    '@nuxt/icon',
    '@nuxt/image',
    "@nuxtjs/fontaine",
    "@nuxt/content",
    "@nuxthq/studio",
    '@formkit/auto-animate/nuxt',
    "@morev/vue-transitions/nuxt",
    'nuxt3-leaflet',
    'nuxt-og-image',
    'nuxt-lazy-hydrate',
  ],

  plugins: [
    '~/plugins/vuetify-i18n.ts',
  ],

  sitemap: {
    siteUrl: 'https://bro-world-space.com',
    trailingSlash: false,
    gzip: true,
  },

  sourcemap: {
    server: true,
    client: true,
  },

  ui: {
    icons: ["heroicons", "lucide"],
  },

  css: ['~/assets/styles/index.css'],

  experimental: {
    typedPages: true,
    componentIslands: false,
    payloadExtraction: true,
  },

  typescript: {
    shim: false,
    strict: true,
  },

  vue: {
    propsDestructure: true,
  },

  vueuse: {
    ssrHandlers: true,
  },

  i18n: {
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', icon: 'fi-us us', file: 'en.json' },
      { code: 'de', name: 'Deutsch', iso: 'de-DE', icon: 'fi-de de', file: 'de.json' },
      { code: 'fr', name: 'Frensh', iso: 'fr-FR', icon: 'fi-fr fr', file: 'fr.json' },
      { code: 'ar', name: 'Arabic', iso: 'tn-TN', icon: 'fi-tn tn', file: 'ar.json' },
    ],
    baseUrl: 'https://bro-world-space.com'
  },

  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        viewportSize: true,
        prefersColorScheme: true,
        prefersColorSchemeOptions: {},
        reloadOnFirstRequest: true,
      },
    },
  },

  icon: {
    clientBundle: {
      icons: Object.values(aliases).map((v) => (v as string).replace(/^mdi-/, 'mdi:')),
      scan: true,
    },
    customCollections: [
      {
        prefix: 'custom',
        dir: './assets/icons',
      },
    ],
  },

  image: {
    dir: 'public',
    domains: ['images.unsplash.com'],
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280,
    },
    quality: 80,
    ipx: {
      dir: 'public',
      allowFiles: true,
      domains: [],
    },
    presets: {
      lcp: {
        modifiers: {
          format: 'webp',
          quality: 80,
        },
      },
    },
  },

  echarts: {
    charts: ['LineChart', 'BarChart', 'PieChart', 'RadarChart'],
    renderer: 'svg',
    components: [
      'DataZoomComponent',
      'LegendComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'GridComponent',
      'TitleComponent',
      'DatasetComponent',
      'VisualMapComponent',
    ],
  },

  vite: {
    plugins: [
      cssInjectedByJsPlugin(),
      compression({ algorithm: 'brotliCompress' }),
    ],
    build: {
      sourcemap: false,
      optimizeCSS: true,
      splitChunks: {
        layouts: true,
        pages: true,
        commons: true
      }
    },
  },

  runtimeConfig: {
    github: {
      clientId: '',
      clientSecret: '',
    },
    google: {
      clientId: '',
      clientSecret: '',
    },
    facebook: {
      clientId: '',
      clientSecret: '',
    },
    session: {
      name: 'nuxt-session',
      password: '',
    },
    public: {
      siteUrl: 'https://bro-world-space.com',
      apiBase: 'https://bro-world.org',
      apiBlogBase: 'https://blog.bro-world.org',
    },
  },

  compatibilityDate: '2024-08-05',
})
