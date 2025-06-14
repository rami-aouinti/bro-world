<template>
  <v-app>
    <AppDrawer />
    <AppBar @toggleSettingsDrawer="showSettingsDrawer = $event" />

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
import { onMounted, watch, ref } from 'vue'
import AppFooter from '~/components/App/AppFooter.vue'
import AppDrawer from '~/components/App/AppDrawer.vue'
import AppBar from '~/components/App/AppBar.vue'
import SettingsDrawer from '~/components/App/SettingsDrawer.vue'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const { locale } = useI18n()
const { rtl } = useRtl()
const { $vuetify } = useNuxtApp()

const rtlLanguages = ['ar']
const isRtl = computed(() => rtlLanguages.includes(locale.value))


const updateHtmlAttrs = () => {
  if (process.client) {
    document.documentElement.setAttribute('lang', locale.value)
    document.documentElement.setAttribute('dir', isRtl.value ? 'rtl' : 'ltr')
    document.body.classList.toggle('rtl', isRtl.value)
    document.body.classList.toggle('ltr', !isRtl.value)

    // ✅ met à jour Vuetify RTL
    if ($vuetify?.locale) {
      $vuetify.locale.current = locale.value
    }
  }
}

onMounted(updateHtmlAttrs)
watch(locale, updateHtmlAttrs)

const showSettingsDrawer = ref(false)
</script>


<style scoped>
.v-main {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
  overflow-y: auto;
  transition-property: padding;
}
</style>
