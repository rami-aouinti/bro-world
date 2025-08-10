<template>
  <div class="info-row">
    <div class="label"><v-icon :icon="icon" size="18" class="mr-2"/>{{ label }}</div>
    <div class="value"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; label: string }>()
</script>

<style scoped>
.info-row{ display:flex; align-items:center; gap:12px; background:#f3f3f3; border-radius:6px; padding:6px 10px; margin:8px; }
.label{ width:100px; font-weight:600; opacity:.85; display:flex; align-items:center; }
.value{ flex:1; }
</style>
