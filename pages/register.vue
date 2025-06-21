<script setup lang="ts">
import RegisterForm from '~/components/Auth/RegisterForm.vue'
import Social from "~/components/Auth/Social.vue";
import LoginForm from "~/components/Auth/LoginForm.vue";
const isRedirecting = ref(false)
definePageMeta({
  title: 'register',
  layout: 'auth',
  middleware: 'guest',
  breadcrumb: 'disabled',
})
</script>
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
        <div class="mt-12 py-3">
          <div class="text-h4 font-weight-bold d-flex justify-center">
            Bro World
          </div>
        </div>
        <Social @redirect="isRedirecting = true" />
      </v-sheet>
      <div class="pa-2">
        <v-progress-circular v-if="isRedirecting" indeterminate color="primary" size="80" class="mx-auto d-block" />
        <RegisterForm v-else />
      </div>
    </v-card>
  </div>
</template>


