<template>
  <div class="section-header" :class="$attrs.class">
    <div class="title">{{ label }}</div>
    <div class="bar" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<style scoped>
.section-header{ margin-top:18px; }
.title{ font-size:22px; font-weight:800; letter-spacing:.4px; }
.bar{ height:3px; background: var(--accent,#b88b6a); margin-top:6px; width:100%; opacity:.8; }
</style>
