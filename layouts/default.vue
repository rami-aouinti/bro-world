<template>
  <v-app>
    <AppDrawer :right="isRtl" />
    <AppBar :rtl="isRtl" @toggleSettingsDrawer="showSettingsDrawer = $event" />
    <v-main>
      <NuxtPage />
    </v-main>

    <SettingsDrawer
      :show-settings-drawer="showSettingsDrawer"
      @toggleSettingsDrawer="showSettingsDrawer = $event"
    />

    <AppFooter />
    <Analytics />
    <SpeedInsights />
  </v-app>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#app'
import { onMounted, watch, ref, computed } from 'vue'
import AppFooter from '~/components/App/AppFooter.vue'
import AppDrawer from '~/components/App/AppDrawer.vue'
import AppBar from '~/components/App/AppBar.vue'
import SettingsDrawer from '~/components/App/SettingsDrawer.vue'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const { locale } = useI18n()
const { $vuetify } = useNuxtApp()

const rtlLanguages = ['ar']
const isRtl = computed(() => rtlLanguages.includes(locale.value))

const updateHtmlAttrs = () => {
  if (process.client) {
    document.documentElement.setAttribute('lang', locale.value)
    document.documentElement.setAttribute('dir', isRtl.value ? 'rtl' : 'ltr')
    document.body.classList.toggle('rtl', isRtl.value)
    document.body.classList.toggle('ltr', !isRtl.value)

    if ($vuetify?.locale) {
      $vuetify.locale.current = locale.value
    }
  }
}

onMounted(updateHtmlAttrs)
watch(locale, updateHtmlAttrs)

const showSettingsDrawer = ref(false)
</script>
