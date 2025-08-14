<script setup lang="ts">
import { ref } from 'vue'

function back() {
  window.history.back()
}
function refresh() {
  window.location.reload()
}
const router = useRouter()
const canGoBack = ref(false)
router.afterEach(() => {
  canGoBack.value = window.navigation.canGoBack
})
</script>
<template>
  <div class="d-none d-sm-flex align-center">
    <v-btn
      icon
      aria-label="can Go Back"
      title="can Go Back"
      color="default"
      :disabled="!canGoBack"
      @click="back()"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn
      icon
      aria-label="refresh"
      color="default"
      title="refresh"
      @click="refresh()">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>
