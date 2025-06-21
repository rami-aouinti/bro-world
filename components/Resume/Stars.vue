<template>
  <div class="d-flex align-center justify-space-between fixed-skill-line py-2">
    <span class="text-body-2">{{ label }}</span>
    <div class="d-flex">
      <v-progress-linear
        :model-value="score"
        height="6"
        rounded
        color="white"
        class="progress-bar"
      />
    </div>

  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: String,
  score: Number
});
</script>

<style scoped>
.progress-bar {
  width: 77px;
}
</style>
