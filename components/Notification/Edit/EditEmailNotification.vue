<script setup lang="ts">
import { ref, defineProps } from 'vue'
const loading = ref(false)
const valid = ref(false)
const props = defineProps({
  notification: { type: Array, default: () => [] }
})

const form = ref({
  channel: props.notification.channel,
  scope: props.notification.scope,
  emailSubject: props.notification.emailSubject,
  emailContentPlain: props.notification.emailContentPlain,
  emailContentHtml: props.notification.emailContentHtml,
  templateId: props.notification.templateId,
  sendAfter: props.notification.sendAfter,
  recipients: props.notification.recipients,
  emailSenderEmail: props.notification.emailSenderEmail,
  emailSenderName: props.notification.emailSenderName,
  emailRecipientsCc: props.notification.emailRecipientsCc,
  emailRecipientsBcc: props.notification.emailRecipientsBcc,
  emailRecipientsReplyTo: props.notification.emailRecipientsReplyTo,
  pdf_attachments: props.notification.pdf_attachments
})

const sendNotification = async () => {
  loading.value = true

  const payload = {
    ...form.value,
  }

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

    const response = await fetch('https://localhost/api/notifications/' + props.notification.id, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('Failed to send')

    const data = await response.json()
    console.log('Success:', data)
    loading.value = false
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
      <template v-slot:title>
        <v-icon
          class="me-1 pb-1"
          color="error"
          icon="mdi-cellphone"
          size="28"
        ></v-icon>

        Update Email Notification
      </template>
    </v-card-item>

    <v-form v-model="valid">
      <v-row class="pa-3">
        <v-col cols="12" md="6">
          <v-text-field v-model="form.scope" label="Scope" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="form.templateId" label="Template" />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="form.emailSubject" label="Subject" />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="form.emailContentPlain" label="Plain Content" />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="form.emailContentHtml" label="Html Content" />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="form.sendAfter"
            label="Send After (YYYY-MM-DDTHH:MM:SS)"
            required
          />
        </v-col>
      </v-row>
    </v-form>

    <v-divider></v-divider>

    <v-card-actions class="justify-end">
      <v-btn @click="$emit('cancelEdit')"> Close </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        width="60"
        text="Update"
        @click="sendNotification"
        rounded
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
</style>
