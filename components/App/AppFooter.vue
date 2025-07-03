<template>
  <v-footer
    app
    height="32"
    class="app-footer"
    aria-label="Application footer"
    role="contentinfo"
  >
    <v-defaults-provider
      :defaults="{ VBtn: { variant: 'text', size: 'x-small' } }"
    >
      <AppNotification />
    </v-defaults-provider>
  </v-footer>
</template>

<script setup lang="ts">
import AppNotification from "~/components/App/AppNotification.vue";
</script>

<style scoped>
.app-footer {
  text-align: center;
  font-size: 0.875rem;
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-inline: 16px;
}
</style>
