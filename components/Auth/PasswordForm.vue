<template>
  <v-container>
    <v-card-text class="text-medium-emphasis pa-1">
      <v-form @submit.prevent="handleSubmit" ref="formRef" lazy-validation>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          append-inner-icon="mdi-face"
          required
        />
        <v-text-field
          v-model="password"
          label="New Password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePassword"
          :rules="passwordRules"
          required
        />

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="togglePassword"
          :rules="[confirmPasswordRule]"
          required
        />

        <v-btn
          :loading="loading"
          type="submit"
          color="primary"
          class="mt-4 w-100 rounded-xl text-white font-weight-bold"
        >
          Reset Password
        </v-btn>

        <p v-if="error" class="mt-3 text-red text-center">
          {{ error }}
        </p>
        <p v-if="success" class="mt-3 text-green text-center">
          {{ success }}
        </p>
      </v-form>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const formRef = ref()

const route = useRoute()
const router = useRouter()

const token = computed(() => route.query.token as string)

const passwordRules = [
  (v: string) => !!v || 'Password is required.',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters.'
]

const confirmPasswordRule = (v: string) =>
  v === password.value || 'Passwords do not match.'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  if (!token.value) {
    error.value = 'Token is missing or invalid.'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await useFetch('/api/auth/reset-password', {
    method: 'POST',
    body: {
      email: email.value,
      token: token.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    }
  })

  if (fetchError.value) {
    error.value = fetchError.value.data?.message || 'Something went wrong.'
    loading.value = false
    return
  }

  success.value = 'Password has been reset successfully. Redirecting to login...'

  setTimeout(() => {
    router.push('/login')
  }, 2500)
}
</script>
<style>
.v-sheet--offset {
  top: -44px;
  position: relative;
}
</style>
