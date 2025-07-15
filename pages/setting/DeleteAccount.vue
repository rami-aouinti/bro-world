<script lang="ts" setup>
import { ref } from "vue";

const { user } = await useUserSession()
const pending = ref(false)

const deactivateProfile = async () => {
  try {
    const response = await $fetch('/api/profile/deactivate', {
      method: 'GET',
    })

    if (response) {
      window.location.reload()
    }

  } catch (error) {
    console.error("Error delete profile:", error);
  }
};

const deleteProfile = async () => {
  try {
    const response = await $fetch('/api/profile/delete', {
      method: 'DELETE',
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
    id="delete"
    class="bg-gradient-primary shadow-primary py-4"
    rounded="xl"
    variant="text"
  >
    <v-row>
      <v-col cols="12">
        <div class="px-6 py-6">
          <h5 class="text-h5 font-weight-bold text-typo mb-2">
            Delete Account
          </h5>
          <p class="text-sm text-body font-weight-light">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
      </v-col>
      <v-col cols="12" class="my-auto">
        <div class="px-6 pt-0">
          <div class="d-sm-flex align-center ms-auto">
            <v-btn
              @click="deactivateProfile"
              variant="text"
              class="font-weight-bolder btn-outline-secondary"
              small
            >
              Deactivate
            </v-btn>
            <v-btn
              @click="deleteProfile"
              variant="text"
              color="primary"
              small
            >
              Delete Account
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
