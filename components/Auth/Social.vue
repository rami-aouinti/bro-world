<template>
  <v-row>
    <v-col cols="2" class="ms-auto d-flex justify-center">
      <NuxtLink to="/api/auth/github" class="text-decoration-none" style="color: inherit">
        <v-icon>mdi-instagram</v-icon>
      </NuxtLink>
    </v-col>
    <v-col cols="2" class="d-flex justify-center">
      <NuxtLink to="/api/auth/github" class="text-decoration-none" style="color: inherit">
        <v-icon>mdi-github-circle</v-icon>
      </NuxtLink>
    </v-col>
    <v-col cols="2" class="d-flex justify-center">
      <NuxtLink to="/api/auth/facebook" class="text-decoration-none" style="color: inherit">
        <v-icon>mdi-facebook</v-icon>
      </NuxtLink>
    </v-col>
    <v-col cols="2" class="d-flex justify-center">
      <NuxtLink to="/api/auth/google" class="text-decoration-none" style="color: inherit">
        <v-icon>mdi-google</v-icon>
      </NuxtLink>
    </v-col>
    <v-col cols="2" class="me-auto d-flex justify-center">
      <NuxtLink to="/api/auth/github" class="text-decoration-none" style="color: inherit">
        <v-icon>mdi-linkedin</v-icon>
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>
