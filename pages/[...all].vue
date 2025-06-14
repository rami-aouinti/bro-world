<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <v-empty-state
    :headline="t('pageNotFound.headline')"
    :title="t('pageNotFound.title')"
    :text="t('pageNotFound.text')"
    image="/world-logo-primary.svg"
  >

  <div class="text-center mt-4">
    <v-btn to="/" color="primary">
      {{ t('pageNotFound.goHome') }}
    </v-btn>
  </div>
  </v-empty-state>
</template>
