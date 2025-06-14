<template>
  <v-container style="margin-top: -40px;">
    <v-card-text class="text-medium-emphasis pa-1">
      <form class="mx-auto" @submit.prevent="handleSubmit">
        <div class="card-padding">
          <v-text-field
            v-model="username"
            :label="t('auth.usernameOrEmail')"
            required
            class="font-size-input input-style"
            append-inner-icon="mdi-face"
            :disabled="loading"
            :error="!!error"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :label="t('auth.password')"
            required
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
            :error="!!error"
          />

          <p v-if="error" class="mt-1 text-red text-caption d-flex justify-center">
            {{ error }}
          </p>

          <div class="text-right mt-2 mb-4">
            <NuxtLink to="/forgot-password" class="text-primary text-decoration-none text-sm">
              {{ t('auth.forgotPassword') }}
            </NuxtLink>
          </div>

          <button
            :disabled="loading"
            type="submit"
            class="btn btn-outline-primary bg-primary rounded-xl text-decoration-none font-weight-bold text-uppercase py-2 px-6 me-2 mb-2 w-100"
          >
            <v-progress-circular v-if="loading" indeterminate size="20" />
            <span v-else>{{ t('auth.signIn') }}</span>
          </button>

          <p class="text-sm text-body mt-3 mb-0 d-flex justify-center">
            {{ t('auth.signUpPrompt') }}
            <NuxtLink
              to="/register"
              class="text-primary text-decoration-none font-weight-bolder px-1"
            >
              {{ t('auth.signUp') }}
            </NuxtLink>
          </p>
        </div>
      </form>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'

const { t } = useI18n()
const auth = useAuthStore()
const { fetch: refreshSession } = useUserSession()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

async function handleSubmit() {
  error.value = ''
  loading.value = true

  if (!username.value || !password.value) {
    error.value = t('auth.requiredError')
    loading.value = false
    return
  }

  const { data, error: fetchError } = await useFetch('/api/auth/login', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value,
    },
  })

  if (fetchError.value) {
    error.value = t('auth.invalidError')
    loading.value = false
    return
  }

  if (data.value) {
    await refreshSession()
    await navigateTo('/')
  }
}
</script>
