<template>
  <v-footer app>
    <v-spacer />
    <v-defaults-provider
      :defaults="{ VBtn: { variant: 'text', size: 'x-small' } }"
    >
      <AppNotification />
      <AppSettings />
    </v-defaults-provider>
  </v-footer>
</template>
<style>
.v-footer {
  padding: 0px 10px !important;
  > .v-btn--icon {
    .v-icon {
      height: 1.25em;
      width: 1.25em;
    }
  }
}
</style>
<script setup lang="ts">
import AppNotification from "~/components/App/AppNotification.vue";
import AppSettings from "~/components/App/AppSettings.vue";
</script>
