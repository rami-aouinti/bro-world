<template>
  <v-row align="center">
    <!-- Avatar + Nom -->
    <v-col cols="12" class="d-flex align-center">
      <v-skeleton-loader type="avatar" class="me-4" />
      <v-skeleton-loader type="text" width="100%" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card rounded="xl" elevation="1">
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="heading" width="140px" class="mb-4" />
          </v-col>

          <!-- Title / Description / First name -->
          <v-col cols="12" md="4">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>

          <!-- Last Name / Gender / Date of Birth -->
          <v-col cols="12" md="4">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>

          <!-- Email / Confirmation -->
          <v-col cols="12" md="6">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>
          <v-col cols="12" md="6">
            <v-skeleton-loader type="text" width="100%" height="50px" class="rounded-md elevation-1" />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// Pas de logique nécessaire ici pour le skeleton
</script>

<style scoped>
/* Ajout d'une transition douce pour le squelette si nécessaire */
.v-skeleton-loader {
  transition: all 0.3s ease-in-out;
}
</style>
