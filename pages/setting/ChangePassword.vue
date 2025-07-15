<script lang="ts" setup>
import { ref } from "vue";

const { user } = await useUserSession()
const pending = ref(false)

const passwordData = ref({
  oldPassword:  '',
  newPassword:  '',
  newRepeatPassword:  ''
});
const updatePassword = async () => {
  const formData = new FormData();
  formData.append('oldPassword', passwordData?.value.oldPassword);
  formData.append('newPassword', passwordData?.value.newPassword);
  formData.append('newRepeatPassword', passwordData?.value.newRepeatPassword);
  try {
    const response = await $fetch('/api/profile/password/update', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (response) {
      window.location.reload()
    }

  } catch (error) {
    console.error("Error delete profile:", error);
  }
};
</script>

<template>
  <v-card
    elevation="10"
    id="change"
    class="bg-gradient-primary shadow-primary py-4"
    rounded="xl"
    variant="text"
  >
    <div class="px-6 py-6">
      <h5 class="text-h5 font-weight-bold text-typo">Change Password</h5>
    </div>
    <div class="px-6 pb-6 pt-0">
      <v-row>
        <v-col cols="12">
          <v-text-field rounded="xl" label="Current password"
                        density="compact"
            color="#e91e63"
            variant="outlined"
                        v-model="passwordData.oldPassword"
            dense
            type="password"
            class="font-size-input input-style py-0"
          />
          <v-text-field density="compact" rounded="xl" label="New password"
            color="#e91e63"
            variant="outlined"
            dense
                        v-model="passwordData.newPassword"
            type="password"
            class="font-size-input input-style py-0"
          />
          <v-text-field density="compact" rounded="xl" label="Confirm new password"
            color="#e91e63"
            variant="outlined"
            dense
                        v-model="passwordData.newRepeatPassword"
            type="password"
            class="font-size-input input-style py-0"
          />
        </v-col>
      </v-row>

      <h5 class="mt-5 mb-2 text-h5 font-weight-bold text-typo">
        Password requirements
      </h5>
      <p class="text-muted font-weight-light mb-2">
        Please follow this guide for a strong password:
      </p>
      <div class="d-sm-flex">
        <ul class="text-muted ps-6 mb-0">
          <li>
            <span class="text-sm">One special characters</span>
          </li>
          <li>
            <span class="text-sm">Min 6 characters</span>
          </li>
          <li>
            <span class="text-sm">One number (2 are recommended)</span>
          </li>
          <li>
            <span class="text-sm">Change it often</span>
          </li>
        </ul>

        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              @click="updatePassword"
              color="primary"
              small
            >
              Update password
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card>
</template>
