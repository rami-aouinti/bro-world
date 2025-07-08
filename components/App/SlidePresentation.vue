<template>
  <v-container fluid class="pa-0 position-relative">
    <!-- Loader -->
    <v-overlay v-if="loading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-overlay>

    <!-- Iframe réduit en hauteur -->
    <v-sheet
      class="mx-auto my-6 elevation-3"
      max-width="1200"
      rounded="lg"
      style="height: 500px; overflow: hidden"
    >
      <iframe
        ref="iframeRef"
        :src="presentationUrl"
        @load="onLoad"
        allow="camera; microphone"
        allowfullscreen
        title="Présentation Slidev"
        style="width: 100%; height: 100%; border: none; border-radius: 12px"
      />
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const presentationUrl = '/vitify-slide/' // ou URL externe

function onLoad() {
  loading.value = false
}
</script>
