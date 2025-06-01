<script setup lang="ts">
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>
<template class="d-none d-md-block">
  <v-defaults-provider
    :defaults="{ VBtn: { rounded: 0, class: 'px-5' } }"
  >
    <v-btn
      v-tooltip="`${isFullscreen ? 'Full Screen' : 'Minimize'}`"
      style="height: 31px; padding-top: 2px"
      large
      :icon="isFullscreen ? 'ph:corners-in' : 'ph:corners-out'"
      @click="toggleFullscreen()"
    />
  </v-defaults-provider>
</template>
