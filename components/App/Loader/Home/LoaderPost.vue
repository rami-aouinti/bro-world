<template>
  <!-- Simule l’input “Hello John, new post?” -->
  <v-card class="mb-3 px-4 py-3 d-flex align-center rounded-xl" variant="text">
    <v-skeleton-loader type="avatar" class="mr-3" />
    <v-skeleton-loader
      class="rounded-pill"
      height="36px"
      width="100%"
    />
  </v-card>

  <!-- Simule les boutons Video / Photo / Story -->
  <v-card class="mb-4 px-4 py-3 d-flex justify-space-around rounded-xl" variant="text">
    <v-skeleton-loader type="button" width="80px" class="mx-2" />
    <v-skeleton-loader type="button" width="80px" class="mx-2" />
    <v-skeleton-loader type="button" width="80px" class="mx-2" />
  </v-card>

  <!-- Simule la zone des stories -->
  <v-card class="mb-4 px-4 py-3 rounded-xl" variant="text">
    <v-row dense justify="start" no-gutters>
      <v-col v-for="n in 5" :key="n" class="mx-2" cols="auto">
        <v-skeleton-loader type="avatar" class="mx-auto" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
</script>
