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
            label="Password"
            placeholder="Password"
            variant="outlined"
            required
            dense
            class="font-size-input input-style"
            type="password"
            :disabled="loading"
          />
          <v-text-field
            v-model="repeatPassword"
            label="Password"
            placeholder="Repeat Password"
            variant="outlined"
            required
            dense
            class="font-size-input input-style"
            type="password"
            :disabled="loading"
          />
          <p v-if="error" class="mt-4 text-red d-flex justify-center">
            {{ error }}
          </p>
          <button
            :disabled="loading"
            type="submit"
            class="btn btn-outline-primary bg-default rounded-xl text-decoration-none font-weight-bold text-uppercase py-2 px-6 me-2 mt-6 mb-2 w-100"
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="20"
            />
            <span v-else>Sign Up</span>
          </button>
          <p class="text-sm text-body mt-2 mb-0 d-flex justify-center">
            Or
            <NuxtLink
              to="/login"
              class="text-dark text-default-none font-weight-bolder px-2"
            >
              Sign In</NuxtLink
            >
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
