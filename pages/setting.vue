<script setup lang="ts">
import BasicInfo from '~/pages/setting/BasicInfo.vue'
import ChangePassword from '~/pages/setting/ChangePassword.vue'
import TwoFactor from '~/pages/setting/TwoFactor.vue'
import Accounts from '~/pages/setting/Accounts.vue'
import Notifications from '~/pages/setting/Notifications.vue'
import Sessions from '~/pages/setting/Sessions.vue'
import DeleteAccount from '~/pages/setting/DeleteAccount.vue'
import UserAvatar from "~/components/App/UserAvatar.vue";
const { user } = await useUserSession()
const switche = true
const pending = ref(false)
const profile = ref<any>(null)
const loadProfile = async () => {
  pending.value = true
  if (user.value.username) {
    const { data } = await useFetch(`/api/profile/${user.value.username}`)
    if (data.value) {
      profile.value = data.value
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

definePageMeta({
  title: 'setting',
  layout: 'default',
  middleware: 'auth',
  breadcrumb: 'disabled',
})
</script>

<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col lg="12">
        <div
          v-if="pending"
          class="d-flex justify-center align-center"
          style="height: 25vh"
        >
          <v-progress-circular
            :size="120"
            :width="10"
            color="primary"
            indeterminate
          />
        </div>
        <v-card
          v-else
          rounded="xl"
          class="py-4"
          variant="text"
        >
          <div class="px-5">
            <v-row align="center" class="pa-0 ma-0">
              <!-- Avatar -->
              <v-col cols="auto">
                <UserAvatar :user="profile" />
              </v-col>

              <!-- Nom et titre -->
              <v-col cols="auto">
                <div>
                  <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                    {{ profile?.firstName || '' }} {{ profile?.lastName || '' }}
                  </h6>
                  <p class="mb-0 font-weight-light text-body text-sm">
                    {{ profile?.title || '' }}
                  </p>
                </div>
              </v-col>

              <!-- Switch visibilité -->
              <v-col
                cols="12"
                md="auto"
                class="d-flex align-center justify-end mt-3 mt-md-0"
              >
                <p v-if="switche" class="mb-0 text-body text-xs me-2">
                  Switch to invisible
                </p>
                <p v-else class="mb-0 text-body text-xs me-2">
                  Switch to visible
                </p>
                <v-switch
                  v-model="switche"
                  :ripple="false"
                  class="mt-0 pt-0 switch"
                  hide-details
                />
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
          <v-col lg="12" md="12" cols="12">
            <change-password />
          </v-col>
        </v-row>
        <v-row class="py-2">
          <v-col lg="12" md="12" cols="12">
            <two-factor />
          </v-col>
        </v-row>
        <v-row class="py-2">
          <v-col lg="12" md="12" cols="12">
            <accounts />
          </v-col>
        </v-row>
        <v-row class="py-2">
          <v-col lg="12" md="12" cols="12">
            <notifications :user="profile" />
          </v-col>
        </v-row>
        <v-row class="py-2">
          <v-col lg="12" md="12" cols="12">
            <sessions />
          </v-col>
        </v-row>
        <v-row class="py-2">
          <v-col lg="12" md="12" cols="12">
            <delete-account />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
