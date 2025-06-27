<script setup lang="ts">
import { ref, defineProps } from 'vue'
const valid = ref(false)
const showTemplateSelect = ref(false)
const loading = ref(false)
const showAfterDate = ref(true)
const selectedRecipients =
  [
    {
      "email": [
        {
          "address": "rami.aouinti@tkdeutschland.de",
          "name": "tkd"
        }
      ],
      "variables": {
        "recipient": "Chris Wernsmann",
        "return_date": "20.04.2026",
        "items_count": 2,
        "items": [
          {
            "count": 1,
            "name": "iPhone 13 128 GB Schwarz",
            "imei": "IMEIX/Z123",
            "reference": "REF500001",
            "return_reason": "Gerät Defekt"
          },
          {
            "count": 5,
            "name": "iPhone 14 128 GB Schwarz",
            "imei": "IMEIX/hjhjhj",
            "reference": "REF500003",
            "return_reason": "Vertragsende"
          },
          {
            "count": 2,
            "name": "iPhone 15 256 GB Schwarz",
            "imei": "IMEIX/asas",
            "reference": "REF500004",
            "return_reason": "Vertragsende"
          }
        ]
      }
    },
    {
      "email": [
        {
          "address": "rami.aouinti@gmail.com",
          "name": "rami",
          "isBcc": true
        }
      ],
      "variables": {
        "recipient": "Chris Wernsmann",
        "return_date": "20.04.2026",
        "items_count": 2,
        "items": [
          {
            "count": 1,
            "name": "iPhone 13 128 GB Schwarz",
            "imei": "IMEIX/Z123",
            "reference": "REF500001",
            "return_reason": "Gerät Defekt"
          },
          {
            "count": 5,
            "name": "iPhone 14 128 GB Schwarz",
            "imei": "IMEIX/hjhjhj",
            "reference": "REF500003",
            "return_reason": "Vertragsende"
          },
          {
            "count": 2,
            "name": "iPhone 15 256 GB Schwarz",
            "imei": "IMEIX/asas",
            "reference": "REF500004",
            "return_reason": "Vertragsende"
          }
        ]
      }
    }
  ];
const props = defineProps({
  templates: { type: Array, default: () => [] }
})
const emailBatchForm = ref({
  channel: 'EMAIL',
  recipients: [],
  emailSenderEmail: "admin@tkd360.com",
  emailSenderName: "admin",
  templateId: 0,
  emailSubject: '',
  emailContentPlain: '',
  emailContentHtml: '',
  scope: 'INDIVIDUAL',
  sendAfter: '2025-05-10T23:30:00',
  pdf_attachments: []
})

function resetForm() {
  emailBatchForm.value = {
    channel: 'EMAIL',
    recipients: [],
    emailSenderEmail: "admin@tkd360.com",
    emailSenderName: "admin",
    templateId: 0,
    emailSubject: '',
    emailContentPlain: '',
    emailContentHtml: '',
    scope: 'INDIVIDUAL',
    sendAfter: '2025-05-10T23:30:00',
    pdf_attachments: []
  };
}

async function sendBatchEmail() {
  loading.value = true
  emailBatchForm.value.templateId = emailBatchForm.value.templateId.templateId;

  const formData = new FormData();
  formData.append('channel', emailBatchForm.value.channel);
  formData.append('emailSenderEmail', emailBatchForm.value.emailSenderEmail);
  formData.append('emailSenderName', emailBatchForm.value.emailSenderName);
  formData.append('templateId', emailBatchForm.value.templateId);
  formData.append('emailSubject', emailBatchForm.value.emailSubject);
  formData.append('emailContentPlain', emailBatchForm.value.emailContentPlain);
  formData.append('emailContentHtml', emailBatchForm.value.emailContentHtml);
  formData.append('scope', emailBatchForm.value.scope);
  formData.append('sendAfter', emailBatchForm.value.sendAfter);
  formData.append('recipients', JSON.stringify(emailBatchForm.value.recipients));
  emailBatchForm.value.pdf_attachments.forEach((file, index) => {
    formData.append(`pdf_attachments[${index}]`, file);
  });

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

    const response = await fetch('https://localhost/api/notification/batch', {
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
            <v-icon class="me-2" color="primary" icon="mdi-email" size="28" />
            <span class="text-subtitle-1 font-weight-medium">Email Notification Batch</span>
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="showAfterDate"
              label="Now"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="auto">
            <v-checkbox
              v-model="showTemplateSelect"
              label="Template"
              density="compact"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </template>
      <v-divider></v-divider>
      <div>
        <v-row class="pa-3">
          <v-col>
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12" md="12"><v-autocomplete
                  v-model="emailBatchForm.recipients"
                  :items="selectedRecipients"
                  color="blue-grey-lighten-2"
                  item-title="name"
                  item-value="name"
                  label="Recipients"
                  chips
                  closable-chips
                  multiple
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      :prepend-avatar="item.raw.avatar"
                      :text="item.raw.email[0].address"
                    ></v-chip>
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :prepend-avatar="item.raw.avatar"
                      :title="item.raw.email[0].address"
                    ></v-list-item>
                  </template>
                </v-autocomplete></v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="emailBatchForm.emailSubject" label="Subject" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="emailBatchForm.scope"
                    :items="['INDIVIDUAL', 'WORKPLACE', 'SEGMENT', 'GLOBAL']"
                    label="Scope"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea rows="3" auto-grow v-model="emailBatchForm.emailContentPlain" label="Content Plain"></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea rows="3" auto-grow v-model="emailBatchForm.emailContentHtml" label="Content Html"></v-textarea>
                </v-col>
                <v-col cols="12" md="6" v-if="showTemplateSelect">
                  <v-select
                    v-model="emailBatchForm.templateId"
                    :items="templates"
                    item-title="name"
                    item-value="templateId"
                    label="Choose template"
                    return-object="false"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" v-if="!showAfterDate">
                  <v-text-field
                    v-model="emailBatchForm.sendAfter"
                    label="Send After (YYYY-MM-DDTHH:MM:SS)"
                    required
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-file-upload multiple v-model="emailBatchForm.pdf_attachments" density="compact" variant="compact"></v-file-upload>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
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
          @click="sendBatchEmail"
        ></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
</style>
