<template>
  <div
    class="triangle"
    :class="[placement === 'top' ? 'triangle-top' : 'triangle-bottom']"
  />
</template>

<script setup lang="ts">
defineProps<{ placement: 'top' | 'bottom' }>()
</script>

<style scoped>
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  margin: auto;
}
.triangle-top {
  border-top: 10px solid #091b2d;
  margin-bottom: -10px;
}
.triangle-bottom {
  border-bottom: 10px solid #091b2d;
  margin-top: -10px;
}
</style>
