<template>
  <v-container style="margin-top: -70px;">
    <v-card-text class="text-medium-emphasis pa-0">
      <form class="mx-auto" @submit.prevent="handleSubmit">
        <div class="card-padding">
          <v-text-field
            v-model="email"
            :label="t('register.email')"
            required
            class="font-size-input input-style"
            append-inner-icon="mdi-face"
            :disabled="loading"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :label="t('register.password')"
            required
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
          />
          <v-text-field
            v-model="repeatPassword"
            :type="showRepeatPassword ? 'text' : 'password'"
            :label="t('register.repeatPassword')"
            required
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="toggleRepeatPassword"
          />

          <v-checkbox v-model="checkbox" hide-details>
            <template #label>
              <span class="text-body text-sm ls-0">
                {{ t('register.agree') }}
                <a
                  href="javascript:"
                  @click="showTerms = true"
                  class="font-weight-bolder text-decoration-none text-primary"
                >
                  {{ t('register.terms') }}
                </a>
              </span>
            </template>
          </v-checkbox>

          <p v-if="error" class="mt-1 text-red d-flex justify-center">
            {{ error }}
          </p>

          <p class="mt-1 mb-2 font-weight-bold text-typo">
            {{ t('register.requirements') }}
          </p>

          <div class="d-sm-flex">
            <ul class="text-muted ps-6 mb-0">
              <li><h6 class="text-h7">{{ t('register.requirement1') }}</h6></li>
              <li><h6 class="text-h7">{{ t('register.requirement2') }}</h6></li>
            </ul>
          </div>

          <button
            :disabled="loading"
            type="submit"
            class="btn btn-outline-primary bg-primary rounded-xl text-decoration-none font-weight-bold text-uppercase py-2 px-6 me-2 mt-6 mb-2 w-100"
          >
            <v-progress-circular v-if="loading" indeterminate size="20" />
            <span v-else>{{ t('register.signUp') }}</span>
          </button>

          <p class="text-sm text-body mt-1 mb-0 d-flex justify-center">
            {{ t('register.haveAccount') }}
            <NuxtLink
              to="/login"
              class="text-primary text-decoration-none font-weight-bolder px-1"
            >
              {{ t('register.signIn') }}
            </NuxtLink>
          </p>
        </div>
      </form>
    </v-card-text>

    <v-dialog v-model="showTerms" max-width="600">
      <v-card class="mx-auto">
        <v-card-title class="text-h6 font-weight-bold">
          {{ t('register.termsTitle') }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-body-2 text-justify">
          <!-- Tu peux ici aussi traduire le contenu des conditions -->
          <p><strong>1. Introduction</strong><br>
            By accessing and using our platform ("Service"), you agree to be bound by these Terms and Conditions.</p>
          <!-- ... autres articles -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const checkbox = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showRepeatPassword = ref(false)
const showTerms = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleRepeatPassword = () => {
  showRepeatPassword.value = !showRepeatPassword.value
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  if (!checkbox.value) {
    error.value = t('register.errorTerms')
    loading.value = false
    return
  }

  if (!email.value || !password.value) {
    error.value = t('register.errorMissing')
    loading.value = false
    return
  }

  const { data, error: fetchError } = await useFetch('/api/auth/register', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
    },
  })

  if (data) {
    Notify.success(t('register.success'))
    router.push('/login')
  }

  if (fetchError.value) {
    console.error('Failed:', fetchError.value)
    error.value = fetchError.value.data?.message || t('register.errorGeneric')
  }

  loading.value = false
}
</script>

<style>
.v-sheet--offset {
  top: -44px;
  position: relative;
}
</style>
