<template>
  <v-row justify="center" class="align-center justify-center mx-4">
    <v-col cols="12" class="mx-4">
      <div class="user-status-banner">
        <v-banner
          v-if="loggedIn && !user?.enabled"
          color="primary"
          icon="mdi-alert-circle"
          lines="one"
          class="mb-0 px-8 text-center rounded-lg"
        >
          <template #text>
            Your account is currently <strong>not activated</strong>. Please check your email or
            <span
              class="text-primary font-weight-medium cursor-pointer"
              role="button"
              tabindex="0"
              @click="requestActivation"
              @keydown.enter="requestActivation"
            >
              request activation
            </span>
            or contact support.
          </template>
        </v-banner>
      </div>

      <div v-if="success">
        <h3 class="text-h6 mb-2">
          Please enter the one time password to verify your account
        </h3>

        <div>A code has been sent to {{ truncate(user.email, 3) }}*****</div>

        <v-otp-input
          v-model="otp"
          :disabled="validating"
          color="primary"
          variant="plain"
        ></v-otp-input>

        <v-btn
          :loading="validating"
          class="mt-6 text-none bg-surface-variant"
          height="40"
          text="Validate"
          variant="plain"
          width="135"
          border
          rounded
          @click="sendActivation"
        ></v-btn>
      </div>

      <v-snackbar v-model="success" color="success" timeout="3000">
        Activation request sent successfully.
      </v-snackbar>
      <v-snackbar v-model="error" color="error" timeout="3000">
        Failed to send activation request.
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { user, loggedIn } = useUserSession()
const success = ref(false)
const error = ref(false)
import { shallowRef } from 'vue'

const otp = shallowRef('')
const validating = shallowRef(false)

async function sendActivation() {
  validating.value = true
  try {
    const { data } = await useFetch(`/api/auth/${otp.value}/request-activation`)
    success.value = data.value
    validating.value = false
  } catch (e) {
    error.value = true
    validating.value = false
  }
}
async function requestActivation() {
  try {
    await useFetch(`/api/auth/request-activation`, {
      method: 'POST',
    })
    success.value = true
  } catch (e) {
    error.value = true
  }
}
</script>

<style scoped>
.user-status-banner {
  min-height: 80px;
}
</style>
