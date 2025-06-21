<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <h1 class="text-h6 font-weight-bold mb-2">{{ t('contact.title') }}</h1>
        <v-form @submit.prevent="sendMessage">
          <v-text-field
            v-model="form.name"
            :label="t('contact.name')"
            required
            outlined
            class="text-align-auto mb-1"
          />

          <v-text-field
            v-model="form.email"
            :label="t('contact.email')"
            required
            type="email"
            outlined
            class="text-align-auto mb-1"
          />

          <v-text-field
            v-model="form.subject"
            :label="t('contact.subject')"
            required
            outlined
            class="text-align-auto mb-1"
          />

          <v-textarea
            v-model="form.message"
            :label="t('contact.message')"
            required
            auto-grow
            outlined
            class="text-align-auto mb-1"
          />

          <v-btn
            :disabled="loading"
            :loading="loading"
            type="submit"
            color="primary"
          >
            {{ t('contact.send') }}
          </v-btn>
        </v-form>
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold mb-2">{{ t('contact.location') }}</h2>
        <v-card color="primary" rounded="xl" variant="text" class="pa-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.357954112808!2d6.8267341!3d50.9487694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bf2624c3b909f9%3A0x91a64c5e276e91c6!2s50%C2%B056'55.6%22N%206%C2%B049'45.5%22E!5e0!3m2!1sen!2sde!4v1717777777777!5m2!1sen!2sde"
            width="100%"
            height="385"
            style="border:5px; border-radius: 12px"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
definePageMeta({
  layout: 'default',
  description: 'Contact page',
  breadcrumb: 'disabled',
})
const { t } = useI18n()
const loading = ref(false)
const error = ref('')
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

async function sendMessage() {
  error.value = ''
  loading.value = true

  const { data, error: fetchError } = await useFetch('/api/auth/contact', {
    method: 'POST',
    body: {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
    },
  })

  if (fetchError.value) {
    Notify.error(t('contact.error'))
    loading.value = false
    return
  }

  if (data.value) {
    Notify.success(t('contact.success'))
    loading.value = false
  }

  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>
