<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
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
import { computed } from 'vue'

const { t, locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')

definePageMeta({
  layout: 'default',
  description: 'Help page',
  breadcrumb: 'disabled',
})
</script>
