<script setup lang="ts">
import { ref } from 'vue'

const { data: globals } = await useFetch('/api/global')
const { data: individuals } = await useFetch('/api/individual')
const { data: segments } = await useFetch('/api/segment')
const { data: workplaces } = await useFetch('/api/workplace')
const loading = ref(false)
const showAfterDate = ref(true)
const valid = ref(false)
const form = ref({
  channel: 'SMS',
  smsContent: '',
  smsSenderName: '',
  scope: 'GLOBAL',
  scopeTarget: [],
  sendAfter: '2025-05-10T23:30:00'
})

function resetForm() {
  form.value = {
    channel: 'SMS',
    smsContent: '',
    smsSenderName: '',
    scope: 'INDIVIDUAL',
    scopeTarget: [],
    sendAfter: '2025-05-10T23:30:00'
  };
}

const users = ref([])
const sendNotification = async () => {
  loading.value = true
  if (form.value.scope === 'INDIVIDUAL') {
    users.value = individuals.value.map(user => user.id);
  }

  if (form.value.scope === 'GLOBAL') {
    users.value = globals.value.map(user => user.id);
  }

  if (form.value.scope === 'SEGMENT') {
    users.value = segments.value.map(user => user.id);
  }

  if (form.value.scope === 'WORKPLACE') {
    users.value = workplaces.value.map(user => user.id);
  }

  const formData = new FormData();
  formData.append('channel', form.value.channel);
  formData.append('smsContent', form.value.smsContent);
  formData.append('smsSenderName', form.value.smsSenderName);
  formData.append('scope', form.value.scope);
  formData.append('sendAfter', form.value.sendAfter);
  formData.append('scopeTarget', JSON.stringify(users.value));

  try {
    const authResponse = await fetch('https://localhost/api/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'tkd-test',
        password: 'tkd-password'
      })
    })

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate')
    }

    const authData = await authResponse.json()
    const token = authData.token

    const response = await fetch('https://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    })

    if (!response.ok) throw new Error('Failed to send')

    const data = await response.json()
    console.log('Success:', data)
    loading.value = false
    resetForm()
    Notify.success(data.status)
  } catch (error) {
    console.error('Error:', error)
    Notify.error(error)
  }
}
</script>
<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto"
  >
    <v-card-item>
      <template #title>
        <v-row align="center" justify="space-between" no-gutters>
          <v-col class="d-flex align-center" cols="auto">
            <v-icon class="me-2" color="primary" icon="mdi-cellphone" size="28" />
            <span class="text-subtitle-1 font-weight-medium">Sms Notification</span>
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="showAfterDate"
              label="Now"
              density="compact"
              hide-details
            />
          </v-col>
        </v-row>
      </template>
      <v-divider></v-divider>
      <div>
        <v-form v-model="valid">
          <v-row class="pa-2">
            <v-col cols="12" md="6">
              <v-text-field v-model="form.smsContent" label="SMS Content" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.smsSenderName" label="Sender Name" required />
            </v-col>
            <v-col cols="12" md="12">
              <v-select
                v-model="form.scope"
                :items="['INDIVIDUAL', 'WORKPLACE', 'SEGMENT', 'GLOBAL']"
                label="Scope"
                required
              />
            </v-col>
            <v-col cols="12" md="12" v-if="!showAfterDate">
              <v-text-field
                v-model="form.sendAfter"
                label="Send After (YYYY-MM-DDTHH:MM:SS)"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card-item>

    <v-card-actions class="justify-end">
      <v-btn
        color="primary"
        variant="flat"
        width="60"
        rounded
      >
        <v-icon
          icon="mdi-step-forward"
          size="18"
          @click="sendNotification"
        ></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
</style>
