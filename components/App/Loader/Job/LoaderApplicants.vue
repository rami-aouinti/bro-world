<template>
  <v-col
    v-for="n in 6"
    :key="n"
    cols="12"
    md="6"
    lg="6"
  >
    <v-card rounded="xl" class="pa-4 mx-3">
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
</template>

<script lang="ts" setup>
</script>
