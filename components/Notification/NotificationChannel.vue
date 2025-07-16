<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PushNotification from '~/components/Notification/PushNotification.vue'
import SmsNotification from '~/components/Notification/SmsNotification.vue'
import EmailNotification from '~/components/Notification/EmailNotification.vue'
import BatchEmailNotification from '~/components/Notification/BatchEmailNotification.vue'

const channelStep = ref(true)
const emailStep = ref(false)

const emailForm = ref(false)
const emailBatchForm = ref(false)
const pushForm = ref(false)
const smsForm = ref(false)

const templates = ref([])
const loading = ref(true)
async function fetchTemplates() {
  const { data } = await useFetch('/api/admin/notification/templates')
  if (data.value) {
    templates.value = data.value
    loading.value = false
  }
}

watch(loading, () => {
  fetchTemplates()
}, { immediate: true })
onMounted(await fetchTemplates)

function handleClickNavigation(
  isSelected: boolean,
  toggle: () => void,
  channel: string
) {
  if (!isSelected) {
    toggle()

    channelStep.value = false
    emailStep.value = false
    emailForm.value = false
    emailBatchForm.value = false
    pushForm.value = false
    smsForm.value = false

    switch (channel) {
      case 'push':
        pushForm.value = true
        break
      case 'sms':
        smsForm.value = true
        break
      case 'email':
        emailStep.value = true
        break
      case 'individual':
        emailForm.value = true
        break
      case 'batch':
        emailBatchForm.value = true
        break
    }
  }
}
</script>

<template>
  <v-card-item>
    <v-item-group selected-class="bg-primary">
      <v-container>
        <!-- Main Channels -->
        <v-row v-if="channelStep" justify="center" align="center">
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-item v-slot="{ isSelected, selectedClass, toggle }">
              <v-card
                :class="['d-flex align-center justify-center', selectedClass]"
                style="width: 200px; height: 200px"
                @click="handleClickNavigation(isSelected, toggle, 'push')"
              >
                <div class="text-h4 text-center">
                  {{ isSelected ? 'Selected' : 'PUSH' }}
                </div>
              </v-card>
            </v-item>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-item v-slot="{ isSelected, selectedClass, toggle }">
              <v-card
                :class="['d-flex align-center justify-center', selectedClass]"
                style="width: 200px; height: 200px"
                @click="handleClickNavigation(isSelected, toggle, 'sms')"
              >
                <div class="text-h4 text-center">
                  {{ isSelected ? 'Selected' : 'SMS' }}
                </div>
              </v-card>
            </v-item>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-item v-slot="{ isSelected, selectedClass, toggle }">
              <v-card
                :class="['d-flex align-center justify-center', selectedClass]"
                style="width: 200px; height: 200px"
                @click="handleClickNavigation(isSelected, toggle, 'email')"
              >
                <div class="text-h4 text-center">
                  {{ isSelected ? 'Selected' : 'EMAIL' }}
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>

        <!-- Email Sub-options -->
        <v-row v-if="emailStep" justify="center" align="center">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-item v-slot="{ isSelected, selectedClass, toggle }">
              <v-card
                :class="['d-flex align-center justify-center', selectedClass]"
                style="width: 300px; height: 200px"
                @click="handleClickNavigation(isSelected, toggle, 'individual')"
              >
                <div class="text-h4 text-center">
                  {{ isSelected ? 'Selected' : 'INDIVIDUAL' }}
                </div>
              </v-card>
            </v-item>
          </v-col>

          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-item v-slot="{ isSelected, selectedClass, toggle }">
              <v-card
                :class="['d-flex align-center justify-center', selectedClass]"
                style="width: 300px; height: 200px"
                @click="handleClickNavigation(isSelected, toggle, 'batch')"
              >
                <div class="text-h4 text-center">
                  {{ isSelected ? 'Selected' : 'BATCH' }}
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>

        <!-- Forms -->
        <v-row v-if="pushForm" justify="center" align="center">
          <PushNotification />
        </v-row>

        <v-row v-if="smsForm" justify="center" align="center">
          <SmsNotification />
        </v-row>

        <v-row v-if="emailForm" justify="center" align="center">
          <EmailNotification :templates="templates" />
        </v-row>

        <v-row v-if="emailBatchForm" justify="center" align="center">
          <BatchEmailNotification :templates="templates" />
        </v-row>
      </v-container>
    </v-item-group>
  </v-card-item>
</template>
