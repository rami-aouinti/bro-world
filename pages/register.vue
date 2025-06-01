<template>
  <div
    class="d-flex align-center justify-center"
    style="
      background-image: url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
      background-size: cover;
      background-position: center;
      min-height: 100vh;
    "
  >
    <span class="mask bg-gradient-default opacity-6" />
    <v-card
      class="border-radius-xl overflow-visible"
      max-width="450"
      min-width="350"
      rounded="xl"
      elevation="24"
    >
      <v-sheet
        class="v-sheet--offset mx-auto"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="lg"
        color="primary"
      >
        <div class="mt-9 py-3">
          <div class="text-h4 font-weight-bold d-flex justify-center">
            Bro World
          </div>
        </div>
        <v-row>
          <v-col cols="3" class="ms-auto d-flex justify-center">
            <v-btn
              variant="text"
              href="/api/auth/facebook"
              icon
            >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="3" class="d-flex justify-center">
            <v-btn variant="text" href="/api/auth/github" icon>
              <v-icon>mdi-github-circle</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="3" class="me-auto d-flex justify-center">
            <v-btn variant="text" href="/api/auth/google" icon>
              <v-icon>mdi-google</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-divider />
      <RegisterForm />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/components/Auth/RegisterForm.vue'

definePageMeta({
  title: 'register',
  layout: 'auth',
  middleware: 'guest',
})
</script>
