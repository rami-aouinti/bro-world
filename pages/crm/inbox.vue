<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFetch } from '#app'
import type { Mail } from '~/types'

const tabItems = [{ label: 'All' }, { label: 'Unread' }]
const selectedTab = ref(0)

const dropdownItems = [
  [
    { label: 'Mark as unread', icon: 'i-heroicons-check-circle' },
    { label: 'Mark as important', icon: 'i-heroicons-exclamation-circle' },
  ],
  [
    { label: 'Star thread', icon: 'i-heroicons-star' },
    { label: 'Mute thread', icon: 'i-heroicons-pause-circle' },
  ],
]

const { data: mails } = await useFetch<Mail[]>('/api/mails', { default: () => [] })

const filteredMails = computed(() => {
  if (selectedTab.value === 1) return mails.value.filter(m => !!m.unread)
  return mails.value
})

const selectedMail = ref<Mail | null>(null)

const isMailPanelOpen = computed({
  get() { return !!selectedMail.value },
  set(v: boolean) { if (!v) selectedMail.value = null },
})

watch(filteredMails, () => {
  if (!filteredMails.value.find(m => m.id === selectedMail.value?.id)) {
    selectedMail.value = null
  }
})

// pour le menu "Snooze" (date picker)
const snoozeMenu = ref(false)
</script>

<template>
  <v-container fluid class="py-0">
    <v-row no-gutters>
      <!-- Colonne gauche : Inbox -->
      <v-col cols="12" lg="4" class="border-e">
        <v-card flat>
          <v-toolbar flat density="comfortable">
            <v-toolbar-title>Inbox</v-toolbar-title>
            <v-chip size="small" class="ms-2" :text="String(filteredMails.length)" />
            <v-spacer />

            <!-- Tabs -->
            <div class="d-flex align-center">
              <v-tabs v-model="selectedTab" density="comfortable" slider-color="primary">
                <v-tab
                  v-for="(t, i) in tabItems"
                  :key="i"
                  :value="i"
                  :text="t.label"
                />
              </v-tabs>
            </div>
          </v-toolbar>

          <!-- Liste -->
          <InboxList v-model="selectedMail" :mails="filteredMails" />
        </v-card>
      </v-col>

      <!-- Colonne droite : Mail panel -->
      <v-col cols="12" lg="8">
        <v-card flat class="h-100 d-flex flex-column">
          <template v-if="selectedMail">
            <v-toolbar flat density="comfortable">
              <!-- Bouton fermer (mobile) -->
              <v-btn
                class="d-lg-none"
                variant="text"
                icon
                @click="isMailPanelOpen = false"
              >
                <v-icon>i-heroicons-x-mark</v-icon>
              </v-btn>

              <v-divider class="mx-2 d-lg-none" vertical />

              <!-- Left actions -->
              <div class="d-flex align-center">
                <v-tooltip text="Archive" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text">
                      <v-icon>i-heroicons-archive-box</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Move to junk" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text">
                      <v-icon>i-heroicons-archive-box-x-mark</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-divider class="mx-2" vertical />

                <!-- Snooze (popover -> v-menu + v-date-picker) -->
                <v-menu
                  v-model="snoozeMenu"
                  :close-on-content-click="false"
                  location="bottom start"
                >
                  <template #activator="{ props: act }">
                    <v-tooltip text="Snooze" location="bottom">
                      <template #activator="{ props: tip }">
                        <v-btn
                          v-bind="{ ...act, ...tip }"
                          icon
                          variant="text"
                          :class="[snoozeMenu && 'bg-grey-lighten-4']"
                        >
                          <v-icon>i-heroicons-clock</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>

                  <v-sheet class="pa-3">
                    <v-date-picker
                      @update:modelValue="() => (snoozeMenu = false)"
                    />
                  </v-sheet>
                </v-menu>
              </div>

              <v-spacer />

              <!-- Right actions -->
              <div class="d-flex align-center">
                <v-tooltip text="Reply" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text">
                      <v-icon>i-heroicons-arrow-uturn-left</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Forward" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text">
                      <v-icon>i-heroicons-arrow-uturn-right</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>

                <v-divider class="mx-2" vertical />

                <!-- v-dropdown -> v-menu -->
                <v-menu location="bottom end">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text">
                      <v-icon>i-heroicons-ellipsis-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="comfortable">
                    <template v-for="(group, gi) in dropdownItems" :key="gi">
                      <v-list-item
                        v-for="(item, ii) in group"
                        :key="`${gi}-${ii}`"
                        @click=""
                      >
                        <template #prepend>
                          <v-icon>{{ item.icon }}</v-icon>
                        </template>
                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                      </v-list-item>

                      <v-divider v-if="gi < dropdownItems.length - 1" />
                    </template>
                  </v-list>
                </v-menu>
              </div>
            </v-toolbar>

            <!-- Contenu du mail -->
            <v-divider />
            <div class="flex-grow-1 overflow-auto">
              <InboxMail :mail="selectedMail" />
            </div>
          </template>

          <template v-else>
            <div class="flex-grow-1 d-none d-lg-flex align-center justify-center">
              <v-icon size="128" class="text-grey">i-heroicons-inbox</v-icon>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
