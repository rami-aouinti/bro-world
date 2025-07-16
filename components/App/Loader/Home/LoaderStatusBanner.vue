<template>
  <v-card
    class="mb-3 px-4 py-3 d-flex align-center rounded-xl"
    variant="text"
    style="min-height: 60px;"
  >
    <v-skeleton-loader
      type="avatar"
      class="mr-3"
      width="48"
      height="48"
      style="flex-shrink: 0;"
    />
    <v-skeleton-loader
      class="rounded-pill"
      height="16px"
      width="100%"
      style="max-width: 300px;"
    />
  </v-card>
</template>

<script lang="ts" setup>
// Pas de script nécessaire pour ce loader simple
</script>
