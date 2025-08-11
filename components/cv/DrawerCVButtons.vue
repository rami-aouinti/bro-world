<script setup lang="ts">
const props = defineProps({
  drawer: Object,
  loggedIn: Boolean,
})
const emit = defineEmits(['toggle'])
</script>

<template>
  <v-btn
    v-if="Object.values(props.drawer).some(Boolean)"
    icon="mdi-close"
    color="primary"
    class="fixed-plugin-button-news position-fixed my-1"
    @click="emit('toggle', 'visible')"
    aria-label="Close sidebar"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-school-outline"
    color="primary"
    class="fixed-plugin-cv-button-education position-fixed my-1"
    @click="emit('toggle', 'education')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-clipboard-outline"
    color="primary"
    class="fixed-plugin-cv-button-experience position-fixed my-1"
    @click="emit('toggle', 'experience')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-chart-bubble"
    color="primary"
    class="fixed-plugin-cv-button-skills position-fixed my-1"
    @click="emit('toggle', 'skills')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-flag-outline"
    color="primary"
    class="fixed-plugin-cv-button-language position-fixed my-1"
    @click="emit('toggle', 'language')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-gamepad-outline"
    color="primary"
    class="fixed-plugin-cv-button-interests position-fixed my-1"
    @click="emit('toggle', 'interests')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-vector-square"
    color="primary"
    class="fixed-plugin-cv-button-corner position-fixed my-1"
    @click="emit('toggle', 'corner')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-camera-outline"
    color="primary"
    class="fixed-plugin-cv-button-photo position-fixed my-1"
    @click="emit('toggle', 'photo')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-palette-outline"
    color="primary"
    class="fixed-plugin-cv-button-theme position-fixed my-1"
    @click="emit('toggle', 'theme')"
  />
</template>
