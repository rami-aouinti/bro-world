<template>
  <v-row justify="center" class="align-center justify-center">
    <v-col cols="12">
      <div class="user-status-banner">
        <v-card
          icon="mdi-alert-circle"
          rounded="xl" class="mx-3 text-center" variant="text" elevation="10"
        >
          <template #text>
            Your account is currently <strong class="text-secondary">not activated</strong>. Please check your email or
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
        </v-card>
      </div>
      <v-dialog v-model="success" max-width="400px">
        <v-card>
          <v-card-text class="font-weight-bold d-flex">
            <v-row>
              <v-col cols="2">
                <v-icon color="primary" icon="$success" />
              </v-col>
              <v-col cols="10">
                <div>A code has been sent to {{ truncate(user.email, 3) }}*****</div>
              </v-col>
              <v-col cols="12">
                <v-otp-input
                  v-model="otp"
                  :disabled="validating"
                  color="secondary"
                  variant="plain"
                ></v-otp-input>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :loading="validating"
              class="mt-2 text-none"
              height="30"
              color="primary"
              text="Validate"
              variant="plain"
              width="135"
              border
              rounded
              @click="sendActivation"
            ></v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    const { data } = await useFetch(`/api/auth/${otp.value}/activate`)
    success.value = data.value
    validating.value = false
  } catch (e) {
    error.value = true
    validating.value = false
  }
}
async function requestActivation() {
  success.value = true
  try {
    await useFetch(`/api/auth/request-verification`)
  } catch (e) {
    error.value = true
  }
}
</script>

<style scoped>
.user-status-banner {
  min-height: 60px;
}
</style>
