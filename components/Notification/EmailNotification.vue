<script setup lang="ts">
import { ref, defineProps } from 'vue'
const valid = ref(false)
const loading = ref(false)
const showTemplateSelect = ref(false)
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
const selectedRecipientsCc = [
  {
    "emailCc": [
      {
        "address": "rami.aouinti@gmail.com",
        "name": "rami"
      },
      {
        "address": "rami.aouinti@tkdeutschland.de",
        "name": "tkd"
      }
    ],
  }];
const selectedRecipientsBcc = [
  {
    "emailBcc":
      [
        {
          "address": "rami.aouinti@tkdeutschland.de",
          "name": "rami"
        },
        {
          "address": "rami.aouinti@gmail.com",
          "name": "rami"
        }
      ]
  }
];
const selectedRecipientsReplyTo = [{
  "emailReplyTo": [
    {
      "address": "rami.aouinti@gmail.com",
      "name": "rami"
    },
    {
      "address": "rami.aouinti@tkdeutschland.de",
      "name": "tkd"
    }
  ]
}];

const props = defineProps({
  templates: { type: Array, default: () => [] }
})
const emailForm = ref({
  channel: 'EMAIL',
  recipients: [],
  emailSenderEmail: "admin@tkd360.com",
  emailSenderName: "admin",
  templateId: 0,
  emailRecipientsCc: [],
  emailRecipientsBcc: [],
  emailRecipientsReplyTo: [],
  emailSubject: '',
  emailContentPlain: '',
  emailContentHtml: '',
  scope: 'INDIVIDUAL',
  sendAfter: '2025-05-10T23:30:00',
  pdf_attachments: []
})

function resetForm() {
  emailForm.value = {
    channel: 'EMAIL',
    recipients: [],
    emailSenderEmail: "admin@tkd360.com",
    emailSenderName: "admin",
    templateId: 0,
    emailRecipientsCc: [],
    emailRecipientsBcc: [],
    emailRecipientsReplyTo: [],
    emailSubject: '',
    emailContentPlain: '',
    emailContentHtml: '',
    scope: 'INDIVIDUAL',
    sendAfter: '2025-05-10T23:30:00',
    pdf_attachments: []
  };
}

