<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <v-list style="background-color: transparent;"
                :lines="false"
                nav>
          <v-list-item-group class="border-radius-sm">
            <v-list-item
              class="px-3 py-1 border-radius-lg mb-2"
              v-for="item in menu"
              :key="item.id"
              :prepend-icon="item.icon"
            >
              <a :href="item.id" class="text-decoration-none">
                <v-list-item-title>

                  <div class="d-flex flex-column">
                    <span class="text-dark text-sm">{{ item.text }}</span>
                  </div>

                </v-list-item-title>
              </a>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </teleport>
    </client-only>
    <v-row>
      <v-col lg="12">
        <div v-if="pending">
          <LoaderSetting />
        </div>
        <div v-else>
          <v-card id="profile" rounded="xl" class="bg-gradient-primary shadow-primary py-1" variant="text" elevation="10">
            <div class="px-5">
              <v-row align="center" class="pa-0 ma-0">
                <v-col cols="auto">
                  <div class="avatar-wrapper">
                    <v-avatar size="50" class="border-primary border-lg rounded-circle">
                      <NuxtImg format="webp"
                               cover width="50" height="50" :src="avatarUrl" alt="Avatar" />
                    </v-avatar>
                    <v-btn icon size="15" class="upload-btn" @click="triggerUpload">
                      <v-icon>mdi-camera</v-icon>
                    </v-btn>
                    <v-file-input
                      ref="fileInput"
                      v-model="avatar"
                      label="Upload Story"
                      outlined
                      required
                      accept="image/*"
                      show-size
                      style="display: none"
                      @update:modelValue="handleUpload"
                    />
                  </div>
                </v-col>
                <v-col cols="auto">
                  <div>
                    <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                      {{ profile?.firstName || '' }} {{ profile?.lastName || '' }}
                    </h6>
                    <p class="mb-0 font-weight-light text-body text-sm">
                      {{ profile?.profile?.title || '' }}
                    </p>
                  </div>
                </v-col>
                <v-col cols="auto" class="ms-auto d-flex align-center justify-end">
                  <p v-if="switche" class="mb-0 text-body text-xs me-2">
                    {{ t('setting.visible') }}
                  </p>
                  <p v-else class="mb-0 text-body text-xs me-2">
                    {{ t('setting.invisible') }}
                  </p>
                  <v-switch v-model="switche" :ripple="false" class="mt-0 pt-0 switch" hide-details />
                </v-col>
              </v-row>
            </div>
          </v-card>
          <v-row class="py-2">
            <v-col lg="12" md="12" cols="12">
              <basic-info />
            </v-col>
          </v-row>
          <v-row class="py-2">
            <v-col md="6" cols="12">
              <change-password />
            </v-col>
            <v-col md="6" cols="12">
              <two-factor />
            </v-col>
          </v-row>
          <v-row class="py-2">
            <v-col md="6" cols="12">
              <accounts />
            </v-col>
            <v-col md="6" cols="12">
              <notifications :user="profile" />
            </v-col>
          </v-row>
          <v-row class="py-2">
            <v-col md="6" cols="12">
              <sessions />
            </v-col>
            <v-col md="6" cols="12">
              <delete-account />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import BasicInfo from '~/pages/setting/BasicInfo.vue'
import ChangePassword from '~/pages/setting/ChangePassword.vue'
import TwoFactor from '~/pages/setting/TwoFactor.vue'
import Accounts from '~/pages/setting/Accounts.vue'
import Notifications from '~/pages/setting/Notifications.vue'
import Sessions from '~/pages/setting/Sessions.vue'
import DeleteAccount from '~/pages/setting/DeleteAccount.vue'
import LoaderSetting from "~/components/App/Loader/Profile/LoaderSetting.vue";
const canTeleport = ref(false)
const { user, refresh } = await useUserSession()
const switche = ref(true)
const pending = ref(true)
const profile = ref<any>(null)
const avatar = ref<File | null>(null)
const avatarUrl = ref('')
const fileInput = ref(null)
const menu  = ref ([
  {
    icon: "mdi-person",
    text: "Profile",
    id: "#profile",
  },
  {
    icon: "mdi-account-card-details",
    text: "Basic Info",
    id: "#basic",
  },
  {
    icon: "mdi-lock",
    text: "Change Password",
    id: "#change",
  },
  {
    icon: "mdi-security",
    text: "2FA",
    id: "#2fa",
  },
  {
    icon: "mdi-badge",
    text: "Accounts",
    id: "#account",
  },
  {
    icon: "mdi-bell",
    text: "Notifications",
    id: "#notifications",
  },
  {
    icon: "mdi-settings",
    text: "Sessions",
    id: "#sessions",
  },
  {
    icon: "mdi-delete",
    text: "Delete Account",
    id: "#delete",
  }
])
const triggerUpload = () => {
  fileInput.value?.click()
}

async function handleUpload(file: File) {
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await useFetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    const data = response.data.value
    if (data) {
      const reader = new FileReader()
      reader.onload = () => {
        avatarUrl.value = reader.result
      }
      reader.readAsDataURL(file)
    }
  } catch (e) {
    console.error('Upload error', e)
  }
}

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
  window.scrollTo({ top: 0 })
  await loadProfile()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  breadcrumb: 'disabled',
  title: 'Settings',
  description: 'Manage your account settings, profile, and preferences.',
  meta: [
    { name: 'description', content: 'Manage your account settings, profile, and preferences.' },
    { name: 'keywords', content: 'settings, profile, account, preferences' },
  ],
  head: {
    title: 'Settings',
    meta: [
      { name: 'description', content: 'Manage your account settings, profile, and preferences.' },
      { name: 'keywords', content: 'settings, profile, account, preferences' },
    ],
  },
  scrollToTop: true,
})
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  display: inline-block;
}
.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
</style>
