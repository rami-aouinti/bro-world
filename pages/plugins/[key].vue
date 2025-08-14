<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: v => { theme.global.name.value = v ? 'dark' : 'light' },
})
const route = useRoute()
const { t } = useI18n()
const canTeleport = ref(false)
const key = computed(() => String(route.params.key))

// Utilise useFetch pour avoir pending/error/refresh
const { data, error, pending, refresh } = await useFetch(
  () => `/api/plugin/plugin/${key.value}`,
  { server: false, key: `plugin-${key.value}` }
)

// Plugin normalisé (data.value peut être null au tout début)
const plugin = computed(() => data.value as any | null)

// Actions simples
function goToLink() {
  if (plugin.value?.link) {
    navigateTo(plugin.value.link)
  }
}

async function toggleInstall() {
  if (!plugin.value) return
  try {
    // à adapter selon ton API install/uninstall
    const endpoint = plugin.value.installed
      ? `/api/plugin/${key.value}/uninstall`
      : `/api/plugin/${key.value}/install`

    await $fetch(endpoint, { method: 'POST' })
    await refresh()
  } catch (e) {
    console.error('Install/Uninstall failed', e)
  }
}

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
definePageMeta({
  layout: 'default',
  breadcrumb: 'disabled',
  title: 'Plugin details',
  scrollToTop: true,
})
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <v-list class="custom-list" nav :lines="false">
          <MotionGroup preset="slideVisibleLeft" :duration="600">
            <v-list-item-title
              class="text-subtitle-2 text-uppercase font-weight-bold"
              :class="isDark ? 'text-white' : 'text-default'"
            >
              <div class="text-default"><b>Plugin </b> {{ plugin.key }}</div>
            </v-list-item-title>
            <v-list-item-title
              class="text-subtitle-2 text-uppercase font-weight-bold"
              :class="isDark ? 'text-white' : 'text-default'"
            >
              <div class="text-default" v-if="plugin.pricing"><b>Pricing : </b> {{ plugin.pricing }}</div>
            </v-list-item-title>
            <v-list-item-title
              class="text-subtitle-2 text-uppercase font-weight-bold"
              :class="isDark ? 'text-white' : 'text-default'"
            >
              <div class="text-default"><b>Installed : </b> {{ plugin.installed ? 'Yes' : 'No' }}</div>
            </v-list-item-title>
          </MotionGroup>
        </v-list>
      </teleport>
    </client-only>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ t('common.error') || 'Error' }} — {{ error?.message || 'Failed to load plugin' }}
      <div class="mt-2">
        <v-btn size="small" variant="tonal" @click="refresh()">
          {{ t('common.retry') || 'Retry' }}
        </v-btn>
      </div>
    </v-alert>

    <v-skeleton-loader
      v-if="pending"
      type="card, article"
      class="rounded-xl"
      height="300"
    />

    <template v-else-if="plugin">
      <v-card rounded="xl" elevation="4" class="mb-4">
        <v-card-item class="d-flex align-center ga-3">
          <v-avatar v-if="plugin.logo" size="48" rounded="lg">
            <img :src="plugin.logo" :alt="plugin.name" />
          </v-avatar>
          <div>
            <div class="text-h5 d-flex align-center ga-2">
              <v-icon v-if="plugin.icon" :icon="plugin.icon" size="18" class="me-1" />
              {{ plugin.name }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ plugin.subTitle }}
            </div>
          </div>
        </v-card-item>

        <v-divider />

        <v-card-text>
          <!-- Description -->
          <div v-if="plugin.description" class="mb-4">
            <div class="text-subtitle-2 font-weight-bold mb-1">Description</div>
            <div class="text-body-2">
              {{ plugin.description }}
            </div>
          </div>

          <!-- CTA principal selon action/link -->
          <div class="d-flex ga-2">
            <v-btn
              v-if="plugin.action === 'open' && plugin.link"
              color="primary"
              prepend-icon="mdi-open-in-new"
              @click="goToLink"
            >
              Open
            </v-btn>

            <v-btn
              :color="plugin.installed ? 'secondary' : 'primary'"
              :prepend-icon="plugin.installed ? 'mdi-trash-can-outline' : 'mdi-download'"
              @click="toggleInstall"
            >
              {{ plugin.installed ? 'Uninstall' : 'Install' }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- README éventuel si un jour ton API le renvoie -->
      <v-card v-if="plugin.readme" rounded="xl" elevation="4">
        <v-card-title>README</v-card-title>
        <v-divider />
        <v-card-text style="white-space: pre-wrap">
          {{ plugin.readme }}
        </v-card-text>
      </v-card>
    </template>

    <v-alert v-else type="warning" variant="tonal">
      Plugin not found.
    </v-alert>
  </v-container>
</template>
<style scoped>
.custom-list {
  background-color: transparent;
}
</style>
