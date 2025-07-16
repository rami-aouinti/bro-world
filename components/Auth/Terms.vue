<template>
  <v-container class="py-10">
    <div
      v-for="index in 9"
      :key="index"
      class="mb-6"
      :class="isRtl ? 'text-end' : 'text-start'"
    >
      <div class="w-100">
        <h4 class="font-weight-bold mb-2">
          {{ t(`terms.${index}.title`) }}
        </h4>
      </div>
      <p class="text-body-1 white-space-pre-line">
        {{ t(`terms.${index}.text`) }}
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
</script>
