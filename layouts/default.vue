<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main>
      <NuxtPage />
    </v-main>
    <AppFooter />
    <Analytics />
  </v-app>
</template>
<script setup lang="ts">
import AppFooter from '~/components/App/AppFooter.vue'
import AppDrawer from '~/components/App/AppDrawer.vue'
import AppBar from '~/components/App/AppBar.vue'
import { Analytics } from '@vercel/analytics/vue';
</script>
<style scoped>
/* replace padding with margin to limit scrollbar in v-main */
.v-main {
  padding-top: 0;
  padding-bottom: 0;
  /* https://github.com/vuetifyjs/vuetify/issues/15202 */
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
  /* margin-top: var(--v-layout-top);
  margin-bottom: var(--v-layout-bottom);
  height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom)); */
  overflow-y: auto;
  transition-property: padding;
}
</style>
