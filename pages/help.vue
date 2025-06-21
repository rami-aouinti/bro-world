<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <h1 class="text-h4 font-weight-bold mb-6 text-align-auto">
          {{ t('help.title') }}
        </h1>

        <v-expansion-panels>
          <v-expansion-panel>
            <template #title>
              <div class="text-align-auto">{{ t('help.questions.q1') }}</div>
            </template>
            <v-expansion-panel-text>
              {{ t('help.questions.a1') }}
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <template #title>
              <div class="text-align-auto">{{ t('help.questions.q2') }}</div>
            </template>
            <v-expansion-panel-text>
              {{ t('help.questions.a2') }}
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <template #title>
              <div class="text-align-auto">{{ t('help.questions.q3') }}</div>
            </template>
            <v-expansion-panel-text>
              {{ t('help.questions.a3') }}
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <template #title>
              <div class="text-align-auto">{{ t('help.questions.q4') }}</div>
            </template>
            <v-expansion-panel-text>
              {{ t('help.questions.a4') }}
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <template #title>
              <div class="text-align-auto">{{ t('help.questions.q5') }}</div>
            </template>
            <v-expansion-panel-text>
              {{ t('help.questions.a5') }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
definePageMeta({
  layout: 'default',
  description: 'Help page',
  breadcrumb: 'disabled',
})
</script>
