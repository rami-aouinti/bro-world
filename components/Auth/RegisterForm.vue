<template>
  <v-container>
    <v-card-text class="text-medium-emphasis pa-0">
      <form class="max-w-xxl w-full mx-auto" @submit.prevent="handleSubmit">
        <div class="card-padding">
          <v-text-field
            v-model="email"
            label="Username or Email"
            placeholder="Email"
            variant="outlined"
            required
            dense
            class="font-size-input input-style"
            :disabled="loading"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Password"
            variant="outlined"
            required
            dense
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
          />
          <v-text-field
            v-model="repeatPassword"
            :type="showRepeatPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Password"
            variant="outlined"
            required
            dense
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="toggleRepeatPassword"
          />
          <p v-if="error" class="mt-4 text-red d-flex justify-center">
            {{ error }}
          </p>
          <button
            :disabled="loading"
            type="submit"
            class="btn btn-outline-primary bg-primary rounded-xl text-decoration-none font-weight-bold text-uppercase py-2 px-6 me-2 mt-6 mb-2 w-100"
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="20"
            />
            <span v-else>Sign Up</span>
          </button>
          <p class="text-sm text-body mt-3 mb-0 d-flex justify-center">
            You have an account?
            <NuxtLink
              to="/login"
              class="text-dark text-decoration-none font-weight-bolder px-1"
            >
              Sign In
            </NuxtLink>
          </p>
        </div>
      </form>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const showRepeatPassword = ref(false)

const toggleRepeatPassword = () => {
  showRepeatPassword.value = !showRepeatPassword.value
}
async function handleSubmit() {
  loading.value = true

  const { data, error } = await useFetch('/api/auth/register', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      repeatPassword: repeatPassword.value,
    },
  })
  if (data) {
    Notify.success('Success logged !')
    router.push('/login')
  }
  if (error.value) {
    console.error('Failed:', error.value)
  }
}
</script>
<style>
.v-sheet--offset {
  top: -62px;
  position: relative;
}
</style>
