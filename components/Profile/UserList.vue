<!-- components/UserList.vue -->
<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- Skeleton au chargement -->
    <template v-if="loading">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="list-item-two-line"
        class="mx-3 mb-3 rounded-xl"
        height="72"
      />
    </template>

    <!-- Liste des utilisateurs -->
    <div v-else>
      <v-card
        v-for="(user, i) in users"
        :key="user?.id || i"
        rounded="xl"
        class="mx-1 mb-2"
        variant="text"
        aria-label="User card"
      >
        <div class="d-flex align-center px-4 py-4">
          <v-row class="w-100" no-gutters>
            <!-- Infos utilisateur -->
            <v-col cols="8" class="d-flex align-center">
              <v-avatar size="40">
                <template v-if="user?.avatar">
                  <NuxtImg
                    format="webp"
                    loading="lazy"
                    :src="user?.avatar"
                    alt="User avatar"
                    cover
                  />
                </template>
                <template v-else>
                  <div class="d-flex align-center justify-center w-100 h-100 bg-primary text-white">
                    <span class="text-button">{{ initials(user) }}</span>
                  </div>
                </template>
              </v-avatar>

              <div class="ms-3 my-auto text-truncate">
                <NuxtLink
                  :to="`/user/${safeUsername(user)}`"
                  class="text-typo font-weight-bold text-decoration-none text-truncate"
                  :aria-label="`Open profile of ${displayName(user)}`"
                >
                  {{ displayName(user) }}
                </NuxtLink>
                <div class="text-caption text-medium-emphasis">
                  @{{ safeUsername(user) }}
                </div>
              </div>
            </v-col>

            <!-- Actions -->
            <v-col cols="4" class="d-flex align-center justify-end">
              <v-tooltip text="Message">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    color="primary"
                    :aria-label="`Message ${displayName(user)}`"
                    @click.stop="goToInbox(user)"
                  >
                    <v-icon>mdi-message-text-outline</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </v-card>

      <!-- État vide -->
      <v-alert
        v-if="!users?.length"
        type="info"
        variant="tonal"
        class="mx-3 mt-2"
        density="comfortable"
      >
        Aucun utilisateur à afficher.
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps<{
  users: Array<any>,
  loading?: boolean
}>()

const { locale } = useI18n()
const router = useRouter()

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const loading = computed(() => props.loading === true)

function safeUsername (u: any): string {
  return (u?.username ?? u?.slug ?? u?.id ?? '').toString()
}

function displayName (u: any): string {
  const base =
    u?.name ??
    u?.fullName ??
    `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim()
  return (base || safeUsername(u)).trim()
}

function initials (u: any): string {
  const name = displayName(u)
  const parts = name.split(' ').filter(Boolean)
  const two = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
  return two.toUpperCase()
}

function goToInbox (u: any) {
  if (!u?.id) return
  router.push(`/inbox/${u.id}`)
}
</script>
