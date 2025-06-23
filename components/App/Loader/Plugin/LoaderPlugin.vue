<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="d-flex flex-column justify-space-between mx-3"
                rounded="xl"
                variant="text"
                min-height="180">

          <v-row no-gutters>
            <!-- Avatar -->
            <v-col cols="3" class="d-flex justify-center align-center">
              <v-skeleton-loader type="avatar" />
            </v-col>

            <!-- Infos -->
            <v-col cols="9">
              <v-skeleton-loader type="text" class="mb-2" width="80%" />
              <v-skeleton-loader type="text" class="mb-1" width="70%" />
              <v-skeleton-loader type="text" class="mb-1" width="50%" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Aucun script requis
</script>
