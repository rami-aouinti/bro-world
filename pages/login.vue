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
        <div class="mt-4 py-3">
          <div class="text-h4 font-weight-bold d-flex justify-center">
            Bro World
          </div>
        </div>
        <Social></Social>
      </v-sheet>
      <LoginForm />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/Auth/LoginForm.vue'
import Social from "~/components/Auth/Social.vue";

definePageMeta({
  title: 'login',
  layout: 'auth',
  middleware: 'guest',
  breadcrumb: 'disabled',
})
</script>
