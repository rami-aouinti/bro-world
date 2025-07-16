<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const form = ref(true)
const showAfterPushDate = ref(true)
const { data: globals } = await useFetch('/api/global')
const { data: individuals } = await useFetch('/api/individual')
const { data: segments } = await useFetch('/api/segment')
const { data: workplaces } = await useFetch('/api/workplace')
const valid = ref(false)
const formPush = ref({
  channel: 'PUSH',
  topic: '/user/notifications/',
  pushTitle: '',
  pushSubtitle: '',
  pushContent: '',
  scope: 'INDIVIDUAL',
  scopeTarget: [],
  sendAfter: '2024-06-01T10:00:00'
})

function resetForm() {
  formPush.value = {
    channel: 'PUSH',
    topic: '/user/notifications/',
    pushTitle: '',
    pushSubtitle: '',
    pushContent: '',
    scope: 'INDIVIDUAL',
    scopeTarget: [],
    sendAfter: '2024-06-01T10:00:00'
  };
}
const users = ref([])

const sendPushNotification = async () => {
  loading.value = true

  if (formPush.value.scope === 'INDIVIDUAL') {
    users.value = individuals.value.map(user => user.id);
  }

  if (formPush.value.scope === 'GLOBAL') {
    users.value = globals.value.map(user => user.id);
  }

  if (formPush.value.scope === 'SEGMENT') {
    users.value = segments.value.map(user => user.id);
  }

  if (formPush.value.scope === 'WORKPLACE') {
    users.value = workplaces.value.map(user => user.id);
  }
  const formData = new FormData();
  formData.append('channel', formPush.value.channel);
  formData.append('topic', formPush.value.topic);
  formData.append('pushTitle', formPush.value.pushTitle);
  formData.append('pushSubtitle', formPush.value.pushSubtitle);
  formData.append('pushContent', formPush.value.pushContent);
  formData.append('scope', formPush.value.scope);
  formData.append('sendAfter', formPush.value.sendAfter);
  formData.append('scopeTarget', JSON.stringify(users.value));
  const { data } = await useFetch('/api/admin/notification/create/notification', {
    method: 'POST',
    body: formData,
  })

  if (data.value) {
    console.log('Success:', data)
    loading.value = false
    resetForm()
    form.value = false;
    Notify.success(data.status)
  }
}
</script>
<template>
  <v-card
    v-if="form"
    :disabled="loading"
    :loading="loading"
    class="mx-auto"
  >
    <v-card-item>
      <template #title>
        <v-row align="center" justify="space-between" no-gutters>
          <v-col class="d-flex align-center" cols="auto">
            <v-icon class="me-2" color="primary" icon="mdi-bell" size="28" />
            <span class="text-subtitle-1 font-weight-medium">Push Notification</span>
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="showAfterPushDate"
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
          <v-row class="pa-3">
            <v-col cols="12" md="6">
              <v-text-field v-model="formPush.topic" label="Topic" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formPush.pushTitle" label="Title" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formPush.pushSubtitle" label="Subtitle" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formPush.pushContent" label="Content" required />
            </v-col>
            <v-col cols="12" md="12">
              <v-select
                v-model="formPush.scope"
                :items="['INDIVIDUAL', 'WORKPLACE', 'SEGMENT', 'GLOBAL']"
                label="Scope"
                required
              />
            </v-col>

            <v-col cols="12" md="12" v-if="!showAfterPushDate">
              <v-text-field
                v-model="formPush.sendAfter"
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
          @click="sendPushNotification"
        ></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-card
    v-else
    class="mx-auto"
  >
    <v-card-item>
      <h2>
        Push Generated
      </h2>
    </v-card-item>
  </v-card>
</template>
<style>
</style>
