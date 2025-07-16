<template>
  <v-col cols="12" v-for="n in 3" :key="n">
    <v-card rounded="xl" class="pa-4 mb-4">
      <!-- Header Skeleton -->
      <v-row>
        <v-col cols="2">
          <v-skeleton-loader type="avatar" class="mx-auto" />
        </v-col>
        <v-col cols="10">
          <v-skeleton-loader type="text" class="mb-2" width="60%" />
          <v-skeleton-loader type="text" width="40%" />
        </v-col>
      </v-row>

      <!-- Infos principales -->
      <v-row class="mt-2">
        <v-col cols="6">
          <v-skeleton-loader type="text" width="70%" class="mb-1" />
          <v-skeleton-loader type="text" width="50%" />
        </v-col>
        <v-col cols="6">
          <v-skeleton-loader type="text" width="60%" class="mb-1" />
          <v-skeleton-loader type="text" width="40%" />
        </v-col>
      </v-row>

      <!-- Skills section -->
      <v-row class="mt-4">
        <v-col cols="12" md="4" v-for="i in 3" :key="i">
          <v-skeleton-loader type="text" class="mb-2" width="50%" />
          <div class="d-flex flex-wrap ga-2">
            <v-skeleton-loader type="chip" v-for="j in 3" :key="j" />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
</script>
