<script setup>
import { onMounted, ref } from "vue";

const mapContainer = ref(null);
const { $googleMaps } = useNuxtApp();

onMounted(async () => {
  const google = await $googleMaps;

  new google.Map(mapContainer.value, {
    center: { lat: 48.8566, lng: 2.3522 },
    zoom: 12
  });
});
</script>

<template>
  <v-container>
    <v-card>
      <div ref="mapContainer" style="width: 100%; height: 400px;"></div>
    </v-card>
  </v-container>
</template>
