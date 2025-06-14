<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
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
const { t } = useI18n()
</script>
