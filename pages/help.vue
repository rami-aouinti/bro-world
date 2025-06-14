<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <h1 class="text-h4 font-weight-bold mb-6">{{ t('help.title') }}</h1>

        <v-expansion-panels>
          <v-expansion-panel :title="t('help.questions.q1')">
            <v-expansion-panel-text>{{ t('help.questions.a1') }}</v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel :title="t('help.questions.q2')">
            <v-expansion-panel-text>{{ t('help.questions.a2') }}</v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel :title="t('help.questions.q3')">
            <v-expansion-panel-text>{{ t('help.questions.a3') }}</v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel :title="t('help.questions.q4')">
            <v-expansion-panel-text>{{ t('help.questions.a4') }}</v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel :title="t('help.questions.q5')">
            <v-expansion-panel-text>{{ t('help.questions.a5') }}</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
