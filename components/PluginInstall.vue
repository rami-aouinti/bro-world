<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="plugin-card mx-1"
      :class="[{ 'is-rtl': isRtl }, isHovering ? 'elevated' : '']"
      rounded="xl"
      variant="outlined"
      elevation="0"
      min-height="120"
    >
      <!-- Header -->
      <div class="card-header d-flex align-center justify-space-between px-4 py-3">
        <div class="d-flex align-center text-truncate">
          <v-icon size="20" class="me-2">{{ plugin.icon }}</v-icon>
          <span class="text-subtitle-1 font-weight-medium text-truncate">
            {{ plugin.name }}
          </span>
        </div>

      </div>

      <v-divider />

      <!-- Body -->
      <div class="px-4 py-4 d-flex align-center justify-space-between">
        <!-- Pricing -->
        <v-chip
          :color="isFree ? 'deep-purple' : 'warning'"
          size="small"
          variant="tonal"
          class="text-uppercase font-weight-bold"
          label
        >
          {{ plugin.pricing }}
        </v-chip>

        <!-- Actions -->
        <div class="d-flex align-center">
          <v-tooltip :text="plugin.active ? t('plugin.actions.deactive') : t('plugin.actions.active')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :color="plugin.active ? 'error' : 'success'"
                :variant="plugin.active ? 'tonal' : 'flat'"
                :loading="loading"
                rounded="xl"
                size="small"
                class="action-btn"
                @click="togglePlugin(plugin)"
                :aria-label="plugin.active ? t('plugin.actions.deactive') : t('plugin.actions.active')"
              >
                <v-icon start>
                  {{ plugin.active ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline' }}
                </v-icon>
                {{ plugin.active ? t('plugin.actions.deactive') : t('plugin.actions.active') }}
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const loading = ref(false)

const props = defineProps<{
  plugin: {
    key: string
    name: string
    icon: string
    pricing: string // ex. "FREE" / "PAID" traduits
    active: boolean
    installed?: boolean
  }
}>()

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

// Évite la comparaison fragile avec un libellé traduit
const isFree = computed(() =>
  (props.plugin?.pricing || '').toString().toLowerCase()
  === t('plugin.pricing.free').toLowerCase()
)

async function togglePlugin (plugin: any) {
  try {
    loading.value = true
    const { data, error } = await useFetch(`/api/plugin/toggle/${plugin.key}`, {
      method: 'POST',
      body: {},
    })

    if (error?.value) {
      throw new Error(error.value.message || 'Toggle failed')
    }

    plugin.installed = true
    plugin.active = !plugin.active
    Notify.success(
      plugin.active
        ? t('plugin.success.enabled', { name: plugin.name })
        : t('plugin.success.disabled', { name: plugin.name })
    )
  } catch (e: any) {
    console.error(e)
    Notify.error(e?.message || t('plugin.errors.toggle'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.plugin-card {
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.6);
  background:
    radial-gradient(1200px 200px at 10% -20%, rgba(var(--v-theme-primary), 0.06), transparent 60%),
    radial-gradient(1200px 200px at 110% 120%, rgba(var(--v-theme-secondary), 0.06), transparent 60%),
    rgb(var(--v-theme-surface));
  transition: box-shadow .2s ease, transform .15s ease, border-color .2s ease;
}
.plugin-card.elevated {
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  transform: translateY(-1px);
  border-color: rgba(var(--v-theme-primary), 0.35);
}

.card-header .v-icon {
  opacity: .9;
}

.action-btn :deep(.v-btn__content) {
  font-weight: 600;
}

/* RTL helper */
.is-rtl {
  direction: rtl;
}
.is-rtl .me-2 { margin-inline-start: .5rem !important; margin-inline-end: 0 !important; }
</style>
