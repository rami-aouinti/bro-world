<template>
  <v-container>
    <v-card-text class="text-medium-emphasis pa-1">
      <form class="max-w-xxl w-full mx-auto" @submit.prevent="handleSubmit">
        <div class="card-padding">
          <v-text-field
            v-model="username"
            label="Username or Email"
            placeholder="Username or Email"
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
            <span v-else>Sign In</span>
          </button>
          <p class="text-sm text-body mt-2 mb-0 d-flex justify-center">
            Or
            <NuxtLink
              to="/register"
              class="text-dark text-default-none font-weight-bolder px-2"
            >
              Sign Up</NuxtLink
            >
          </p>
        </div>
      </form>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession()

import { ref } from 'vue'
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  if (!username.value || !password.value) {
    error.value = 'Username and password are required.'
    loading.value = false
    return
  }

  await useFetch('/api/auth/login', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value,
    },
  })
    .then(async () => {
      // Refresh the session on client-side and redirect to the home page
      await refreshSession()
      Notify.success('Success logged !')
      await navigateTo('/')
    })
    .catch(() => alert('Bad credentials'))
}
</script>
<style>
.v-sheet--offset {
  top: -62px;
  position: relative;
}
</style>
