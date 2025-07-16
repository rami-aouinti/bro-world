<script lang="ts" setup>
import { ref } from "vue";

const { user } = await useUserSession()
</script>

<template>
  <v-card
    elevation="10"
    id="2fa"
    class="bg-gradient-primary shadow-primary my-4"
    rounded="xl"
    variant="text"
  >
    <div class="px-6 py-6 d-flex">
      <h5 class="text-h5 font-weight-bold text-typo">
        Two-factor authentication
      </h5>
      <v-btn
        small
        :ripple="false"
        height="21"
        variant="text"
        class="px-3badge-font-size ms-auto text-success"
        >Enabled</v-btn
      >
    </div>
    <div class="px-6 py-6">
      <div class="d-flex">
        <p class="my-auto text-body font-weight-light">Security keys</p>
        <p
          class="text-secondary font-weight-light text-sm ms-auto my-auto me-3"
        >
          No Security Keys
        </p>
        <v-btn
          variant="text"
          class="px-4"
          small
        >
          Add
        </v-btn>
      </div>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="my-auto text-body font-weight-light">SMS Number</p>
        <p
          class="text-secondary editable font-weight-light text-sm ms-auto my-auto me-3"
        >
          {{ user.profile?.phone }}
        </p>
        <v-btn
          variant="text"
          class="px-4"
          small
        >
          Edit
        </v-btn>
      </div>
      <hr class="horizontal dark my-4" />
      <div class="d-flex">
        <p class="my-auto text-body font-weight-light">Authenticator app</p>
        <p
          class="text-secondary font-weight-light text-sm ms-auto my-auto me-3"
        >
          Not Configured
        </p>
        <v-btn
          variant="text"
          class="px-4"
          small
        >
          Set Up
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
