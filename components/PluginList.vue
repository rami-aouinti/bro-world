<template>
  <v-container fluid>
    <v-card
      class="d-flex flex-column justify-space-between mx-3"
      rounded="xl"
      variant="text"
      min-height="180"
    >
      <v-toolbar :class="{ 'flex-row-reverse': isRtl }">
        <template #prepend>
          <div class="d-flex ga-1" v-if="isRtl">
            <v-btn icon="mdi-apps" />
          </div>
        </template>

        <v-toolbar-title class="flex-grow-1">
          <div
            class="d-flex align-center"
            :class="isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'"
          >
            <v-icon :class="isRtl ? 'ms-2' : 'me-2'">
              {{ plugin.icon }}
            </v-icon>
            <span class="font-weight-medium text-h7">
              {{ plugin.name }}
            </span>
          </div>
        </v-toolbar-title>

        <template #append>
          <div class="d-flex ga-1" v-if="!isRtl">
            <v-btn icon="mdi-apps" />
          </div>
        </template>
      </v-toolbar>

      <v-divider />

      <v-card-text class="text-body-2 text-medium-emphasis">
        {{ truncate(plugin.description, 120) }}
      </v-card-text>

      <v-card-actions class="mt-auto d-flex align-center justify-space-between">
        <v-chip
          :color="plugin.pricing === t('plugin.pricing.free') ? 'green' : 'deep-purple'"
          size="small"
          class="text-uppercase font-weight-bold"
          label
        >
          {{ plugin.pricing }}
        </v-chip>

        <div class="d-flex align-center gap-2">
          <v-btn
            v-if="plugin.installed"
            color="success"
            variant="outlined"
            size="small"
            :to="plugin.link"
          >
            {{ t('plugin.actions.open') }}
          </v-btn>
          <v-btn
            v-else
            color="primary"
            variant="outlined"
            size="small"
            :loading="loading"
            @click="installPlugin(plugin)"
          >
            {{ t('plugin.actions.install') }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { truncate } from '~/utils/stringUtils'

const { locale, t } = useI18n()
const loading = ref(false)

const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
})

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

function installPlugin(plugin: any) {
  loading.value = true
  setTimeout(() => {
    plugin.installed = true
    loading.value = false
    Notify.success(t('plugin.success.install', { name: plugin.name }))
  }, 2000)
}
</script>
