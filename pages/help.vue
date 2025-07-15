<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <BasisMinibar></BasisMinibar>
      </teleport>
    </client-only>
    <v-row class="py-10">
      <v-col cols="12">
        <h1 :class="['text-h4', 'font-weight-bold', 'mb-6', isRtl ? 'text-right' : 'text-left']">
          {{ t('help.title') }}
        </h1>

        <v-expansion-panels>
          <v-expansion-panel
            v-for="i in 5"
            :key="i"
          >
            <template #title>
              <div :dir="isRtl ? 'rtl' : 'ltr'" class="w-100">
                {{ t(`help.questions.q${i}`) }}
              </div>
            </template>
            <v-expansion-panel-text :class="isRtl ? 'text-right' : 'text-left'">
              {{ t(`help.questions.a${i}`) }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BasisMinibar from "~/components/App/BasisMinibar.vue";
import { onMounted, ref, computed, nextTick } from 'vue'

const { t, locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
const canTeleport = ref(false)
definePageMeta({
  layout: 'default',
  description: 'Help page',
  title: 'Help & Support',
  meta: [
    { name: 'description', content: 'Frequently asked questions and support information.' },
    { name: 'keywords', content: 'help, support, faq' },
  ],
  head: {
    title: 'Help & Support',
    meta: [
      { name: 'description', content: 'Frequently asked questions and support information.' },
      { name: 'keywords', content: 'help, support, faq' },
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
