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
      aria-label="can Go Back"
      title="can Go Back"
      :disabled="!canGoBack"
      icon="ph:arrow-left"
      @click="back()"
    />
    <v-btn
      aria-label="refresh"
      title="refresh"
      icon="ph:arrow-clockwise" @click="refresh()" />
  </div>
</template>
