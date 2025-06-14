<template>
  <v-row>
    <v-col cols="2" class="ms-auto d-flex justify-center">
      <a @click="redirect('/api/auth/instagram')">
        <v-icon>mdi-instagram</v-icon>
      </a>
    </v-col>
    <v-col cols="2" class="d-flex justify-center">
      <a @click="redirect('/api/auth/github')">
        <v-icon>mdi-github-circle</v-icon>
      </a>
    </v-col>
    <v-col cols="2" class="d-flex justify-center">
      <a @click="redirect('/api/auth/facebook')">
        <v-icon>mdi-facebook</v-icon>
      </a>
    </v-col>
    <v-col cols="2" class="d-flex justify-center">
      <a @click="redirect('/api/auth/google')">
        <v-icon>mdi-google</v-icon>
      </a>
    </v-col>
    <v-col cols="2" class="me-auto d-flex justify-center">
      <a @click="redirect('/api/auth/linkedin')">
        <v-icon>mdi-linkedin</v-icon>
      </a>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const emit = defineEmits(['redirect'])

function redirect(url: string) {
  emit('redirect')
  window.location.href = url
}
</script>
