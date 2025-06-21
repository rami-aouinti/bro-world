<template>
  <v-container style="margin-top: -70px;">
    <v-card-text class="text-medium-emphasis pa-0">
      <form class="mx-auto" @submit.prevent="handleSubmit">
        <div class="card-padding">
          <v-text-field
            v-model="email"
            :label="t('register.email')"
            :class="isRtl ? 'text-end' : 'text-start'"
            required
            class="font-size-input input-style"
            append-inner-icon="mdi-face"
            :disabled="loading"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :class="isRtl ? 'text-end' : 'text-start'"
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
            :class="isRtl ? 'text-end' : 'text-start'"
            :disabled="loading"
            :append-inner-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="toggleRepeatPassword"
          />

          <v-row
            :class="isRtl ? 'flex-row-reverse' : ''"
            class="align-center"
          >
            <v-col cols="auto">
              <v-checkbox
                v-model="checkbox"
                hide-details
                class="ma-0 pa-0"
                density="compact"
              />
            </v-col>
            <v-col>
    <span class="text-body text-sm ls-0" :class="isRtl ? 'text-end' : 'text-start'">
      {{ t('register.agree') }}
      <a
        href="javascript:"
        @click="showTerms = true"
        class="font-weight-bolder text-decoration-none text-primary"
      >
        {{ t('register.terms') }}
      </a>
    </span>
            </v-col>
          </v-row>

          <p v-if="error" class="mt-1 text-red d-flex justify-center">
            {{ error }}
          </p>

          <p class="mt-1 mb-2 font-weight-bold text-typo" :class="isRtl ? 'text-end' : 'text-start'">
            {{ t('register.requirements') }}
          </p>

          <div class="d-sm-flex" :class="isRtl ? 'rtl-block' : 'ltr-block'">
            <ul class="text-muted ps-6 mb-0" :class="isRtl ? 'rtl-block' : 'ltr-block'">
              <li><h6 class="text-h7" :class="isRtl ? 'rtl-block' : 'ltr-block'">{{ t('register.requirement1') }}</h6></li>
              <li><h6 class="text-h7" :class="isRtl ? 'rtl-block' : 'ltr-block'">{{ t('register.requirement2') }}</h6></li>
            </ul>
          </div>

          <button
            :disabled="loading"
            type="submit"
            class="btn btn-outline-primary bg-primary rounded-xl text-decoration-none font-weight-bold text-uppercase py-2 px-6 me-2 mt-6 mb-2 w-100"
          >
            <v-progress-circular v-if="loading" indeterminate size="20" />
            <span :class="isRtl ? 'text-end' : 'text-start'" v-else>{{ t('register.signUp') }}</span>
          </button>

          <p class="text-sm text-body mt-1 mb-0 d-flex justify-center" :class="isRtl ? 'text-end' : 'text-start'">
            {{ t('register.haveAccount') }}
            <NuxtLink
              :to="localePath('/login')"
              class="text-primary text-decoration-none font-weight-bolder px-1"
              :class="isRtl ? 'text-end' : 'text-start'"
            >
              {{ t('register.signIn') }}
            </NuxtLink>
          </p>
        </div>
      </form>
    </v-card-text>

    <v-dialog v-model="showTerms" max-width="600">
      <v-card class="mx-auto">
        <v-card-title class="text-h6 font-weight-bold" :class="isRtl ? 'text-end' : 'text-start'">
          {{ t('register.termsTitle') }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-body-2 text-justify">
        <Terms></Terms>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const router = useRouter()
import { useLocalePath } from '#i18n'
import Terms from "~/components/Auth/Terms.vue";
const { t, locale } = useI18n()
const localePath = useLocalePath()
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
.rtl-block {
  direction: rtl;
  text-align: right;
}
.ltr-block {
  direction: ltr;
  text-align: left;
}
.v-sheet--offset {
  top: -44px;
  position: relative;
}
</style>
