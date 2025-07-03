<template>
  <v-card
    class="mb-4 pa-4 rounded-xl"
    variant="text"
    style="min-height: 200px;"
  >
    <v-skeleton-loader
      type="heading, paragraph, paragraph"
      class="mb-3"
    />
    <v-skeleton-loader
      type="image"
      height="100px"
      class="mb-3"
    />
    <v-skeleton-loader
      type="avatar, heading"
      class="d-flex align-center"
      style="gap: 12px;"
    />
  </v-card>
</template>

<script lang="ts" setup>
// Pas de script nécessaire pour ce loader
</script>
