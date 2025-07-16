<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <BasisMinibar></BasisMinibar>
      </teleport>
    </client-only>
    <v-row class="py-10">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">{{ t('about.title') }}</h1>

        <p class="mb-4">
          {{ t('about.intro1') }}
        </p>

        <p class="mb-4">
          {{ t('about.intro2') }}
        </p>

        <p class="mb-4">
          {{ t('about.intro3') }}
        </p>

        <v-divider class="my-6" />

        <p>
          {{ t('about.tech') }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BasisMinibar from "~/components/App/BasisMinibar.vue";
const { t } = useI18n()
import { onMounted, ref, nextTick } from 'vue'

const canTeleport = ref(false)
definePageMeta({
  layout: 'default',
  description: 'About page',
  title: 'About Us',
  meta: [
    { name: 'description', content: 'Learn more about our project and team.' },
    { name: 'keywords', content: 'about, project, team' },
  ],
  head: {
    title: 'About Us',
    meta: [
      { name: 'description', content: 'Learn more about our project and team.' },
      { name: 'keywords', content: 'about, project, team' },
    ],
  },
  breadcrumb: 'disabled',
  scrollToTop: true,
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
</script>
