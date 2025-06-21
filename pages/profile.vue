<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { user } = await useUserSession()
const profile = ref<any>(null)
const pending = ref(false)
const avatarUrl = ref('')
const loadProfile = async () => {
  pending.value = true
  if (user.value.username) {
    const { data } = await useFetch(`/api/profile/${user.value.username}`)
    if (data.value) {
      profile.value = data.value
      avatarUrl.value = data.value?.profile?.photo ?? '/person.png'
    }
  }
  pending.value = false
}

watch(user.value.username, () => {
  loadProfile()
}, { immediate: true })

onMounted(async () => {
  await loadProfile()
})

const accountSettings = ref([
  { text: 'Email me when someone follows me', switchState: true },
  { text: 'Email me when someone answers on my post', switchState: false },
])

const applicationSettings = ref([
  { text: 'New launches and projects', switchState: true },
  { text: 'Monthly product updates', switchState: false },
])

const conversations = ref([
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
])
definePageMeta({
  layout: 'default',
  description: 'Profile page',
  breadcrumb: 'disabled',
  middleware: 'auth',
})
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col lg="12">
        <div v-if="pending" class="d-flex justify-center align-center" style="height: 25vh">
          <v-progress-circular :size="120" :width="10" color="primary" indeterminate />
        </div>
        <v-card v-else rounded="xl" class="py-4" variant="text">
          <div class="px-5">
            <v-row align="center" class="pa-0 ma-0">
              <!-- Avatar -->
              <v-col cols="auto">
                <v-avatar size="50" class="border-primary border-lg rounded-circle">
                  <NuxtImg width="50" height="50" :src="avatarUrl" alt="Avatar" />
                </v-avatar>
              </v-col>
              <!-- Name -->
              <v-col cols="auto">
                <div>
                  <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                    {{ profile?.firstName }} {{ profile?.lastName }}
                  </h6>
                  <p class="mb-0 font-weight-light text-body text-sm">
                    {{ profile?.profile?.title }}
                  </p>
                </div>
              </v-col>
              <!-- Buttons -->
              <v-col cols="auto" class="ms-auto d-flex align-center justify-end">
                <v-btn variant="text" to="/setting" class="font-weight-bolder me-1">
                  <v-icon icon="mdi-settings" size="20" />
                </v-btn>
                <v-btn variant="text" to="/inbox" class="font-weight-bolder">
                  <v-icon icon="mdi-message" size="20" />
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" md="4" cols="12">
        <v-card rounded="xl" class="h-60" variant="text">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">{{ t('profile.platform') }}</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <h6 class="text-uppercase text-body text-xs font-weight-bolder">
              {{ t('profile.account') }}
            </h6>
            <v-list class="bg-transparent" elevation="0">
              <v-list-item v-for="setting in accountSettings" :key="setting.text">
                <v-row class="d-flex align-center">
                  <v-col cols="2">
                    <v-switch v-model="setting.switchState" hide-details class="d-inline-flex mt-0 pt-0 switch ms-auto" />
                  </v-col>
                  <v-col cols="10">
                    <div class="ms-4 text-body text-sm">{{ t(`profile.settings.${setting.text}`) }}</div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
            <h6 class="text-uppercase text-body text-xs font-weight-bolder mt-4">
              {{ t('profile.application') }}
            </h6>
            <v-list class="bg-transparent" elevation="0">
              <v-list-item v-for="setting in applicationSettings" :key="setting.text">
                <v-row class="d-flex align-center">
                  <v-col cols="2">
                    <v-switch v-model="setting.switchState" hide-details class="d-inline-flex mt-0 pt-0 switch ms-auto" />
                  </v-col>
                  <v-col cols="10">
                    <div class="ms-4 text-body text-sm">{{ t(`profile.settings.${setting.text}`) }}</div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
      <v-col lg="4" md="4" cols="12">
        <v-card rounded="xl" class="h-100" variant="text">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">{{ t('profile.information') }}</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <p class="text-sm font-weight-light text-body">
              {{ profile?.profile?.description }}
            </p>
            <v-list class="bg-transparent" elevation="0">
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">{{ t('profile.fullName') }}:</strong>
                  &nbsp; {{ profile?.firstName ?? '' }} {{ profile?.lastName ?? '' }}
                </div>
              </v-list-item>
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">{{ t('profile.mobile') }}:</strong>
                  &nbsp; {{ profile?.profile?.phone ?? '' }}
                </div>
              </v-list-item>
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">{{ t('profile.email') }}:</strong>
                  &nbsp; {{ profile?.email ?? t('profile.notProvided') }}
                </div>
              </v-list-item>
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">{{ t('profile.location') }}:</strong>
                  &nbsp; {{ profile?.locale ?? '' }}
                </div>
              </v-list-item>
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">{{ t('profile.social') }}:</strong>
                  &nbsp;
                  <!-- Social Icons if available -->
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
      <v-col lg="4" md="4" cols="12">
        <v-card rounded="xl" class="h-100" variant="text">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">{{ t('profile.conversations.title') }}</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <v-list class="bg-transparent" elevation="0">
              <v-list-item-group class="border-radius-sm">
                <v-list-item v-for="conversation in conversations" :key="conversation.user" class="px-0 border-radius-sm mb-2">
                  <div class="d-flex align-center">
                    <v-avatar width="48" height="48" class="shadow border-radius-lg me-4">
                      <NuxtImg width="48" height="48" :src="conversation.avatar" alt="Avatar" class="border-radius-lg" />
                    </v-avatar>
                    <div>
                      <h6 class="mb-0 text-sm text-typo font-weight-bold">
                        {{ conversation.user }}
                      </h6>
                      <p class="mb-0 text-xs text-body font-weight-light">
                        {{ conversation.message }}
                      </p>
                    </div>
                    <div class="ms-auto">
                      <v-btn small variant="text" width="auto" class="text-primary font-weight-bolder">
                        {{ t('profile.reply') }}
                      </v-btn>
                    </div>
                  </div>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