async function sendEmail() {
  loading.value = true
  emailForm.value.recipients = [
    {
      email: emailForm.value.recipients.map(r => r.email[0]),
      variables: emailForm.value.recipients[0]?.variables ?? {}
    }
  ];

  emailForm.value.emailRecipientsCc = [
    {
      emailCc: emailForm.value.emailRecipientsCc.map(r => r.emailCc[0]),
    }
  ];
  emailForm.value.emailRecipientsBcc = [
    {
      emailBcc: emailForm.value.emailRecipientsBcc.map(r => r.emailBcc[0]),
    }
  ];
  emailForm.value.emailRecipientsReplyTo = [
    {
      emailReplyTo: emailForm.value.emailRecipientsReplyTo.map(r => r.emailReplyTo[0]),
    }
  ];

  emailForm.value.templateId = emailForm.value.templateId.templateId;

  const formData = new FormData();
  formData.append('channel', emailForm.value.channel);
  formData.append('emailSenderEmail', emailForm.value.emailSenderEmail);
  formData.append('emailSenderName', emailForm.value.emailSenderName);
  formData.append('templateId', emailForm.value.templateId);
  formData.append('emailSubject', emailForm.value.emailSubject);
  formData.append('emailContentPlain', emailForm.value.emailContentPlain);
  formData.append('emailContentHtml', emailForm.value.emailContentHtml);
  formData.append('scope', emailForm.value.scope);
  formData.append('sendAfter', emailForm.value.sendAfter);
  formData.append('recipients', JSON.stringify(emailForm.value.recipients));
  formData.append('emailRecipientsCc', JSON.stringify(emailForm.value.emailRecipientsCc));
  formData.append('emailRecipientsBcc', JSON.stringify(emailForm.value.emailRecipientsBcc));
  formData.append('emailRecipientsReplyTo', JSON.stringify(emailForm.value.emailRecipientsReplyTo));

  emailForm.value.pdf_attachments.forEach((file, index) => {
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
    });

    if (!authResponse.ok) throw new Error('Failed to authenticate');

    const authData = await authResponse.json();
    const token = authData.token;

    const response = await fetch('https://localhost/api/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    console.log('Success :', data);
    loading.value = false;
    resetForm();
    Notify.success(data.status);
  } catch (error) {
    console.error('Error :', error);
    Notify.error(error.message || 'Erreur inconnue');
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
            <span class="text-subtitle-1 font-weight-medium">Email Notification Individual</span>
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
        <v-divider></v-divider>
        <div>
          <v-row class="pa-3">
            <v-col>
              <v-form v-model="valid">
                <v-row>
                  <v-col cols="12" md="3">
                    <v-text-field v-model="emailForm.emailSubject" label="Subject" />
                  </v-col>
                  <v-col cols="12" md="3"><v-select
                    v-model="emailForm.scope"
                    :items="['INDIVIDUAL', 'WORKPLACE', 'SEGMENT', 'GLOBAL']"
                    label="Scope"
                    required
                  /></v-col>
                  <v-col cols="12" md="3" v-if="showTemplateSelect">
                    <v-select
                      v-model="emailForm.templateId"
                      :items="props.templates"
                      item-title="name"
                      item-value="templateId"
                      label="Choose template"
                      return-object="false"
                      clearable
                    ></v-select></v-col>
                  <v-col cols="12" md="3" v-if="!showAfterDate">
                    <v-text-field
                      v-model="emailForm.sendAfter"
                      label="Send After (YYYY-MM-DDTHH:MM:SS)"
                    /></v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      v-model="emailForm.recipients"
                      :items="selectedRecipients"
                      color="blue-grey-lighten-2"
                      item-title="name"
                      item-value="name"
                      label="To"
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
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      v-model="emailForm.emailRecipientsCc"
                      :items="selectedRecipientsCc"
                      color="blue-grey-lighten-2"
                      item-title="name"
                      item-value="name"
                      label="Cc"
                      chips
                      closable-chips
                      multiple
                    >
                      <template v-slot:chip="{ props, item }">
                        <v-chip
                          v-bind="props"
                          :prepend-avatar="item.raw.avatar"
                          :text="item.raw.emailCc[0].address"
                        ></v-chip>
                      </template>

                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="item.raw.avatar"
                          :title="item.raw.emailCc[0].address"
                        ></v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      v-model="emailForm.emailRecipientsBcc"
                      :items="selectedRecipientsBcc"
                      color="blue-grey-lighten-2"
                      item-title="name"
                      item-value="name"
                      label="Bcc"
                      chips
                      closable-chips
                      multiple
                    >
                      <template v-slot:chip="{ props, item }">
                        <v-chip
                          v-bind="props"
                          :prepend-avatar="item.raw.avatar"
                          :text="item.raw.emailBcc[0].address"
                        ></v-chip>
                      </template>

                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="item.raw.avatar"
                          :title="item.raw.emailBcc[0].address"
                        ></v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      v-model="emailForm.emailRecipientsReplyTo"
                      :items="selectedRecipientsReplyTo"
                      color="blue-grey-lighten-2"
                      item-title="name"
                      item-value="name"
                      label="replyTo"
                      chips
                      closable-chips
                      multiple
                    >
                      <template v-slot:chip="{ props, item }">
                        <v-chip
                          v-bind="props"
                          :prepend-avatar="item.raw.avatar"
                          :text="item.raw.emailReplyTo[0].address"
                        ></v-chip>
                      </template>

                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="item.raw.avatar"
                          :title="item.raw.emailReplyTo[0].address"
                        ></v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="3">
                    <v-textarea rows="4" auto-grow v-model="emailForm.emailContentPlain" label="Content Plain"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-textarea rows="4" auto-grow v-model="emailForm.emailContentHtml" label="Content Html"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-upload v-model="emailForm.pdf_attachments" multiple density="compact" variant="compact"></v-file-upload>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </div>
      </template>
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
          @click="sendEmail"
        ></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
</style>
