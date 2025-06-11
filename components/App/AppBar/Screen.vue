<script setup lang="ts">
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>
<template>
  <div class="d-none">
    <v-defaults-provider
      :defaults="{ VBtn: { rounded: 0, class: 'px-5' } }"
    >
      <v-btn
        style="height: 21px; padding-top: 2px"
        aria-label="screen"
        title="screen"
        large
        size="20"
        class="ml-2"
        :icon="isFullscreen ? 'ph:corners-in' : 'ph:corners-out'"
        @click="toggleFullscreen()"
      />
    </v-defaults-provider>
  </div>
</template>
