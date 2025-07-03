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
      <AppSettings />
    </v-defaults-provider>
  </v-footer>
</template>

<script setup lang="ts">
import AppSettings from "~/components/App/AppSettings.vue";
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
  padding: 0px 10px !important;
  padding-inline: 16px;
}
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
