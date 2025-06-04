<template>
  <v-container style="margin-top: -70px;">
    <v-card-text class="text-medium-emphasis pa-0">
      <form class="mx-auto" @submit.prevent="handleSubmit">
        <div class="card-padding">
          <v-text-field
            v-model="email"
            label="Username or Email"
            required
            class="font-size-input input-style"
            append-inner-icon='mdi-face'
            :disabled="loading"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            required
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
          />
          <v-text-field
            v-model="repeatPassword"
            :type="showRepeatPassword ? 'text' : 'password'"
            label="Repeat Password"
            required
            class="font-size-input input-style"
            :disabled="loading"
            :append-inner-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="toggleRepeatPassword"
          />
          <v-checkbox
            v-model="checkbox"
            hide-details
          >
            <template v-slot:label>
              <span class="text-body text-sm ls-0"
              >I agree the
                <a
                  href="javascript:" @click="showTerms = true"
                  class="font-weight-bolder text-decoration-none text-primary"
                >Terms and Conditions</a
                ></span
              >
            </template>
          </v-checkbox>
          <p v-if="error" class="mt-1 text-red d-flex justify-center">
            {{ error }}
          </p>
          <p class="mt-1 mb-2 font-weight-bold text-typo">
            Password requirements
          </p>
          <div class="d-sm-flex">
            <ul class="text-muted ps-6 mb-0">
              <li>
                <h6 class="text-h7">One special characters</h6>
              </li>
              <li>
                <h6 class="text-h7">Min 6 characters</h6>
              </li>
            </ul>
          </div>
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
          <p class="text-sm text-body mt-1 mb-0 d-flex justify-center">
            You have an account?
            <NuxtLink
              to="/login"
              class="text-primary text-decoration-none font-weight-bolder px-1"
            >
              Sign In
            </NuxtLink>
          </p>
        </div>
      </form>
    </v-card-text>
    <v-dialog v-model="showTerms" max-width="600">
      <v-card class="mx-auto">
        <v-card-title class="text-h6 font-weight-bold">
          Terms and Conditions
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-body-2 text-justify">
          <p><strong>1. Introduction</strong><br>
            By accessing and using our platform ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part, please do not use the Service.</p>

          <p><strong>2. Eligibility</strong><br>
            You must be at least 13 years old to use this Service. By registering, you represent and warrant that you meet this requirement.</p>

          <p><strong>3. Account Responsibility</strong><br>
            You are responsible for maintaining the confidentiality of your login credentials. You are also fully responsible for all activities that occur under your account.</p>

          <p><strong>4. Acceptable Use</strong><br>
            You agree not to:<br>
            - Use the Service for any unlawful purposes;<br>
            - Upload or share content that is offensive, harmful, or violates the rights of others;<br>
            - Attempt to gain unauthorized access to other users’ accounts or our systems.</p>

          <p><strong>5. Content Ownership</strong><br>
            You retain ownership of the content you post. However, by posting on our platform, you grant us a non-exclusive, worldwide license to display, distribute, and promote your content within the platform.</p>

          <p><strong>6. Termination</strong><br>
            We reserve the right to suspend or terminate your access to the Service at any time and without notice, if we believe you have violated these Terms.</p>

          <p><strong>7. Privacy</strong><br>
            Your personal data will be processed according to our <a href="/privacy-policy" class="text-primary text-decoration-none">Privacy Policy</a>. By using the Service, you consent to such processing.</p>

          <p><strong>8. Modifications</strong><br>
            We may revise these Terms from time to time. Continued use of the Service implies acceptance of the updated Terms.</p>

          <p><strong>9. Contact</strong><br>
            If you have any questions about these Terms, please contact us at:<br>
            📧 <a href="mailto:support@bro-world.org" class="text-primary text-decoration-none">support@bro-world.org</a></p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const email = ref('')
const checkbox = ref(false)
const password = ref('')
const repeatPassword = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showTerms = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const showRepeatPassword = ref(false)

const toggleRepeatPassword = () => {
  showRepeatPassword.value = !showRepeatPassword.value
}
async function handleSubmit() {
  loading.value = true
  if (!checkbox.value) {
    error.value = 'Username and password are required.'
    loading.value = false
    return
  }
  if (!email.value || !password.value) {
    error.value = 'You must accept the terms and conditions to proceed.'
    loading.value = false
    return
  }
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
  top: -44px;
  position: relative;
}
</style>
