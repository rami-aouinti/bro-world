<template>
  <v-container fluid class="py-6 d-flex justify-center">
    <v-card
      max-width="1280"
      class="pa-4"
      elevation="4"
      rounded="lg"
    >
      <!-- Titre et description -->
      <v-card-title class="text-h5 font-weight-bold">
        🎓 Présentation Slidev : Vitify Admin
      </v-card-title>
      <v-card-subtitle class="text-body-2 mb-4">
        Découvrez les fonctionnalités de votre back-office en quelques slides dynamiques.
      </v-card-subtitle>

      <!-- Conteneur iframe avec hauteur responsive -->
      <v-sheet
        class="overflow-hidden rounded-lg elevation-2"
        :style="{
          height: isMobile ? '280px' : '500px'
        }"
      >
        <!-- Iframe avec loader -->
        <v-overlay v-if="loading" absolute class="align-center justify-center" persistent>
          <v-progress-circular indeterminate color="primary" size="48" />
        </v-overlay>

        <iframe
          ref="iframeRef"
          :src="presentationUrl"
          @load="onLoad"
          allow="camera; microphone"
          allowfullscreen
          title="Présentation Slidev"
          style="width: 100%; height: 100%; border: none"
        />
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const loading = ref(true)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const presentationUrl = 'https://bro-world.eu/' // ou URL absolue

function onLoad() {
  loading.value = false
}

// Vuetify responsive detection
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
</script>
