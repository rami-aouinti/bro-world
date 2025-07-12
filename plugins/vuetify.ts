import type { IconProps } from 'vuetify'
import { Icon } from '#components'
import type { VDataTable } from 'vuetify/components'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useStorage } from '@vueuse/core'
import { aliases } from 'vuetify/iconsets/mdi'

import { useNuxtApp } from '#app'
import DateFnsAdapter from '@date-io/date-fns'
import enUS from 'date-fns/locale/en-US'
import frFR from 'date-fns/locale/fr'
import deDE from 'date-fns/locale/de'
import arSA from 'date-fns/locale/ar-SA'
import { en, fr, de, ar } from 'vuetify/locale'

import '@/assets/styles/material-dashboard.scss'
import "flag-icons"

export type DataTableHeaders = VDataTable['$props']['headers']

export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = useNuxtApp()
  const currentLocale = useStorage('locale', 'en').value
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    // 🧩 Utiliser la locale de Nuxt i18n pour Vuetify


    vuetifyOptions.date = {
      adapter: DateFnsAdapter,
      locale: {
        en: enUS,
        fr: frFR,
        de: deDE,
        ar: arSA,
      },
    }

    // 📦 Composants expérimentaux
    vuetifyOptions.components = {
      ...(vuetifyOptions.components ?? {}),
      VDateInput,
    }

    // 🎨 Thème dynamique
    const primary = useStorage('theme-primary', '#E91E63').value
    vuetifyOptions.theme = {
      themes: {
        light: { colors: { primary } },
        dark: { colors: { primary } },
      },
    }

    // 🖼️ Icônes personnalisées
    vuetifyOptions.icons = {
      defaultSet: 'nuxtIcon',
      sets: {
        nuxtIcon: {
          component: ({ icon, tag, ...rest }: IconProps) =>
            h(tag, rest, [
              h(Icon, { name: (aliases[icon as string] as string) ?? icon }),
            ]),
        },
      },
      aliases,
    }
  })
})
