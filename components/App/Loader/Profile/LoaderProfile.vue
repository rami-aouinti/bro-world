<template>
  <v-row align="center">
    <!-- Avatar + Nom -->
    <v-col cols="12" class="d-flex align-center">
      <v-skeleton-loader type="avatar" class="me-4" />
      <v-skeleton-loader type="text" width="100%"  />
    </v-col>
  </v-row>
  <v-row>
    <!-- Platform Settings -->
    <v-col cols="12" md="4">
      <v-skeleton-loader type="boilerplate" class="pa-4 rounded-xl mb-4">
        <template #default>
          <div
            v-for="n in 4"
            :key="n"
            class="d-flex align-center mb-4"
          >
            <v-skeleton-loader type="avatar" class="me-3" />
            <div>
              <v-skeleton-loader type="text" width="120px" class="mb-1" />
              <v-skeleton-loader type="text" width="180px" />
            </div>
            <v-spacer />
            <v-skeleton-loader type="button" width="60px" />
          </div>
        </template>
      </v-skeleton-loader>
    </v-col>

    <!-- Profile Information -->
    <v-col cols="12" md="4">
      <v-skeleton-loader type="boilerplate" class="pa-4 rounded-xl mb-4">
        <template #default>
          <div
            v-for="n in 4"
            :key="n"
            class="d-flex align-center mb-4"
          >
            <v-skeleton-loader type="avatar" class="me-3" />
            <div>
              <v-skeleton-loader type="text" width="120px" class="mb-1" />
              <v-skeleton-loader type="text" width="180px" />
            </div>
            <v-spacer />
            <v-skeleton-loader type="button" width="60px" />
          </div>
        </template>
      </v-skeleton-loader>
    </v-col>

    <!-- Conversations -->
    <v-col cols="12" md="4">
      <v-skeleton-loader type="boilerplate" class="pa-4 rounded-xl mb-4">
        <template #default>
          <div
            v-for="n in 4"
            :key="n"
            class="d-flex align-center mb-4"
          >
            <v-skeleton-loader type="avatar" class="me-3" />
            <div>
              <v-skeleton-loader type="text" width="120px" class="mb-1" />
              <v-skeleton-loader type="text" width="180px" />
            </div>
            <v-spacer />
            <v-skeleton-loader type="button" width="60px" />
          </div>
        </template>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// Aucun script requis
</script>
