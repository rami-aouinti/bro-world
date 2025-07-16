<template>
  <v-app>
    <v-overlay :model-value="isLoading" class="z-loader" persistent>
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>

    <AppDrawer :right="isRtl" :mobile="mobile" aria-label="Main navigation" role="navigation" />
    <AppBar :rtl="isRtl" @toggleSettingsDrawer="showSettingsDrawer = $event" aria-label="Top application bar" role="banner" />

    <v-main role="main" aria-label="Main content">
      <v-container fluid class="pa-0">
        <Suspense>
          <template #default>
            <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" @vue:beforeMount="startLoading" @vue:mounted="stopLoading" />
          </template>
          <template #fallback>
            <v-progress-linear indeterminate color="primary" height="3" aria-label="Loading content" role="progressbar" />
          </template>
        </Suspense>
      </v-container>
    </v-main>
    <AppFooter aria-label="Application footer" role="contentinfo" />
    <SettingsDrawer
      :show-settings-drawer="showSettingsDrawer"
      @toggleSettingsDrawer="showSettingsDrawer = $event"
      aria-label="Settings drawer"
      role="complementary"
    />

    <Analytics />
    <SpeedInsights />
  </v-app>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#app'
import {shallowRef, ref, watch, computed, onMounted} from 'vue'
import { useDisplay } from 'vuetify'
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
const showSettingsDrawer = ref(false)
const { mobile } = useDisplay()
const isLoading = ref(true)
function updateHtmlAttrs() {
  if (!process.client) return

  document.documentElement.setAttribute('lang', locale.value)
  document.documentElement.setAttribute('dir', isRtl.value ? 'rtl' : 'ltr')
  document.body.classList.toggle('rtl', isRtl.value)
  document.body.classList.toggle('ltr', !isRtl.value)

  if ($vuetify?.locale) {
    $vuetify.locale.current = locale.value
  }
}

onMounted(() => {
  updateHtmlAttrs()
  stopLoading()
})

watch(locale, updateHtmlAttrs)

function startLoading() {
  isLoading.value = true
}

function stopLoading() {
  isLoading.value = false
}
</script>

<style>
html, body, #__nuxt, .v-application {
  margin: 0;
}
.v-main {
  padding-top: 0;
  padding-bottom: 0;
  /* https://github.com/vuetifyjs/vuetify/issues/15202 */
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
  /* margin-top: var(--v-layout-top);
  margin-bottom: var(--v-layout-bottom);
  height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom)); */
  overflow-y: auto;
  transition-property: padding;
  transition: padding-left 0.3s ease;
}
.v-application--wrap {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.main-content {
  min-height: calc(100vh - 64px - 64px); /* header + footer */
  padding-top: 64px;
  padding-bottom: 64px;
  position: relative;
  z-index: 1;
  padding-left: 256px; /* drawer width */
  transition: padding-left 0.3s ease;
}

@media (max-width: 960px) {
  .main-content {
    padding-left: 0;
  }
}

.v-application .v-app-bar {
  height: 64px;
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  align-items: center;
}

.v-application .v-footer {
  height: 64px;
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}



.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.z-loader {
  z-index: 3000;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
